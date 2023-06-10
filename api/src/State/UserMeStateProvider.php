<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<User>
 */
class UserMeStateProvider implements ProviderInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    /**
     * @param array<mixed> $uriVariables
     * @param array<mixed> $context
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): User
    {
        $user = $this->security->getUser();

        if ($user instanceof User) {
            return $user;
        }

        // unlikely to happen
        throw new NotFoundHttpException();
    }
}
