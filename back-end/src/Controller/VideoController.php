<?php

namespace App\Controller;

use App\Output\ListOutput;
use App\Output\Video\VideoOutput;
use App\Repository\VideoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/video')]
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
}
