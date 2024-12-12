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
        $userData = array_map(function ($user) {
            return [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'birthday' => $user->getBirthday() ? $user->getBirthday()->format('Y-m-d') : null,
                'slogan' => $user->getSlogan(),
                'interest' => $user->getInterest(),
                'phone' => $user->getPhone(),
                'address' => $user->getAddress(),
                'profilePicture' => $user->getProfilePicture(),
                'sexe' => $user->getSexe(),
            ];
        }, $users);

        return new JsonResponse($userData, Response::HTTP_OK);
    }

    /**
     * @Route("/api/admin/adduser", name="add_user", methods={"POST"})
     */
    public function addUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['username'], $data['email'], $data['phone'], $data['address'], $data['birthday'], $data['slogan'], $data['interest'], $data['sexe'])) {
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
        $user->setSexe($data['sexe']);
        
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
        if (isset($data['sexe'])) $user->setSexe($data['sexe']);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return new JsonResponse($user, Response::HTTP_OK);
    }

    /**
     * @Route("/api/profile/{id}", name="current_user", methods={"GET"})
     */
    public function getCurrentUser(int $id): JsonResponse
    {
        $user = $this->repository->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'birthday' => $user->getBirthday() ? $user->getBirthday()->format('Y-m-d') : null,
            'slogan' => $user->getSlogan(),
            'interest' => $user->getInterest(),
            'phone' => $user->getPhone(),
            'address' => $user->getAddress(),
            'profilePicture' => $user->getProfilePicture(),
            'sexe' => $user->getSexe(),
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
