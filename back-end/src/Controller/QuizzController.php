<?php

namespace App\Controller;

use App\Entity\Course;
use App\Entity\Question;
use App\Entity\Quizz;
use App\Output\ListOutput;
use App\Output\Quizz\DetailedQuizzOutput;
use App\Output\Quizz\QuizzOutput;
use App\Repository\CourseRepository;
use App\Repository\QuestionRepository;
use App\Repository\QuizzRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/create', name: 'quizz_create', methods: ['POST'])]
    public function createQuizz(
        Request $request,
        QuizzRepository $quizzRepository,
        QuestionRepository $questionRepository,
        CourseRepository $courseRepository
    ): Response
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        $quizzName = $data['name'];
        $questions = $data['questions'];
        $courseId = $data['courseId'];

        $course = $courseRepository->find($courseId);
        if (!$course) {
            return $this->json(['error' => 'Course not found'], 404);
        }

        $quizz = new Quizz();
        $quizz->setName($quizzName)
            ->setCourse($course);
        $quizzRepository->save($quizz, true);

        foreach ($questions as $questionData) {
            $question = new Question();
            $question->setTitle($questionData['title'])
                ->setCorrectAnswer($questionData['correctAnswer'])
                ->setQuizz($quizz);
            $questionRepository->save($question, true);
        }

        return $this->json(
            new DetailedQuizzOutput($quizz),
            Response::HTTP_CREATED
        );
    }

    #[Route('/course/{course}', name: 'quizz_by_course', methods: ['GET'])]
    public function getQuizzByCourse(Course $course): Response
    {
        $quizzs = $course->getQuizzs();

        return $this->json(
            new ListOutput($quizzs, QuizzOutput::class)
        );
    }
}
