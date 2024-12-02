<?php
namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\MookRepository;
use App\Entity\User;
use Symfony\Component\Uid\Uuid;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\Entity(repositoryClass=MookRepository::class)
 */
class Mook
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(name="owner_id", referencedColumnName="id")
     */
    private ?User $owner = null;

    /**
     * @ORM\ManyToMany(targetEntity=User::class)
     * @ORM\JoinTable(name="mook_shared_users")
     */
    private Collection $sharedUsers;
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
     * @ORM\Column(type="string", length=36, unique=true, nullable=true)
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
        $this->sharedUsers = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters and setters...

    public function getMid(): ?int
    {
        return $this->mid;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(User $owner): self
    {
        $this->owner = $owner;
        return $this;
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

    /**
     * Get the content data (JSON field with images and text)
     */
    public function getContentData(): array
    {
        return $this->contentData;
    }

    /**
     * Set the content data (JSON field with images and text)
     */
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
        $this->shareLink = Uuid::v4()->toRfc4122(); // Generates a unique UUID
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

    public function getSharedUsers(): Collection
    {
        return $this->sharedUsers;
    }

    public function addSharedUser(User $user): self
    {
        if (!$this->sharedUsers->contains($user)) {
            $this->sharedUsers->add($user);
        }
        return $this;
    }

    public function removeSharedUser(User $user): self
    {
        $this->sharedUsers->removeElement($user);
        return $this;
    }

    public function cloneForUser(User $user): self
    {
        $clone = new self();
        $clone->setOwner($user)
              ->setTitle($this->getTitle())
              ->setContentData($this->getContentData());
        return $clone;
    }
}
