<?php

namespace App\Entity;

use App\Repository\CourseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CourseRepository::class)]
class Course
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'courses')]
    private ?User $user = null;

    /**
     * @var Collection<int, Document>
     */
    #[ORM\OneToMany(targetEntity: Document::class, mappedBy: 'course')]
    private Collection $documents;

    /**
     * @var Collection<int, Quizz>
     */
    #[ORM\OneToMany(targetEntity: Quizz::class, mappedBy: 'course')]
    private Collection $quizzs;

    /**
     * @var Collection<int, Video>
     */
    #[ORM\OneToMany(targetEntity: Video::class, mappedBy: 'course')]
    private Collection $videos;

    public function __construct()
    {
        $this->documents = new ArrayCollection();
        $this->quizzs = new ArrayCollection();
        $this->videos = new ArrayCollection();
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, Document>
     */
    public function getDocuments(): Collection
    {
        return $this->documents;
    }

    public function addDocument(Document $document): static
    {
        if (!$this->documents->contains($document)) {
            $this->documents->add($document);
            $document->setCourse($this);
        }

        return $this;
    }

    public function removeDocument(Document $document): static
    {
        if ($this->documents->removeElement($document)) {
            // set the owning side to null (unless already changed)
            if ($document->getCourse() === $this) {
                $document->setCourse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Quizz>
     */
    public function getQuizzs(): Collection
    {
        return $this->quizzs;
    }

    public function addQuizz(Quizz $quizz): static
    {
        if (!$this->quizzs->contains($quizz)) {
            $this->quizzs->add($quizz);
            $quizz->setCourse($this);
        }

        return $this;
    }

    public function removeQuizz(Quizz $quizz): static
    {
        if ($this->quizzs->removeElement($quizz)) {
            // set the owning side to null (unless already changed)
            if ($quizz->getCourse() === $this) {
                $quizz->setCourse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Video>
     */
    public function getVideos(): Collection
    {
        return $this->videos;
    }

    public function addVideo(Video $vIdeo): static
    {
        if (!$this->videos->contains($vIdeo)) {
            $this->videos->add($vIdeo);
            $vIdeo->setCourse($this);
        }

        return $this;
    }

    public function removeVideo(Video $vIdeo): static
    {
        if ($this->videos->removeElement($vIdeo)) {
            // set the owning side to null (unless already changed)
            if ($vIdeo->getCourse() === $this) {
                $vIdeo->setCourse(null);
            }
        }

        return $this;
    }
}
