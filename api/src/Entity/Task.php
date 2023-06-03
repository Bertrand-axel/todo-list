<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enums\Status;
use App\Repository\TaskRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['task:read']],
    denormalizationContext: ['groups' => ['task:write']],
)]
#[GetCollection(
    uriTemplate: '/users/{userId}/tasks',
    uriVariables: ['userId' => new Link(toProperty: 'responsible', fromClass: User::class)],
    normalizationContext: ['groups' => ['task:read']],
)]
#[GetCollection(
    uriTemplate: '/todo_lists/{todoListId}/tasks',
    uriVariables: ['todoListId' => new Link(toProperty: 'todoList', fromClass: TodoList::class)],
    normalizationContext: ['groups' => ['task:read']],
)]
#[GetCollection(normalizationContext: ['groups' => ['task:read']]), ]
#[Get(normalizationContext: ['groups' => ['task:read', 'task:read:details']])]
#[Post(
    normalizationContext: ['groups' => ['task:read', 'task:read:details']],
    denormalizationContext: ['task:create'],
    // cant create a task for someone else
    securityPostDenormalize: 'object.getTodoList()?.getOwner() == user',
    securityPostDenormalizeMessage: 'You can\'t create a task on a list you don\'t own',
)]
#[Put(
    normalizationContext: ['groups' => ['task:read', 'task:read:details']],
    denormalizationContext: ['task:update'],
    // only owner of the task or of the associated list can edit
    security: 'object.getResponsible() == user or object.getTodoList().getOwner() == user',
    securityMessage: 'You are not allowed to edit someone else\'s task',
)]
#[Delete(
    normalizationContext: ['groups' => ['task:read', 'task:read:details']],
    denormalizationContext: ['task:delete'],
    // only owner of the task or of the associated list can edit
    security: 'object.getResponsible() == user or object.getTodoList().getOwner() == user',
    securityMessage: 'You are not allowed to delete someone else\'s task',
)]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['task:read', 'todo_list:read:details'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['task:read', 'todo_list:read:details'])]
    #[Assert\NotBlank]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['task:read:details'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['task:read'])]
    #[Assert\Choice(callback: [Status::class, 'values'])]
    private ?string $status = null;

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    #[Groups(['task:read'])]
    private ?User $responsible = null;

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['task:read'])]
    #[Assert\NotBlank]
    private ?TodoList $todoList = null;

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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getResponsible(): ?User
    {
        return $this->responsible;
    }

    public function setResponsible(?User $responsible): self
    {
        $this->responsible = $responsible;

        return $this;
    }

    public function getTodoList(): ?TodoList
    {
        return $this->todoList;
    }

    public function setTodoList(?TodoList $todoList): self
    {
        $this->todoList = $todoList;

        return $this;
    }
}
