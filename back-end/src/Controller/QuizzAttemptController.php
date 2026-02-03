<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use App\Output\ListOutput;
use App\Output\QuizzAttempt\QuizzAttemptOutput;
use App\Repository\QuizzAttemptRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/quizz-attempt')]
final class QuizzAttemptController extends AbstractController
{
    private QuizzAttemptRepository $quizzAttemptRepository;

    public function __construct(QuizzAttemptRepository $quizzAttemptRepository)
    {
        $this->quizzAttemptRepository = $quizzAttemptRepository;
    }

    #[Route('', name: 'quizz_attempt_list')]
    public function getAllQuizzAttempts(): Response
    {
        $quizzAttempts = $this->quizzAttemptRepository->findAll();

        return $this->json(
            new ListOutput($quizzAttempts, QuizzAttemptOutput::class)
        );
    }

    #[Route('/complete', name: 'quizz_attempt_complete_list')]
    public function getAllCompleteQuizzAttempts(): Response
    {
//        $quizzAttempts = $this->quizzAttemptRepository->findBy(['isComplete' => true]);
//
//        return $this->json(
//            new ListOutput($quizzAttempts, QuizzAttemptOutput::class)
//        );

        return $this->json([]);
    }
}
