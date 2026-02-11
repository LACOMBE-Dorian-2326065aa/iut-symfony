<?php

namespace App\Controller;

use App\Repository\DocumentRepository;
use Smalot\PdfParser\Parser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/ai')]
final class AiController extends AbstractController
{
    private HttpClientInterface $httpClient;
    private string $apiKey;
    private string $apiUrl;
    private string $uploadDir;

    public function __construct(
        HttpClientInterface $httpClient,
        #[Autowire('%env(MISTRAL_API_KEY)%')] string $apiKey,
        #[Autowire('%env(MISTRAL_API_URL)%')] string $apiUrl,
        #[Autowire('%upload_dir%')] string $uploadDir
    ) {
        $this->httpClient = $httpClient;
        $this->apiKey = $apiKey;
        $this->apiUrl = $apiUrl;
        $this->uploadDir = $uploadDir;
    }

    #[Route('/prompt', name: 'ai_prompt', methods: ['POST'])]
    public function prompt(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $payload = is_array($payload) ? $payload : [];
        $content = trim((string) ($payload['content'] ?? ''));

        if ($content === '') {
            return $this->json(['error' => 'Content is required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $responsePayload = $this->requestQuiz($content, $payload);

            return $this->json($responsePayload);
        } catch (\Throwable $exception) {
            return $this->json([
                'error' => 'AI request error',
                'details' => $exception->getMessage(),
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/document-quiz/{id}', name: 'ai_document_quiz', methods: ['POST'])]
    public function documentQuiz(int $id, Request $request, DocumentRepository $documentRepository): JsonResponse
    {
        $document = $documentRepository->find($id);

        if (!$document || !$document->getCourse()) {
            return $this->json(['error' => 'Document not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $filePath = $this->uploadDir . '/' . $document->getCourse()->getId() . '/' . $document->getPath();

        if (!is_file($filePath)) {
            return $this->json(['error' => 'Document file not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $payload = json_decode($request->getContent(), true);
        $payload = is_array($payload) ? $payload : [];
        $payload['title'] = trim((string) ($payload['title'] ?? $document->getName()));

        try {
            $content = $this->extractPdfText($filePath);

            if (trim($content) === '') {
                return $this->json(['error' => 'Unable to extract text from PDF'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $responsePayload = $this->requestQuiz($content, $payload);

            return $this->json($responsePayload);
        } catch (\Throwable $exception) {
            return $this->json([
                'error' => 'PDF processing error',
                'details' => $exception->getMessage(),
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
    }

    private function extractPdfText(string $filePath): string
    {
        $parser = new Parser();
        $pdf = $parser->parseFile($filePath);
        $text = $pdf->getText();

        // Clean invalid UTF-8 sequences
        $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);
        // Remove control characters except newlines/spaces
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text);
        // Normalize whitespace
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    private function requestQuiz(string $content, array $payload): array
    {
        if (trim($this->apiKey) === '') {
            throw new \RuntimeException('Mistral API key is not configured');
        }

        $model = (string) ($payload['model'] ?? 'mistral-small-latest');
        $temperature = (float) ($payload['temperature'] ?? 0.2);
        $questionCount = (int) ($payload['question_count'] ?? 5);
        $answersPerQuestion = (int) ($payload['answers_per_question'] ?? 4);
        $questionCount = $questionCount > 0 ? $questionCount : 5;
        $answersPerQuestion = $answersPerQuestion > 1 ? $answersPerQuestion : 4;
        
        // Calculate dynamic max tokens based on question count (approximately 100 tokens per question)
        $calculatedMaxTokens = max(700, $questionCount * 100 + 200);
        $maxTokens = (int) ($payload['max_tokens'] ?? $calculatedMaxTokens);
        $quizTitle = trim((string) ($payload['title'] ?? 'Quiz'));

        $systemPrompt = <<<PROMPT
Tu es un générateur de quiz QCM au format JSON.
Tu dois répondre UNIQUEMENT avec un JSON valide, sans texte ni code markdown.
Format attendu :
{
  "name": "Titre du Quiz",
  "questions": [
    {"title": "La question ?", "correctAnswer": 1},
    {"title": "Autre question ?", "correctAnswer": 0}
  ]
}
Règles :
- Génère {$questionCount} questions
- Chaque question a 2 réponses : true (1) ou false (0)
- Une seule réponse correcte par question (0 ou 1)
- Les questions doivent être basées sur le contenu fourni
- Réponds UNIQUEMENT avec le JSON valide
PROMPT;

        $userPrompt = <<<PROMPT
Titre du quiz: {$quizTitle}
Contenu:
{$content}
PROMPT;

        $response = $this->httpClient->request('POST', rtrim($this->apiUrl, '/') . '/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemPrompt,
                    ],
                    [
                        'role' => 'user',
                        'content' => $userPrompt,
                    ],
                ],
                'temperature' => $temperature,
                'max_tokens' => $maxTokens,
            ],
            'timeout' => 30,
        ]);

        $statusCode = $response->getStatusCode();
        $responseContent = $response->toArray(false);

        if ($statusCode >= 400) {
            throw new \RuntimeException('AI request failed');
        }

        $assistantMessage = (string) ($responseContent['choices'][0]['message']['content'] ?? '');
        
        // Extract JSON from response (handle markdown code blocks and extra text)
        $assistantJson = null;
        
        // Try to extract JSON from markdown code block
        if (preg_match('/```(?:json)?\s*\n?([\s\S]*?)\n?```/', $assistantMessage, $matches)) {
            $assistantJson = json_decode($matches[1], true);
        }
        
        // If not found in markdown, try direct JSON parsing
        if ($assistantJson === null || json_last_error() !== JSON_ERROR_NONE) {
            // Try to find and extract JSON object
            if (preg_match('/\{[\s\S]*\}/', $assistantMessage, $matches)) {
                $assistantJson = json_decode($matches[0], true);
            }
        }
        
        // Fallback: try direct parsing
        if ($assistantJson === null || json_last_error() !== JSON_ERROR_NONE) {
            $assistantJson = json_decode($assistantMessage, true);
        }
        
        // Validate that we have proper quiz data
        if (json_last_error() === JSON_ERROR_NONE && is_array($assistantJson) && !empty($assistantJson)) {
            // Ensure the required fields are present
            if (isset($assistantJson['name']) && isset($assistantJson['questions']) && is_array($assistantJson['questions'])) {
                $responsePayload = [
                    'data' => $assistantJson,
                ];
                return $responsePayload;
            }
        }
        
        // If we reach here, JSON parsing or validation failed
        throw new \RuntimeException('Failed to parse quiz data from AI response: ' . json_last_error_msg() . ' | Raw: ' . substr($assistantMessage, 0, 500));
    }
}