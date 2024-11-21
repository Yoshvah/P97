<?php

namespace App\Entity;

use App\Repository\AIChatRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=AIChatRepository::class)
 */
class AIChat
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\Column(type="integer")
     */
    private ?int $aicid = null;

    /**
     * @ORM\Column(type="integer")
     */
    private ?int $userid = null;

    /**
     * @ORM\Column(type="json")
     */
    private array $contentData = [];

    /**
     * @ORM\Column(type="datetime")
     */
    private ?\DateTimeInterface $timestampai = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAicid(): ?int
    {
        return $this->aicid;
    }

    public function setAicid(int $aicid): self
    {
        $this->aicid = $aicid;

        return $this;
    }

    public function getUserid(): ?int
    {
        return $this->userid;
    }

    public function setUserid(int $userid): self
    {
        $this->userid = $userid;

        return $this;
    }

    /**
     * Get the content data (User's input + AI's response)
     *
     * @return array
     */
    public function getContentData(): array
    {
        return $this->contentData;
    }

    /**
     * Set the content data (User's input + AI's response)
     *
     * @param array $contentData
     * @return $this
     */
    public function setContentData(array $contentData): self
    {
        $this->contentData = $contentData;

        return $this;
    }

    public function getTimestampai(): ?\DateTimeInterface
    {
        return $this->timestampai;
    }

    public function setTimestampai(\DateTimeInterface $timestampai): self
    {
        $this->timestampai = $timestampai;

        return $this;
    }

    /**
     * Add content to the conversation (User input or AI response)
     *
     * @param string $content
     * @param string $role (either 'user' or 'ai')
     * @return $this
     */
    public function addContentToConversation(string $content, string $role): self
    {
        $this->contentData[] = [
            'role' => $role,
            'content' => $content,
            'timestamp' => new \DateTimeImmutable(),
        ];

        return $this;
    }
}
