<?php

namespace App\Controller;

use Symfony\Component\Security\Core\Security;
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
use App\Repository\UserRepository;
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

    public function signUp(Request $request, LoggerInterface $logger)
    {
        $data = json_decode($request->getContent(), true);
        $logger->info('Request data received', $data);
        error_log('Request data: ' . print_r($data, true));
    
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
    
        $username = $data['username'];
        $password = $data['password'];
        $logger->info("Extracted username: $username");
        error_log("Extracted password: $password");
    
        $user = $this->repository->findOneBy(["username" => $username]);
        if ($user) {
            $logger->warning('User already exists', ['username' => $username]);
            return new Response("User already exists", Response::HTTP_BAD_REQUEST);
        }
    
        $hashed_password = password_hash(
            $password,
            PASSWORD_BCRYPT
        );
        $logger->info('Password hashed successfully');
    
        $user = new User();
        $user
            ->setUsername($username)
            ->setPassword($hashed_password)
            ->setRoles(['USER_ROLE']);
        $logger->info('User entity created', ['username' => $username]);
    
        $this->manager->persist($user);
        $this->manager->flush();
        $logger->info('User persisted to the database', ['user_id' => $user->getId()]);
    
        $response = [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles()
        ];
        $logger->info('Response data prepared', $response);
    
        return new JsonResponse($response, Response::HTTP_OK);
    }
    /**
     * @Route("/test", name="testuser", methods={"GET"})
     */
    public function getCurrentUser(UserRepository $userRepository): JsonResponse
    {
        $user = $security->getUser();
        // Fetch the first user from the database (adjust the logic to meet your actual needs)
        //$user = $userRepository->findOneBy([]); // Replace with criteria if needed, e.g., ['id' => $id]

        // If no user exists, return a 404 error
        if (!$user) {
            return new JsonResponse(['error' => 'No users found'], 404);
        }

        // Prepare the user data for the response
        $data = [
            'id' => $user->getId(),
            'firstname' => $user->getUsername(),
            'email' => $user->getEmail(),
            'datebirth' => $user->getBirthday() ? $user->getBirthday()->format('Y-m-d') : null,
            'slogan' => $user->getSlogan(),
            'interests' => $user->getInterest(), // Adjust the field name and format if needed
            'phone' => $user->getPhone(),
            'address' => $user->getAddress(),
            'profilePicture' => $user->getProfilePicture(),
        ];

        return new JsonResponse($data);
    }

    /**
     * @Route("/login", name="log", methods={"POST"})
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