<?php

namespace App\Tests;

use App\Test\Abstract\BaseApiTestCase;

class UserTest extends BaseApiTestCase
{
    public function testGetCollectionWithoutUserIs401(): void
    {
        $response = $this->request('GET', '/api/users');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testGetWithoutUserIs401(): void
    {
        $response = $this->request('GET', '/api/users/1');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testPostWithoutUserIs401(): void
    {
        $response = $this->request('POST', '/api/users', ['json' => ['email' => 'new-user@op.com']]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testPutWithoutUserIs401(): void
    {
        $response = $this->request('PUT', '/api/users/1', ['json' => ['id' => '1', 'title' => 'some title']]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testGetCollectionIs200(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/users');

        $this->assertResponseIsSuccessful();
    }

    public function testGetIs200(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/users/1');

        $this->assertResponseIsSuccessful();
    }

    public function testGetMe(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/me');

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains(['id' => 1]);
    }

    public function testCreateIs404(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/users', ['json' => ['username' => 'nouser', 'email' => 'neouser@op.com']]);

        $this->assertResponseStatusCodeSame(404);
    }

    public function testUpdateIs404(): void
    {
        $this->login();
        $response = $this->request('PUT', '/api/users/1', ['json' => ['username' => 'nouser']]);

        $this->assertResponseStatusCodeSame(404);
    }

}
