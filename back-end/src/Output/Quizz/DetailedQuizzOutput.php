<?php

namespace App\Output\Quizz;

use App\Entity\Quizz;
use App\Output\ListOutput;
use App\Output\Question\QuestionOutput;
use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class DetailedQuizzOutput extends QuizzOutput
{
    public ListOutput $questions;

    public function __construct(Quizz $quizz)
    {
        parent::__construct($quizz);
        $this->questions = new ListOutput($quizz->getQuestions(), QuestionOutput::class);
    }

    public function build()
    {
        return $this;
    }
}
