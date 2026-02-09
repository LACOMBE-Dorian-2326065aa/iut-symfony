<?php

namespace App\Output\Course;

use App\Entity\Course;
use App\Output\Document\DocumentOutput;
use App\Output\ListOutput;
use App\Output\Quizz\QuizzOutput;
use App\Output\User\UserOutput;
use App\Output\Video\VideoOutput;
use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class DetailedCourseOutput extends CourseOutput
{
    public ListOutput $videos;
    public ListOutput $documents;
    public ListOutput $quizzs;
    public UserOutput $user;

    public function __construct(Course $course)
    {
        parent::__construct($course);
        $this->videos = new ListOutput($course->getVideos(), VideoOutput::class);
        $this->documents = new ListOutput($course->getDocuments(), DocumentOutput::class);
        $this->quizzs = new ListOutput($course->getQuizzs(), QuizzOutput::class);
        $this->user = new UserOutput($course->getUser());
    }

    public function build()
    {
        return $this;
    }
}
