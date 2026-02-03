<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    private $userProvider;
    private $passwordHasher;

    public function __construct(UserProviderInterface $userProvider, UserPasswordHasherInterface $passwordHasher)
    {
        $this->userProvider = $userProvider;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route(path: '/login', name: 'login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // if ($this->getUser()) {
        //     return $this->redirectToRoute('target_path');
        // }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    #[Route(path: '/api/login', name: 'login_user', methods: ['POST'])]
    public function apiLogin(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Email and password are required'], 400);
        }

        $user = $this->userProvider->loadUserByIdentifier($email);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        return new JsonResponse([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route(path: '/api/register', name: 'register_user', methods: ['POST'])]
    public function apiRegister(
        Request $request,
        UserRepository $userRepository
    ): Response
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $firstName = $data['firstname'] ?? null;
        $lastName = $data['lastname'] ?? null;
        $role = $data['role'] ?? 'ROLE_USER';

        if (!$email || !$password || !$firstName || !$lastName) {
            return new JsonResponse(['error' => 'All fields are required'], 400);
        }

        $existingUser = $userRepository->findOneBy(['email' => $email]);

        if ($existingUser) {
            return new JsonResponse(['error' => 'Email already in use'], 400);
        }

        $user = new User();
        $user->setFirstname($firstName)
            ->setLastname($lastName)
            ->setEmail($email)
            ->setPassword($this->passwordHasher->hashPassword($user, $password))
            ->setRoles([$role]);

        $userRepository->save($user, true);

        return new JsonResponse([
            'message' => 'Registration successful',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route(path: '/logout', name: 'logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
