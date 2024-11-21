<?php

namespace App\Controller;

use App\Repository\MookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MookController extends AbstractController
{
    private MookRepository $mookRepository;

    public function __construct(MookRepository $mookRepository)
    {
        $this->mookRepository = $mookRepository;
    }

    #[Route('/mooks/user/{userId}', name: 'mooks_for_user')]
    public function mooksForUser(int $userId): Response
    {
        $mooks = $this->mookRepository->findAllForUser($userId);

        return $this->json([
            'mooks' => $mooks,
        ]);
    }
}
