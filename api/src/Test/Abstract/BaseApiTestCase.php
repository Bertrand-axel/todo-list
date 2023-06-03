<?php

namespace App\Test\Abstract;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

abstract class BaseApiTestCase extends ApiTestCase
{
    private ?string $token = null;

    protected function login(string $email = 'luffy@op.com'): void
    {
        self::bootKernel();
        $user = static::getContainer()->get(UserRepository::class)->findOneBy(['email' => $email]);
        /** @var JWTTokenManagerInterface $tokenManager */
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $this->token = $tokenManager->create($user);
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function request(string $method, string $url, array $options = []): ResponseInterface
    {
        if ($this->token !== null) {
            $options['headers'] = ($options['headers'] ?? []) + ['Authorization' => 'Bearer ' . $this->token];
        }

        return static::createClient()->request($method, $url, $options);
    }
}
