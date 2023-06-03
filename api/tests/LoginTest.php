<?php

namespace App\Tests;

use App\Test\Abstract\BaseApiTestCase;

class LoginTest extends BaseApiTestCase
{
    public function testLogin(): void
    {
        $response = $this->request('POST', '/api/login_check', ['json' => ['email' => 'luffy@op.com']]);

        $this->assertResponseStatusCodeSame(200);
        $data = $response->toArray();
        $this->assertArrayHasKey('token', $data);
        $this->assertIsString($data['token']);
    }

    public function testLoginWithNonExistingUser(): void
    {
        $response = $this->request('POST', '/api/login_check', ['json' => ['email' => 'non-existing@op.com']]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testLoginWhileLogged(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/login_check', ['json' => ['email' => 'zoro@op.com']]);

        $this->assertResponseStatusCodeSame(200);
    }
}
