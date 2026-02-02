<?php

namespace App\Output\Course;

use App\Entity\Course;
use App\Output\Document\DocumentOutput;
use App\Output\ListOutput;
use App\Output\Video\VideoOutput;
use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class DetailedCourseOutput
{
    public int $id;
    public string $name;
    public ListOutput $videos;
    public ListOutput $documents;

    public function __construct(Course $course)
    {
        $this->id = $course->getId();
        $this->name = $course->getName();
        $this->videos = new ListOutput($course->getVideos(), VideoOutput::class);
        $this->documents = new ListOutput($course->getDocuments(), DocumentOutput::class);
    }

    public function build()
    {
        return $this;
    }
}
