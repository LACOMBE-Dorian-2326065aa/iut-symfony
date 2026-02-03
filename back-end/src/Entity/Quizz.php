<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\QuizzRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: QuizzRepository::class)]
class Quizz
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'quizzs')]
    private ?Course $course = null;

    /**
     * @var Collection<int, QuizzAttempt>
     */
    #[ORM\OneToMany(targetEntity: QuizzAttempt::class, mappedBy: 'quizz')]
    private Collection $quizzAttempts;

    /**
     * @var Collection<int, Question>
     */
    #[ORM\OneToMany(targetEntity: Question::class, mappedBy: 'quizz')]
    private Collection $questions;

    public function __construct()
    {
        $this->quizzAttempts = new ArrayCollection();
        $this->questions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCourse(): ?Course
    {
        return $this->course;
    }

    public function setCourse(?Course $course): static
    {
        $this->course = $course;

        return $this;
    }

    /**
     * @return Collection<int, QuizzAttempt>
     */
    public function getQuizzAttempts(): Collection
    {
        return $this->quizzAttempts;
    }

    public function addQuizzAttempt(QuizzAttempt $quizzAttempt): static
    {
        if (!$this->quizzAttempts->contains($quizzAttempt)) {
            $this->quizzAttempts->add($quizzAttempt);
            $quizzAttempt->setQuizz($this);
        }

        return $this;
    }

    public function removeQuizzAttempt(QuizzAttempt $quizzAttempt): static
    {
        if ($this->quizzAttempts->removeElement($quizzAttempt)) {
            // set the owning side to null (unless already changed)
            if ($quizzAttempt->getQuizz() === $this) {
                $quizzAttempt->setQuizz(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Question>
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Question $question): static
    {
        if (!$this->questions->contains($question)) {
            $this->questions->add($question);
            $question->setQuizz($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): static
    {
        if ($this->questions->removeElement($question)) {
            // set the owning side to null (unless already changed)
            if ($question->getQuizz() === $this) {
                $question->setQuizz(null);
            }
        }

        return $this;
    }
}
