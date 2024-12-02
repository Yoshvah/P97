<?php
// In UsersController.php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UsersController extends AbstractController
{
    private $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @Route("/api/admin/getuser", name="get_user", methods={"GET"})
     */
    public function getUsers(): JsonResponse
    {
        $users = $this->repository->findAll();
        return new JsonResponse($users, Response::HTTP_OK);
    }

    /**
     * @Route("/api/admin/adduser", name="add_user", methods={"POST"})
     */
    public function addUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['username'], $data['email'], $data['phone'], $data['address'], $data['birthday'], $data['slogan'], $data['interest'])) {
            return new JsonResponse(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $user->setPhone($data['phone']);
        $user->setAddress($data['address']);
        $user->setBirthday(new \DateTime($data['birthday']));
        $user->setSlogan($data['slogan']);
        $user->setInterest($data['interest']);
        
        if (isset($data['profilePicture'])) {
            $user->setProfilePicture($data['profilePicture']);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse($user, Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/admin/deleteuser/{id}", name="delete_user", methods={"DELETE"})
     */
    public function deleteUser(int $id): JsonResponse
    {
        $user = $this->repository->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'User deleted successfully'], Response::HTTP_OK);
    }

    /**
     * @Route("/api/admin/updateuser/{id}", name="update_user", methods={"PUT"})
     */
    public function updateUser(int $id, Request $request): JsonResponse
    {
        $user = $this->repository->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['username'])) $user->setUsername($data['username']);
        if (isset($data['email'])) $user->setEmail($data['email']);
        if (isset($data['phone'])) $user->setPhone($data['phone']);
        if (isset($data['address'])) $user->setAddress($data['address']);
        if (isset($data['birthday'])) $user->setBirthday(new \DateTime($data['birthday']));
        if (isset($data['slogan'])) $user->setSlogan($data['slogan']);
        if (isset($data['interest'])) $user->setInterest($data['interest']);
        if (isset($data['profilePicture'])) $user->setProfilePicture($data['profilePicture']);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return new JsonResponse($user, Response::HTTP_OK);
    }
    /**
     * @Route("/api/profile", name="current_user", methods={"GET"})
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
}
