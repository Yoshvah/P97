<?php

namespace App\Entity;

use App\Repository\UserRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use JsonSerializable;

/**
 * @ApiResource(formats={"json"})
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="users")
 */
class User implements UserInterface, PasswordAuthenticatedUserInterface, JsonSerializable
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=180, unique=true, nullable=true)
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    private $plainPassword;

    /**
     * @ORM\OneToMany(targetEntity=Mook::class, mappedBy="owner", cascade={"persist", "remove"})
     */
    private $mooks;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private ?\DateTimeInterface $birthday = null;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $slogan = null;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private ?array $interest = [];

    /**
     * @ORM\Column(type="string", length=15, nullable=true)
     */
    private ?string $phone = null;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $address = null;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $profilePicture = null;



    public function __construct()
    {
        $this->mooks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
    $this->email = $email;
    return $this;
    }


    public function getRoles(): array
    {
        return ["ROLE_USER"];
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    public function setPlainPassword($password)
    {
        $this->plainPassword = $password;
    }

    public function eraseCredentials()
    {
        $this->plainPassword = null;
    }

    /**
     * @return Collection|Mook[]
     */
    public function getMooks(): Collection
    {
        return $this->mooks;
    }

    public function addMook(Mook $mook): self
    {
        if (!$this->mooks->contains($mook)) {
            $this->mooks[] = $mook;
            $mook->setOwner($this);
        }
        return $this;
    }

    public function removeMook(Mook $mook): self
    {
        if ($this->mooks->removeElement($mook)) {
            if ($mook->getOwner() === $this) {
                $mook->setOwner(null);
            }
        }
        return $this;
    }

    public function getBirthday(): ?\DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(?\DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;
        return $this;
    }

    public function getSlogan(): ?string
    {
        return $this->slogan;
    }

    public function setSlogan(?string $slogan): self
    {
        $this->slogan = $slogan;
        return $this;
    }

    public function getInterest(): ?array
    {
        return $this->interest;
    }

    public function setInterest(?array $interest): self
    {
        $this->interest = $interest;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;
        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;
        return $this;
    }

    public function getProfilePicture(): ?string
    {
        return $this->profilePicture;
    }

    public function setProfilePicture(?string $profilePicture): self
    {
        $this->profilePicture = $profilePicture;
        return $this;
    }




    public function jsonSerialize()
    {
        return [
            "id" => $this->id,
            "username" => $this->username,
            "email" => $this->email,
            "birthday" => $this->birthday,
            "slogan" => $this->slogan,
            "interest" => $this->interest,
            "phone" => $this->phone,
            "address" => $this->address,
            "profilePicture" => $this->profilePicture,
        ];
    }

    /**
     * Returns the salt that was used during password encoding.
     * In your case, it's not used, so return null.
     */
    public function getSalt(): ?string
    {
        return null; // Modern password encoders like bcrypt don't use salts anymore
    }
}
