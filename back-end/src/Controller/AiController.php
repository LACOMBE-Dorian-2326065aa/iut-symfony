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

RÈGLES IMPÉRATIVES - NIVEAU CONFIRMÉ: 1. DIFFICULTÉ DES QUESTIONS: - Questions approfondies nécessitant une compréhension fine du texte - Éviter les questions trop évidentes ou superficielles - Tester la capacité d'analyse et de synthèse - Poser des questions sur les nuances, les implications et les détails subtils - Utiliser des formulations complexes qui demandent de la réflexion 2. PIÈGES DANS LES RÉPONSES (OBLIGATOIRE): - Chaque mauvaise réponse doit être PLAUSIBLE et contenir un piège - Utiliser des informations partiellement vraies mais incomplètes - Mélanger des éléments vrais et faux dans une même proposition - Inverser subtilement des concepts similaires - Utiliser des termes du texte dans de faux contextes - Proposer des réponses presque correctes avec une erreur subtile - Inclure des confusions fréquentes ou des contresens logiques 3. TYPES DE PIÈGES À UTILISER: - Inversion de cause et conséquence - Confusion entre termes similaires mais distincts - Généralisation abusive d'un cas particulier - Restriction excessive d'un concept général - Ajout/omission d'un élément clé - Confusion temporelle (avant/après, antérieur/postérieur) - Négation subtile qui change le sens - Chiffres ou dates légèrement modifiés 4. STRUCTURE TECHNIQUE: - Exactement 15 questions - Exactement 4 propositions par question - correctAnswer = index (0, 1, 2 ou 3) de la bonne réponse - Une seule réponse correcte par question - Varier la position de la bonne réponse (pas toujours en A ou D) 5. COUVERTURE DU TEXTE: - Questions réparties sur l'ensemble du texte - Tester différents aspects : détails, concepts, relations, implications - Équilibrer entre questions factuelles pointues et questions analytiques 6. FORMAT DE SORTIE: - JSON valide uniquement - Aucun commentaire, aucun texte explicatif - Pas de backticks markdown EXEMPLES DE BONNES QUESTIONS AVEC PIÈGES: Question: "Selon le texte, quelle est la principale différence entre X et Y ?" - Réponse correcte: "X utilise A tandis que Y se base sur B" - Piège 1: "X utilise B tandis que Y se base sur A" (inversion) - Piège 2: "X et Y utilisent tous deux A mais dans des contextes différents" (fausse similitude) - Piège 3: "X utilise A exclusivement, Y n'utilise jamais A" (généralisation abusive) Question: "Quelle affirmation concernant le processus Z est exacte ?" - Réponse correcte: "Z nécessite l'étape A avant l'étape B pour être efficace" - Piège 1: "Z nécessite l'étape B avant l'étape A pour être efficace" (inversion d'ordre) - Piège 2: "Z nécessite l'étape A, l'étape B est optionnelle" (information partielle) - Piège 3: "Z nécessite uniquement l'étape A pour être efficace" (omission d'élément clé)
Mais surtout, respecte strictement le nombre de questions demandées, pas plus, pas moins.
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