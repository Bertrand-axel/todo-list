<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    #[ORM\OneToMany(mappedBy: 'responsible', targetEntity: Task::class)]
    private Collection $tasks;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: TodoList::class, orphanRemoval: true)]
    private Collection $todoLists;

    #[ORM\Column(length: 1023)]
    private ?string $email = null;

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
}
