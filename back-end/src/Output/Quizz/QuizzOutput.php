<?php

namespace App\Output\Quizz;

use App\Entity\Quizz;
use App\Output\Course\CourseOutput;
use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class QuizzOutput
{
    public int $id;
    public string $name;
    public CourseOutput $course;

    public function __construct(Quizz $quizz)
    {
        $this->id = $quizz->getId();
        $this->name = $quizz->getName();
        $this->course = new CourseOutput($quizz->getCourse());
    }

    public function build()
    {
        return $this;
    }
}
