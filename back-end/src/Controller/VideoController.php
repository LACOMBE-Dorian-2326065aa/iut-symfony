<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Course;
use App\Entity\Video;
use App\Output\ListOutput;
use App\Output\Video\VideoOutput;
use App\Repository\VideoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/video')]
#[ApiResource]
final class VideoController extends AbstractController
{
    private VideoRepository $videoRepository;

    public function __construct(VideoRepository $videoRepository)
    {
        $this->videoRepository = $videoRepository;
    }

    #[Route('', name: 'video_list')]
    public function getAllVideos(): Response
    {
        $videos = $this->videoRepository->findAll();

        return $this->json(
            new ListOutput($videos, VideoOutput::class)
        );
    }

    #[Route('/upload/{course}/{videoName}', name: 'video_upload', methods: ['POST'])]
    public function uploadVideo(
        Course $course,
        string $videoName,
        Request $request
    ): Response {
        $video = $request->files->get('video');

        if (!$video) {
            return $this->json(
                ['error' => 'No video file provided'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $uploadDir = $this->getParameter('upload_dir') . '/' . $course->getId();

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $filename = $videoName . '.mp4';

        $video->move($uploadDir, $filename);

        $newVideo = new Video();
        $newVideo->setName($videoName)
            ->setPath($filename)
            ->setCourse($course)
            ->setDuration(15);

        $this->videoRepository->save($newVideo, true);

        return $this->json(['message' => 'Video uploaded'], Response::HTTP_NOT_IMPLEMENTED);
    }
}
