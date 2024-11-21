<?php

namespace App\Repository;

use App\Entity\Mook;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Mook>
 *
 * @method Mook|null find($id, $lockMode = null, $lockVersion = null)
 * @method Mook|null findOneBy(array $criteria, array $orderBy = null)
 * @method Mook[]    findAll()
 * @method Mook[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Mook::class);
    }

    // You can add custom query methods here if needed.
}
