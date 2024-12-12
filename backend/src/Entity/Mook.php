<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\MookRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\Entity(repositoryClass=MookRepository::class)
 */
class Mook
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private ?string $title = null;

    /**
     * @ORM\Column(type="json", nullable=false)
     */
    private array $contentData = [];

    /**
     * @ORM\Column(type="boolean")
     */
    private bool $isPrivate = true;

    /**
     * @ORM\Column(type="string", length=5, unique=true, nullable=true)
     */
    private ?string $shareLink = null;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $createdAt = null;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters and Setters...

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getContentData(): array
    {
        return $this->contentData;
    }

    public function setContentData(array $contentData): self
    {
        $this->contentData = $contentData;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function isPrivate(): bool
    {
        return $this->isPrivate;
    }

    public function setIsPrivate(bool $isPrivate): self
    {
        $this->isPrivate = $isPrivate;
        return $this;
    }

    public function getShareLink(): ?string
    {
        return $this->shareLink;
    }

    public function generateShareLink(): self
    {
        $this->shareLink = substr(md5(uniqid()), 0, 5); // Generates a unique 5-character string
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }
}
