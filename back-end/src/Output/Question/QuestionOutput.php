<?php

namespace App\Output\Question;

use App\Entity\Question;
use App\Entity\Quizz;
use App\Output\Course\CourseOutput;
use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class QuestionOutput
{
    public int $id;
    public string $title;
    public bool $correctAnswer;

    public function __construct(Question $question)
    {
        $this->id = $question->getId();
        $this->title = $question->getTitle();
        $this->correctAnswer = $question->isCorrectAnswer();
    }

    public function build()
    {
        return $this;
    }
}
