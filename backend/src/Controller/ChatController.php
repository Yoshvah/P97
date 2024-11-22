<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
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
    private $messageRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        MessageRepository $messageRepository
    ) {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->messageRepository = $messageRepository;
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
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'Profilepic' => $user->getProfilepic(),
                'datebirth' => $user->getDatebirth() ? $user->getDatebirth()->format('Y-m-d') : null,
            ];
        }, $users);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
     * @Route("/api/user-chats/{receiverId}", name="get_user_chats", methods={"GET"})
     */
    public function getUserChats(int $receiverId): JsonResponse
    {
        $messages = $this->messageRepository->findBy(['receiver' => $receiverId]);

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
}
