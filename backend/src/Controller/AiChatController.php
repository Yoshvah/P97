<?php
// src/Controller/AiChatController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AiChatController
{
    /**
     * @Route("/api/ai-chat", name="ai_chat", methods={"GET"})
     */
    public function aiChat(): JsonResponse
    {
        return new JsonResponse(['message' => 'AI chat endpoint']);
    }
}
