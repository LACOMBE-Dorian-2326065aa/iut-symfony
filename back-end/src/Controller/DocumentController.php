<?php

namespace App\Controller;

use App\Output\Document\DocumentOutput;
use App\Output\ListOutput;
use App\Repository\DocumentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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

    #[Route('', name: 'document_list')]
    public function getAllDocuments(): Response
    {
        $documents = $this->documentRepository->findAll();

        return $this->json(
            new ListOutput($documents, DocumentOutput::class)
        );
    }
}
