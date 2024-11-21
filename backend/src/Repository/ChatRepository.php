<?php

namespace App\Repository;

use App\Entity\Chat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Chat>
 *
 * @method Chat|null find($id, $lockMode = null, $lockVersion = null)
 * @method Chat|null findOneBy(array $criteria, array $orderBy = null)
 * @method Chat[]    findAll()
 * @method Chat[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chat::class);
    }

    // Custom query to get all chats between two users
    public function findChatsBetweenUsers(int $user1Id, int $user2Id): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('(c.sender = :user1 AND c.recipient = :user2) OR (c.sender = :user2 AND c.recipient = :user1)')
            ->setParameter('user1', $user1Id)
            ->setParameter('user2', $user2Id)
            ->orderBy('c.createdAt', 'ASC') // Sort by creation time
            ->getQuery()
            ->getResult();
    }

    // Custom query to find unread messages for a user
    public function findUnreadMessagesForUser(int $userId): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.recipient = :userId AND c.isRead = false')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();
    }

    // Custom query to mark messages as read
    public function markMessagesAsRead(int $userId, int $senderId): void
    {
        $this->createQueryBuilder('c')
            ->update()
            ->set('c.isRead', 'true')
            ->where('c.recipient = :recipient AND c.sender = :sender')
            ->setParameter('recipient', $userId)
            ->setParameter('sender', $senderId)
            ->getQuery()
            ->execute();
    }
}
