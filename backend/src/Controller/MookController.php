<?php

namespace App\Controller;

use App\Entity\Mook;
use App\Repository\MookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class MookController extends AbstractController
{
    private $Repository;

    public function __construct(MookRepository $mookRepository)
    {
        $this->Repository = $mookRepository;
    }

    /**
     * @Route("/api/mooks", name="get_mooks", methods={"GET"})
     */
    public function getMooks(): JsonResponse
    {
        // Use the correct property $this->Repository
        $mooks = $this->Repository->findAll();

        $data = array_map(function (Mook $mook) {
            return [
                'id' => $mook->getId(),
                'title' => $mook->getTitle(),
                'contentData' => $mook->getContentData(),
                'isPrivate' => $mook->isPrivate(),
                'shareLink' => $mook->getShareLink(),
                'createdAt' => $mook->getCreatedAt()?->format('Y-m-d H:i:s'),
                'updatedAt' => $mook->getUpdatedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $mooks);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }
}
