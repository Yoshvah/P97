<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Mook;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;

class MookController extends AbstractController
{
    /**
     * @Route("/api/mook", name="get_mook", methods={"GET"})
     */
    public function getMook(EntityManagerInterface $entityManager): JsonResponse
    {
        // Fetch Mook data from the database
        $mooks = $entityManager->getRepository(Mook::class)->findAll();

        // Map Mook entities to an array
        $mookData = array_map(function($mook) {
            return [
                'id' => $mook->getId(),
                'title' => $mook->getTitle(),
                'content' => $mook->getContent(),
                'isPrivate' => $mook->getIsPrivate(),
                'mooklink' => $mook->getMooklink()
            ];
        }, $mooks);

        return new JsonResponse($mookData);
    }

    /**
     * @Route("/api/register/mook", name="save_mook", methods={"POST"})
     */
    public function saveMook(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        // Decode the incoming JSON data
        $data = json_decode($request->getContent(), true);

        // Validate the incoming data
        $constraints = new Assert\Collection([
            'title' => new Assert\NotBlank(),
            'content' => new Assert\NotBlank(),
            'isPrivate' => new Assert\Type('bool')
        ]);
        $violations = $validator->validate($data, $constraints);

        if (count($violations) > 0) {
            return new JsonResponse(['errors' => $violations], Response::HTTP_BAD_REQUEST);
        }

        // Create new Mook entity and set its properties
        $mook = new Mook();
        $mook->setTitle($data['title']);
        $mook->setContent($data['content']);
        $mook->setIsPrivate($data['isPrivate']);
        $mook->setMooklink($data['mooklink'] ?? ''); // Optional link

        // Persist the Mook entity
        try {
            $entityManager->persist($mook);
            $entityManager->flush();
            return new JsonResponse(['mook_id' => $mook->getId()], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to save Mook', 'details' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
