<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    /** @var array<array{username: string, email: string}> */
    protected static array $users = [
        ['username' => 'luffy', 'email' => 'luffy@op.com'],
        ['username' => 'zoro', 'email' => 'zoro@op.com'],
        ['username' => 'nami', 'email' => 'nami@op.com'],
        ['username' => 'usopp', 'email' => 'usopp@op.com'],
        ['username' => 'sanji', 'email' => 'sanji@op.com'],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (static::$users as $raw) {
            $user = new User();
            $user->setEmail($raw['email'])
                ->setUsername($raw['username']);

            $manager->persist($user);
            $this->addReference('user_' . $raw['username'], $user);
        }

        $manager->flush();
    }
}
