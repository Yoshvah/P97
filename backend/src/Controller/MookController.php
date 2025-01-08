<?php

namespace App\Controller;

use App\Entity\Mook;
use App\Repository\MookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MookController extends AbstractController
{
    private $repository;

    public function __construct(MookRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @Route("/api/mooks", name="get_mooks", methods={"GET"})
     */
    public function getMooks(): JsonResponse
    {
        $mooks = $this->repository->findAll();
        $mookData = array_map(function ($mook) {
            return [
                'id' => $mook->getId(),
                'title' => $mook->getTitle(),
                'isPrivate' => $mook->isPrivate(),
                'contentData' => $mook->getContentData(), // Include contentData
                'shareLink' => $mook->getShareLink(),
                'createdAt' => $mook->getCreatedAt() ? $mook->getCreatedAt()->format('Y-m-d H:i:s') : null,
                'updatedAt' => $mook->getUpdatedAt() ? $mook->getUpdatedAt()->format('Y-m-d H:i:s') : null,
                'creatorId' => $mook->getCreatorId(),
            ];
        }, $mooks);

        return new JsonResponse($mookData, Response::HTTP_OK);
    }

    /**
     * @Route("/api/register/mook", name="add_mook", methods={"POST"})
     */
    public function addMook(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title'], $data['isPrivate'], $data['contentData'], $data['creatorId'], $data['createdAt'])) {
            return new JsonResponse(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        $mook = new Mook();
        $mook->setTitle($data['title']);
        $mook->setIsPrivate($data['isPrivate']);
        $mook->setContentData($data['contentData']); // Ensure contentData is a string
        $mook->setCreatorId($data['creatorId']);
        $mook->setCreatedAt(new \DateTime($data['createdAt']));
        $mook->generateShareLink();

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($mook);
        $entityManager->flush();

        return new JsonResponse([
            'id' => $mook->getId(),
            'title' => $mook->getTitle(),
            'isPrivate' => $mook->isPrivate(),
            'contentData' => $mook->getContentData(), // Return contentData as a string
            'shareLink' => $mook->getShareLink(),
            'createdAt' => $mook->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $mook->getUpdatedAt() ? $mook->getUpdatedAt()->format('Y-m-d H:i:s') : null,
            'creatorId' => $mook->getCreatorId(),
        ], Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/mooks/{id}", name="delete_mook", methods={"DELETE"})
     */
    public function deleteMook(int $id): JsonResponse
    {
        $mook = $this->repository->find($id);

        if (!$mook) {
            return new JsonResponse(['error' => 'Mook not found'], Response::HTTP_NOT_FOUND);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($mook);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Mook deleted successfully'], Response::HTTP_OK);
    }

    /**
     * @Route("/api/mooks/{id}", name="update_mook", methods={"PUT"})
     */
    public function updateMook(int $id, Request $request): JsonResponse
    {
        $mook = $this->repository->find($id);

        if (!$mook) {
            return new JsonResponse(['error' => 'Mook not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) $mook->setTitle($data['title']);
        if (isset($data['isPrivate'])) $mook->setIsPrivate($data['isPrivate']);
        if (isset($data['contentData'])) {
            $mook->setContentData($data['contentData']); // Ensure contentData is a string
        }
        if (isset($data['creatorId'])) $mook->setCreatorId($data['creatorId']);

        $mook->setUpdatedAt(new \DateTime());

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return new JsonResponse([
            'id' => $mook->getId(),
            'title' => $mook->getTitle(),
            'isPrivate' => $mook->isPrivate(),
            'contentData' => $mook->getContentData(), // Return contentData as a string
            'shareLink' => $mook->getShareLink(),
            'createdAt' => $mook->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $mook->getUpdatedAt()->format('Y-m-d H:i:s'),
            'creatorId' => $mook->getCreatorId(),
        ], Response::HTTP_OK);
    }
}
