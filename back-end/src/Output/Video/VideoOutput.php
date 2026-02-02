<?php

namespace App\Output\Video;

use App\Entity\Video;

class VideoOutput
{
    public int $id;
    public string $name;
    public int $duration;
    public string $path;

    public function __construct(Video $video)
    {
        $this->id = $video->getId();
        $this->name = $video->getName();
        $this->duration = $video->getDuration();
        $this->path = $video->getPath();
    }

    public function build()
    {
        return $this;
    }
}
