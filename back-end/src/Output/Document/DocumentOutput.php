<?php

namespace App\Output\Document;

use App\Entity\Course;
use App\Entity\Document;
use App\Entity\User;
use App\Output\User\UserOutput;
use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class DocumentOutput
{
    public int $id;
    public string $name;
    public UserOutput $user;
    public int $numberOfPages;

    public function __construct(Document $document)
    {
        $this->id = $document->getId();
        $this->name = $document->getName();
        $this->user = new UserOutput($document->getUser());
        $this->numberOfPages = $document->getNumberOfPages();
    }

    public function build()
    {
        return $this;
    }
}
