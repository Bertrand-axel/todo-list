<?php

namespace App\DataFixtures;

use App\Entity\TodoList;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class TodoListFixtures extends Fixture implements DependentFixtureInterface
{
    /** @var array<array{title: string, description: ?string, owner: string}> */
    protected static $lists = [
        ['title' => 'one piece', 'description' => 'a manga that is way too long', 'owner' => 'user_luffy'],
        ['title' => 'hidden list', 'description' => null, 'owner' => 'user_zoro'],
    ];


    public function load(ObjectManager $manager): void
    {
        foreach (static::$lists as $data) {
            $list = new TodoList();
            $list->setTitle($data['title'])
                ->setDescription($data['description'])
                ->setOwner($this->getReference($data['owner']));

            $manager->persist($list);
            $this->addReference('list_' . $data['title'], $list);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
