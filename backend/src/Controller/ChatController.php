<?php
// src/Controller/ChatController.php

namespace App\Controller;

use App\Entity\Chat;
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
    private $chatRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        ChatRepository $chatRepository
    ) {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->chatRepository = $chatRepository;
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
            ];
        }, $users);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
     * @Route("/api/user-chats", name="get_chat_messages", methods={"GET"})
     */
    public function getChatMessages(Request $request): JsonResponse
    {
        $senderId = $request->query->get('senderId');
        $receiverId = $request->query->get('receiverId');

        if (!$senderId || !$receiverId) {
            return new JsonResponse(['message' => 'Missing senderId or receiverId'], Response::HTTP_BAD_REQUEST);
        }

        $sender = $this->userRepository->find($senderId);
        $receiver = $this->userRepository->find($receiverId);

        if (!$sender || !$receiver) {
            return new JsonResponse(['message' => 'Sender or receiver not found'], Response::HTTP_NOT_FOUND);
        }

        $chats = $this->chatRepository->findMessagesBetweenUsers($sender, $receiver);

        $data = array_map(function (Chat $chat) {
            return [
                'id' => $chat->getId(),
                'content' => $chat->getContent(),
                'sender' => $chat->getSender()->getUsername(),
                'receiver' => $chat->getRecipient()->getUsername(),
                'image' => $chat->getImage(),
                'timestamp' => $chat->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $chats);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
 * @Route("/api/user-chats", name="send_chat_message", methods={"POST"})
 */
public function sendChatMessage(Request $request): JsonResponse
{
    $data = $request->request->all();
    $file = $request->files->get('image');

    $senderId = $data['sender_id'] ?? null;
    $receiverId = $data['receiver_id'] ?? null;
    $content = $data['content'] ?? null;

    if (!$senderId || !$receiverId || !$content) {
        return new JsonResponse(['message' => 'Missing sender_id, receiver_id, or content'], Response::HTTP_BAD_REQUEST);
    }

    $sender = $this->userRepository->find($senderId);
    $receiver = $this->userRepository->find($receiverId);
    $senderUsername = $this->userRepository->find($senderId)->getUsername();
    $receiverUsername = $this->userRepository->find($receiverId)->getUsername();

    if (!$sender || !$receiver) {
        return new JsonResponse(['message' => 'Sender or receiver not found'], Response::HTTP_NOT_FOUND);
    }

    // Get usernames from User entities
    $senderUsername = $sender->getUsername();
    $receiverUsername = $receiver->getUsername();

    // Create a new chat message
    $chat = new Chat();
    $chat->setSender($sender);
    $chat->setRecipient($receiver);
    $chat->setContent($content);
    $chat->setCreatedAt(new \DateTime());

    if ($file) {
        $fileName = uniqid() . '.' . $file->guessExtension();
        $file->move('uploads/messages', $fileName);
        $chat->setImage('/uploads/messages/' . $fileName);
    }

    // Save the chat message to the database
    $this->entityManager->persist($chat);
    $this->entityManager->flush();

    // Return a JSON response with message data, including sender and receiver usernames
    return new JsonResponse([
        'message' => 'Message sent successfully',
        'message_data' => [
            'id' => $chat->getId(),
            'content' => $chat->getContent(),
            'sender' => $senderUsername,   
            'receiver' => $receiverUsername,  
            'image' => $chat->getImage(),
            'timestamp' => $chat->getCreatedAt()->format('Y-m-d H:i:s'),
        ]
    ], Response::HTTP_CREATED);
}

}
