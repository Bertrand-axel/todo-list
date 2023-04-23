<?php

namespace App\DataFixtures;

use App\Entity\Task;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class TaskFixtures extends Fixture implements DependentFixtureInterface
{
    protected static array $tasks = [
        ['title' => 'find the one piece', 'description' => 'well, find the one piece', 'list' => 'list_one piece', 'responsible' => 'user_luffy', 'status' => 'waiting'],
        ['title' => 'leave my island', 'description' => 'maybe use a boat', 'list' => 'list_one piece', 'responsible' => 'user_luffy', 'status' => 'done'],
        ['title' => 'find a bigger boat', 'description' => 'required before going to grand line', 'list' => 'list_one piece', 'responsible' => 'user_luffy', 'status' => 'ongoing'],
        ['title' => 'become the best swordsman', 'description' => null, 'list' => 'list_one piece', 'responsible' => 'user_zoro', 'status' => 'ongoing'],
        ['title' => 'find my way back', 'description' => 'he is lost again', 'list' => 'list_hidden list', 'responsible' => 'user_zoro', 'status' => 'waiting'],
        ['title' => 'find all blue', 'description' => null, 'list' => 'list_one piece', 'responsible' => 'user_sanji', 'status' => 'ongoing'],
        ['title' => 'map the whole world', 'description' => null, 'list' => 'list_one piece', 'responsible' => 'user_nami', 'status' => 'ongoing'],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (static::$tasks as $data) {
            $task = new Task();
            $task->setTitle($data['title'])
                ->setDescription($data['description'])
                ->setTodoList($this->getReference($data['list']))
                ->setResponsible($this->getReference($data['responsible']))
                ->setStatus($data['status']);

            $manager->persist($task);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            TodoListFixtures::class,
        ];
    }
}
