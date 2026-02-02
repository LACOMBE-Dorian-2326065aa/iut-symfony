<?php

namespace App\Output\QuizzAttempt;

use App\Entity\Course;
use App\Entity\Document;
use App\Entity\QuizzAttempt;
use App\Entity\User;
use App\Output\Quizz\QuizzOutput;
use App\Output\User\UserOutput;
use App\Repository\DocumentRepository;
use DateTime;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class QuizzAttemptOutput
{
    public int $id;
    public QuizzOutput $quizz;
    public UserOutput $user;
    public int $note;
    public DateTime $date;

    public function __construct(QuizzAttempt $quizzAttempt)
    {
        $this->id = $quizzAttempt->getId();
        $this->quizz = new QuizzOutput($quizzAttempt->getQuizz());
        $this->user = new UserOutput($quizzAttempt->getUser());
        $this->note = $quizzAttempt->getNote();
        $this->date = $quizzAttempt->getDate();
    }

    public function build()
    {
        return $this;
    }
}
