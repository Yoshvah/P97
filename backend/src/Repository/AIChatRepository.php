<?php

namespace App\Repository;

use App\Entity\AIChat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AIChat>
 *
 * @method AIChat|null find($id, $lockMode = null, $lockVersion = null)
 * @method AIChat|null findOneBy(array $criteria, array $orderBy = null)
 * @method AIChat[]    findAll()
 * @method AIChat[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AIChatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AIChat::class);
    }

    // You can add custom query methods here if needed.
}
