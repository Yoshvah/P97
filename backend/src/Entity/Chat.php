<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ChatRepository;
use App\Entity\User;

/**
 * @ORM\Entity(repositoryClass=ChatRepository::class)
 */
class Chat
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     */
    private ?User $sender = null;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     */
    private ?User $recipient = null;

    /**
     * @ORM\Column(type="text")
     */
    private ?string $content = null;

    /**
     * @ORM\Column(type="datetime")
     */
    private ?\DateTimeInterface $createdAt = null;

    /**
     * @ORM\Column(type="boolean")
     */
    private bool $isRead = false;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $image = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime(); // Use DateTime instead of DateTimeImmutable
        $this->isRead = false;
    }

    // Getters and setters...

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(User $sender): self
    {
        $this->sender = $sender;

        return $this;
    }

    public function getRecipient(): ?User
    {
        return $this->recipient;
    }

    public function setRecipient(User $recipient): self
    {
        $this->recipient = $recipient;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function isRead(): bool
    {
        return $this->isRead;
    }

    public function markAsRead(): self
    {
        $this->isRead = true;

        return $this;
    }

    // Getter and setter for the 'image' property

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

        return $this;
    }
}
