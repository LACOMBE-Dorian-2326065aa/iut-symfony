<?php

namespace App\Controller;

use App\Entity\Quizz;
use App\Output\ListOutput;
use App\Output\Quizz\DetailedQuizzOutput;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/quizz')]
final class QuizzController extends AbstractController
{
    #[Route('/{quizz}', name: 'quizz_details', methods: ['GET'])]
    public function getQuizzDetails(Quizz $quizz): Response
    {
        return $this->json(
            new DetailedQuizzOutput($quizz)
        );
    }
}
