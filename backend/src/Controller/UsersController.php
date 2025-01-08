<?php
// src/Controller/UsersController.php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\ImageUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

class UsersController extends AbstractController
{
    private $repository;
    private $imageUploader;
    private $slugger;

    public function __construct(UserRepository $repository, ImageUploader $imageUploader, SluggerInterface $slugger)
    {
        $this->repository = $repository;
        $this->imageUploader = $imageUploader;
        $this->slugger = $slugger;
    }

    /**
     * @Route("/api/admin/getuser", name="get_user", methods={"GET"})
     */
    public function getUsers(): JsonResponse
    {
        $users = $this->repository->findAll();
        $userData = array_map(function ($user) {
            return $user->jsonSerialize(); // Use jsonSerialize to include isAdmin
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

        if (isset($data['facebook'])) {
            $user->setFacebook($data['facebook']);
        }

        if (isset($data['twitter'])) {
            $user->setTwitter($data['twitter']);
        }

        if (isset($data['instagram'])) {
            $user->setInstagram($data['instagram']);
        }

        if (isset($data['github'])) {
            $user->setGithub($data['github']);
        }

        if (isset($data['jobs'])) {
            $user->setJobs($data['jobs']);
        }

        if (isset($data['isAdmin'])) {
            $user->setIsAdmin($data['isAdmin']);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse($user->jsonSerialize(), Response::HTTP_CREATED);
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
     * @Route("/api/profile/{id}", name="current_user", methods={"GET"})
     */
    public function getCurrentUser(int $id): JsonResponse
    {
        $user = $this->repository->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse($user->jsonSerialize(), Response::HTTP_OK);
    }

    /**
     * @Route("/api/upload/profilepicture", name="upload_profile_picture", methods={"POST"})
     */
    public function uploadProfilePicture(Request $request): JsonResponse
    {
        $file = $request->files->get('profilePicture');

        if (!$file instanceof UploadedFile) {
            return new JsonResponse(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $fileName = $this->imageUploader->upload($file);
            return new JsonResponse(['imageUrl' => '/uploads/profile_pictures/' . $fileName], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error uploading file: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/api/update/{id}", name="update", methods={"PUT"})
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
        if (isset($data['facebook'])) $user->setFacebook($data['facebook']);
        if (isset($data['twitter'])) $user->setTwitter($data['twitter']);
        if (isset($data['instagram'])) $user->setInstagram($data['instagram']);
        if (isset($data['github'])) $user->setGithub($data['github']);
        if (isset($data['jobs'])) $user->setJobs($data['jobs']);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return new JsonResponse($user->jsonSerialize(), Response::HTTP_OK);
    }
    /**
     * @Route("/api/admin/updateuser/{id}", name="update_user", methods={"PUT"})
     */
    public function AdminUpdateUser(int $id, Request $request): JsonResponse
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
        if (isset($data['facebook'])) $user->setFacebook($data['facebook']);
        if (isset($data['twitter'])) $user->setTwitter($data['twitter']);
        if (isset($data['instagram'])) $user->setInstagram($data['instagram']);
        if (isset($data['github'])) $user->setGithub($data['github']);
        if (isset($data['jobs'])) $user->setJobs($data['jobs']);
        if (isset($data['isAdmin'])) $user->setIsAdmin($data['isAdmin']);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return new JsonResponse($user->jsonSerialize(), Response::HTTP_OK);
    }
}
