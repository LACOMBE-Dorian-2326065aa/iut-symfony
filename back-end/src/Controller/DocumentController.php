<?php

namespace App\Controller;

use App\Entity\Document;
use App\Output\Document\DocumentOutput;
use App\Output\ListOutput;
use App\Repository\CourseRepository;
use App\Repository\DocumentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/document')]
final class DocumentController extends AbstractController
{
    private DocumentRepository $documentRepository;

    public function __construct(DocumentRepository $documentRepository)
    {
        $this->documentRepository = $documentRepository;
    }

    #[Route('', name: 'document_list', methods: ['GET'])]
    public function getAllDocuments(): Response
    {
        $documents = $this->documentRepository->findAll();

        return $this->json(
            new ListOutput($documents, DocumentOutput::class)
        );
    }

    #[Route('/upload', name: 'document_detail', methods: ['POST'])]
    public function uploadDocument(Request $request, CourseRepository $courseRepository): Response
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        $file = $data['file'];
        $fileContent = base64_decode($file);

        $fileName = $data['name'];
        $courseId = $data['courseId'];
        $numberOfPages = $data['numberOfPages'];

        $course = $courseRepository->find($courseId);
        if (!$course) {
            return $this->json(['error' => 'Course not found'], 404);
        }

        if (!$file) {
            return $this->json(['error' => 'No file provided'], 400);
        }

        $uploadDir = $this->getParameter('upload_dir') . '/' . $courseId;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        file_put_contents(
            $uploadDir . '/' . $fileName . '.pdf',
            $fileContent
        );

        $newDocument = new Document();
        $newDocument->setName($fileName)
            ->setCourse($course)
            ->setPath($fileName . '.pdf')
            ->setNumberOfPages($numberOfPages);

        return $this->json(['message' => 'Document upload endpoint']);
    }
}
