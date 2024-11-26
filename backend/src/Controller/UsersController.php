<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Repository\UserRepository;

class UsersController extends AbstractController
{
    private $manager;
    private $repository;
    private $jwtManager;

    // Constructor for injecting dependencies
    public function __construct(
        EntityManagerInterface $manager,
        JWTTokenManagerInterface $jwtManager,
        UserRepository $userRepository
    ) {
        $this->manager = $manager;
        $this->jwtManager = $jwtManager;
        $this->repository = $userRepository;
    }

    /**
     * @Route("/api/profile", name="current_user", methods={"POST"})
     * 
     * This method handles retrieving the current user's profile based on the token provided in the request body.
     */
    public function getCurrentUser(Request $request): JsonResponse
    {
        // Retrieve the JSON data from the request body
        $data = json_decode($request->getContent(), true);

        // Ensure the token is provided
        if (empty($data['token'])) {
            return new JsonResponse(['error' => 'Token is missing'], Response::HTTP_BAD_REQUEST);
        }

        $token = $data['token'];

        // Try decoding the token
        try {
            $decodedPayload = $this->jwtManager->decodeFromToken($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], Response::HTTP_UNAUTHORIZED);
        }

        // Ensure that the decoded payload contains the user's identifier
        if (!isset($decodedPayload['username'])) {
            return new JsonResponse(['error' => 'Invalid token payload'], Response::HTTP_UNAUTHORIZED);
        }

        // Retrieve the user by the username or other identifier
        $user = $this->repository->findOneBy(['email' => $decodedPayload['username']]);  // Assuming 'username' or 'email' is used in token payload

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Prepare user data for the response
        $data = [
            'id' => $user->getId(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'email' => $user->getEmail(),
            'datebirth' => $user->getBirthday() ? $user->getBirthday()->format('Y-m-d') : null,
            'slogan' => $user->getSlogan() ?? 'No Slogan',
            'interests' => $user->getInterest() ?? [],
            'phone' => $user->getPhone(),
            'address' => $user->getAddress(),
            'profilePicture' => $user->getProfilePicture(),
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
     * @Route("/user/{id}", name="delete-user", methods={"DELETE"})
     * 
     * This method handles the deletion of a user based on their ID.
     */
    public function deleteUser($id): JsonResponse
    {
        $user = $this->repository->findOneBy(['id' => $id]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $this->manager->remove($user);
        $this->manager->flush();

        return new JsonResponse(['status' => 'User deleted!'], Response::HTTP_OK);
    }

    /**
     * @Route("/api/user/{any}", name="options_user", methods={"OPTIONS"})
     * 
     * This is a placeholder for handling OPTIONS requests for user-related routes.
     */
    public function options(): Response
    {
        return new Response('', Response::HTTP_OK);
    }
}
