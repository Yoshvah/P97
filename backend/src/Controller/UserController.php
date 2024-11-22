<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface; // Add this at the top
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

/**
 * @Route("/api/user", name="user")
 */
class UserController extends AbstractController
{
    private $manager;
    private $repository;
    private $jwtManager;
    private $validator;

    public function __construct(EntityManagerInterface $manager, ValidatorInterface $validator, JWTTokenManagerInterface $jwtManager)
    {
        $this->manager = $manager;
        $this->jwtManager = $jwtManager;
        $this->repository = $manager->getRepository(User::class);
        $this->validator = $validator;
    }

    /**
     * @Route("/signup", name="signup", methods={"POST"})
     */
    // public function signUp(Request $request)

    public function signUp(Request $request, LoggerInterface $logger)
    {
        // Step 1: Decode request content
        $data = json_decode($request->getContent(), true);
        $logger->info('Request data received', $data);
        error_log('Request data: ' . print_r($data, true)); // Alternative: error_log
    
        // Step 2: Validate input
        $constraints = new Assert\Collection([
            'username' => [new Assert\NotBlank()],
            'password' => [new Assert\NotBlank()],
        ]);
    
        $errors = $this->validator->validate($data, $constraints);
        $logger->info('Validation errors count: ' . count($errors));
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            $logger->error('Validation errors', $errorMessages);
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }
    
        // Step 3: Extract username and password
        $username = $data['username'];
        $password = $data['password'];
        $logger->info("Extracted username: $username");
        error_log("Extracted password: $password"); // For sensitive data, prefer logging hash only.
    
        // Step 4: Check if user exists
        $user = $this->repository->findOneBy(["username" => $username]);
        if ($user) {
            $logger->warning('User already exists', ['username' => $username]);
            return new Response("User already exists", Response::HTTP_BAD_REQUEST);
        }
    
        // Step 5: Hash the password
        $hashed_password = password_hash(
            $password,
            PASSWORD_BCRYPT
        );
        $logger->info('Password hashed successfully');
    
        // Step 6: Create and persist the user
        $user = new User();
        $user
            ->setUsername($username)
            ->setPassword($hashed_password)
            ->setRoles(['USER_ROLE']);
        $logger->info('User entity created', ['username' => $username]);
    
        $this->manager->persist($user);
        $this->manager->flush();
        $logger->info('User persisted to the database', ['user_id' => $user->getId()]);
    
        // Step 7: Return success response
        $response = [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles()
        ];
        $logger->info('Response data prepared', $response);
    
        return new JsonResponse($response, Response::HTTP_OK);
    }
    
    

    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(Request $request)
    {
        $data = json_decode($request->getContent(), true);
    
        $constraints = new Assert\Collection([
            'username' => [new Assert\NotBlank()],
            'password' => [new Assert\NotBlank()],
        ]);
    
        $errors = $this->validator->validate($data, $constraints);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }
    
        $username = $data['username'];
        $password = $data['password'];
    
        $user = $this->repository->findOneBy(["username" => $username]);
        if (!$user) {
            return new JsonResponse(['errors' => ['Invalid username']], Response::HTTP_NOT_FOUND);
        }
    
        $isPasswordCorrect = password_verify($password, $user->getPassword());
        if (!$isPasswordCorrect) {
            return new JsonResponse(['errors' => ['Invalid password']], Response::HTTP_BAD_REQUEST);
        }
    
        $token = $this->jwtManager->create($user);
        $response = [
            "token" => $token,
            "user" => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles()
            ]
        ];
        return new JsonResponse($response, Response::HTTP_OK);
    }
    

    /**
     * @Route("/user/{id}", name="delete-user", methods={"DELETE"})
     */
    public function deleteUser($id): JsonResponse
    {
        $user = $this->repository->findOneBy(['id' => $id]);
        $this->manager->remove($user);
        $this->manager->flush();
        return new JsonResponse(['status' => 'User deleted!'], Response::HTTP_OK);
    }
    /**
     * @Route("/api/user/{any}", name="options_user", methods={"OPTIONS"})
     */
    public function options(): Response
    {
        return new Response('', Response::HTTP_OK);
    }

}