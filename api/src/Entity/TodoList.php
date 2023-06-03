<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\TodoListRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TodoListRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['todo_list:read']],
    denormalizationContext: ['groups' => ['todo_list:write']],
)]
#[GetCollection(normalizationContext: ['groups' => ['todo_list:read']])]
#[GetCollection(
    uriTemplate: '/users/{ownerId}/todo_lists',
    uriVariables: ['ownerId' => new Link(toProperty: 'owner', fromClass: User::class)],
    normalizationContext: ['groups' => ['todo_list:read']])]
#[Get(normalizationContext: ['groups' => ['todo_list:read', 'todo_list:read:details']])]
#[Post(
    normalizationContext: ['groups' => ['todo_list:read', 'todo_list:read:details']],
    denormalizationContext: ['todo_list:create'],
    // cant create a list for someone else
    securityMessage: 'You can\'t create a list for an other user',
    securityPostDenormalize: "object.getOwner() == user",
)]
#[Put(
    normalizationContext: ['groups' => ['todo_list:read', 'todo_list:read:details']],
    denormalizationContext: ['todo_list:update'],
    // only owner of the list can edit
    security: "object.getOwner() == user",
    securityMessage: 'You are not allowed to edit someone else\'s task',
)]
#[Delete(
    normalizationContext: ['groups' => ['todo_list:read', 'todo_list:read:details']],
    denormalizationContext: ['todo_list:delete'],
    // only owner of the list can delete
    security: "object.getOwner() == user",
    securityMessage: 'You are not allowed to delete someone else\'s task',
)]
class TodoList
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['todo_list:read', 'task:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['todo_list:read', 'task:read'])]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['todo_list:read:details'])]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'todoLists')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['todo_list:read'])]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'todoList', targetEntity: Task::class)]
    #[Groups(['todo_list:read:details'])]
    private Collection $tasks;

    public function __construct()
    {
        $this->tasks = new ArrayCollection();
    }

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

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
            $task->setTodoList($this);
        }

        return $this;
    }

    public function removeTask(Task $task): self
    {
        if ($this->tasks->removeElement($task)) {
            // set the owning side to null (unless already changed)
            if ($task->getTodoList() === $this) {
                $task->setTodoList(null);
            }
        }

        return $this;
    }
}
