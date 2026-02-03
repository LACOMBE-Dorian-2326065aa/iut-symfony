<?php

namespace App\Output\User;

use App\Entity\User;

class UserOutput
{
    public int $id;

    public string $email;

    public ?string $firstname;

    public ?string $lastname;

    public array $roles;

    public function __construct(User $user)
    {
        $this->id = $user->getId();
        $this->email = $user->getEmail();
        $this->firstname = $user->getFirstname();
        $this->lastname = $user->getLastname();
        $this->roles = $user->getRoles();
    }

    public function build()
    {
        return $this;
    }
}
