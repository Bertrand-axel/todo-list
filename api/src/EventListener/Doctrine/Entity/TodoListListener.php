<?php

namespace App\EventListener\Doctrine\Entity;

use App\Entity\TodoList;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Symfony\Bundle\SecurityBundle\Security;

#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: TodoList::class)]
class TodoListListener
{

    public function __construct(private readonly Security $security)
    {
    }

    public function prePersist(TodoList $list): void
    {
        if ($list->getOwner()) {
            return;
        }

        $list->setOwner($this->security->getUser());
    }
}
