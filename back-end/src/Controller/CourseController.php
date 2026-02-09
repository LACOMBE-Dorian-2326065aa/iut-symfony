<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\User;
use App\Output\Course\CourseOutput;
use App\Output\Course\DetailedCourseOutput;
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

    #[Route('/{id}', name: 'course_detail')]
    public function getCourseDetail(int $id): Response
    {
        $course = $this->courseRepository->find($id);

        if (!$course) {
            return $this->json(['error' => 'Course not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(
            new DetailedCourseOutput($course)
        );
    }

    #[Route('/user/{user}', name: 'course_by_user')]
    public function getCourseByUser(User $user): Response
    {
        $courses = $this->courseRepository->findBy(['user' => $user]);

        return $this->json(
            new ListOutput($courses, CourseOutput::class)
        );
    }
}
