<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\ChatRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ChatController
{
    private $entityManager;
    private $validator;
    private $userRepository;
    private $ChatRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        ChatRepository $ChatRepository
    ) {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->ChatRepository = $ChatRepository;
    }

    /**
     * @Route("/api/users", name="get_users", methods={"GET"})
     */
    public function getUsers(): JsonResponse
    {
        $users = $this->userRepository->findAll();

        $data = array_map(function (User $user) {
            return [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'profilePicture' => $user->getProfilePicture(),
                'birthday' => $user->getBirthday() ? $user->getBirthday()->format('Y-m-d') : null,
            ];
        }, $users);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
     * @Route("/api/user-chats/{receiverId}", name="get_user_chats", methods={"GET"})
     */
    public function getUserChats(int $receiverId): JsonResponse
    {
        $messages = $this->ChatRepository->findBy(['receiver' => $receiverId]);

        $data = array_map(function (Message $message) {
            return [
                'id' => $message->getId(),
                'content' => $message->getContent(),
                'sender' => $message->getSender()->getFirstname(),
                'image' => $message->getImage(),
            ];
        }, $messages);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
     * @Route("/api/user-chats", name="send_message", methods={"POST"})
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $data = $request->request->all();
        $file = $request->files->get('image');

        $receiverId = $data['receiver_id'] ?? null;
        $content = $data['content'] ?? null;

        if (!$receiverId || !$content) {
            return new JsonResponse(['message' => 'Invalid input data'], Response::HTTP_BAD_REQUEST);
        }

        $receiver = $this->userRepository->find($receiverId);
        if (!$receiver) {
            return new JsonResponse(['message' => 'Receiver not found'], Response::HTTP_NOT_FOUND);
        }

        $message = new Message();
        $message->setContent($content);
        $message->setReceiver($receiver);
        $message->setSender($this->getUser()); // Assume this method retrieves the currently logged-in user

        if ($file) {
            $fileName = uniqid() . '.' . $file->guessExtension();
            $file->move('uploads/messages', $fileName);
            $message->setImage('/uploads/messages/' . $fileName);
        }

        $this->entityManager->persist($message);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Message sent successfully'], Response::HTTP_CREATED);
    }
    // /**
    //  * @Route("/api/user", name="get_current_user", methods={"GET"})
    //  */

    // public function getCurrentUser(UserRepository $userRepository): JsonResponse
    // {
    //     // Fetch the first user from the database
    //     $user = $userRepository->findOneBy([], ['id' => 'ASC']); // Adjusting order to fetch the first user

    //     // If no user exists, return a 404 error
    //     if (!$user) {
    //         return new JsonResponse(['error' => 'No users found'], 404);
    //     }

    //     $data = [
    //         'id' => $user->getId(),
    //         'firstname' => $user->getUsername(),
    //         'email' => $user->getEmail(),
    //         'datebirth' => $user->getBirthday() ? $user->getBirthday()->format('Y-m-d') : null,
    //         'slogan' => $user->getSlogan(),
    //         'interests' => $user->getInterest(), // Make sure this method matches your entity's method name
    //         'phone' => $user->getPhone(),
    //         'address' => $user->getAddress(),
    //         'profilepic' => $user->getProfilPicture(),
    //     ];

    //     return new JsonResponse($data);
    // }
    }
