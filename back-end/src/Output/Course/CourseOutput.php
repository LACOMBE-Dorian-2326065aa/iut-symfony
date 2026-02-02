<?php

namespace App\Output\Course;

use App\Entity\Course;
use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class CourseOutput
{
    public int $id;
    public string $name;

    public function __construct(Course $course)
    {
        $this->id = $course->getId();
        $this->name = $course->getName();
    }

    public function build()
    {
        return $this;
    }
}
