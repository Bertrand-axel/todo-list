<?php

namespace App\Entity;

use ApiPlatform\Action\NotFoundAction;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\UserRepository;
use App\State\UserMeStateProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource(
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
)]
#[GetCollection(normalizationContext: ['groups' => ['user:read']])]
#[Get(normalizationContext: ['groups' => ['user:read', 'user:read:details']])]
#[Get(
    uriTemplate: '/me',
    defaults: ['id' => -1],
    stateless: false,
    normalizationContext: ['groups' => ['user:read', 'user:read:details', 'user:read:me']],
    provider: UserMeStateProvider::class
)]
#[Post(controller: NotFoundAction::class, output: false, read: false)]
#[Put(controller: NotFoundAction::class, output: false, read: false)]
class User implements UserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read'])]
    private ?string $username = null;

    #[ORM\OneToMany(mappedBy: 'responsible', targetEntity: Task::class)]
    #[Groups(['user:read:details'])]
    private Collection $tasks;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: TodoList::class, orphanRemoval: true)]
    #[Groups(['user:read:details'])]
    private Collection $todoLists;

    #[ORM\Column(length: 1023)]
    #[Groups(['user:read:me'])]
    private ?string $email = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['user:read:me'])]
    private array $roles = [];

    public function __construct()
    {
        $this->tasks = new ArrayCollection();
        $this->todoLists = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @return Collection<int, Task>
     */
    public function getTasks(): Collection
    {
        return $this->tasks;
    }

    public function addTask(Task $task): self
    {
        if (!$this->tasks->contains($task)) {
            $this->tasks->add($task);
            $task->setResponsible($this);
        }

        return $this;
    }

    public function removeTask(Task $task): self
    {
        if ($this->tasks->removeElement($task)) {
            // set the owning side to null (unless already changed)
            if ($task->getResponsible() === $this) {
                $task->setResponsible(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TodoList>
     */
    public function getTodoLists(): Collection
    {
        return $this->todoLists;
    }

    public function addTodoList(TodoList $todoList): self
    {
        if (!$this->todoLists->contains($todoList)) {
            $this->todoLists->add($todoList);
            $todoList->setOwner($this);
        }

        return $this;
    }

    public function removeTodoList(TodoList $todoList): self
    {
        if ($this->todoLists->removeElement($todoList)) {
            // set the owning side to null (unless already changed)
            if ($todoList->getOwner() === $this) {
                $todoList->setOwner(null);
            }
        }

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function eraseCredentials()
    {
        // nothing to do here
    }

    public function getUserIdentifier(): string
    {
        return $this->getEmail();
    }
}
