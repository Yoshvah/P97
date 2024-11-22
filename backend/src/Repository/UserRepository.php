<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    // Custom query to find a user by their email
    public function findUserByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    // Custom query to get users with a specific role
    public function findUsersByRole(string $role): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere(':role MEMBER OF u.roles')
            ->setParameter('role', $role)
            ->getQuery()
            ->getResult();
    }

    // Custom query to get users by their interest
    public function findUsersByInterest(string $interest): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere(':interest MEMBER OF u.interest')
            ->setParameter('interest', $interest)
            ->getQuery()
            ->getResult();
    }

    // Custom query to get users by username or email
    public function findUserByUsernameOrEmail(string $username, string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.username = :username OR u.email = :email')
            ->setParameter('username', $username)
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newHashedPassword);
        $this->_em->persist($user);
        $this->_em->flush();
    }
}
