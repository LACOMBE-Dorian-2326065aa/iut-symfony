<?php

namespace App\Controller;

use App\Output\Course\CourseOutput;
use App\Output\ListOutput;
use App\Repository\CourseRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/course')]
final class CourseController extends AbstractController
{
    private CourseRepository $courseRepository;

    public function __construct(CourseRepository $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    #[Route('', name: 'course_list')]
    public function getAllCourses(): Response
    {
        $courses = $this->courseRepository->findAll();

        return $this->json(
            new ListOutput($courses, CourseOutput::class)
        );
    }
}
