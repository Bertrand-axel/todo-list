<?php

namespace App\Tests;

use App\Test\Abstract\BaseApiTestCase;

class TodoListTest extends BaseApiTestCase
{
    public function testGetCollectionWithoutUserIs401(): void
    {
        $response = $this->request('GET', '/api/todo_lists');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testGetWithoutUserIs401(): void
    {
        $response = $this->request('GET', '/api/todo_lists/1');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testPostWithoutUserIs401(): void
    {
        $response = $this->request('POST', '/api/todo_lists', ['json' => ['title' => 'some title']]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testPutWithoutUserIs401(): void
    {
        $response = $this->request('PUT', '/api/todo_lists/1', ['json' => ['id' => '1', 'title' => 'some title']]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testGetCollectionIs200(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/todo_lists');

        $this->assertResponseIsSuccessful();
    }

    public function testGetIs200(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/todo_lists/1');

        $this->assertResponseIsSuccessful();
    }

    public function testGetNonExisting(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/todo_lists/999000999');

        $this->assertResponseStatusCodeSame(404);
    }

    public function testCreateList(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/todo_lists', ['json' => [
            'title' => 'my test list',
            'description' => 'here is a description',
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains([
            'title' => 'my test list',
            'description' => 'here is a description',
            'owner' => ['@id' => '/api/users/1'],
        ]);
    }

    public function testCreateListWithMyself(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/todo_lists', ['json' => [
            'title' => 'my test list',
            'description' => 'here is a description',
            'owner' => '/api/users/1',
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains([
            'title' => 'my test list',
            'description' => 'here is a description',
            'owner' => ['@id' => '/api/users/1'],
        ]);

        $response = $this->request('GET', $response->toArray()['@id']);
        $this->assertResponseStatusCodeSame(200);
        $this->assertJsonContains([
            'title' => 'my test list',
            'description' => 'here is a description',
            'owner' => ['@id' => '/api/users/1'],
        ]);
    }

    public function testCreateListWithSomeoneElse(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/todo_lists', ['json' => [
            'title' => 'my test list',
            'description' => 'here is a description',
            'owner' => '/api/users/2',
        ]]);

        $this->assertResponseStatusCodeSame(403);
        $this->assertJsonContains(['hydra:description' => 'You can\'t create a list for an other user']);
    }

    public function testCreateListWithNonExistingUser(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/todo_lists', ['json' => [
            'title' => 'my test list',
            'description' => 'here is a description',
            'owner' => '/api/users/999000999',
        ]]);

        $this->assertResponseStatusCodeSame(400);
    }

    public function testUpdateList(): void
    {
        $this->login();
        $response = $this->request('PUT', '/api/todo_lists/1', ['json' => [
            'title' => 'new test title',
            'description' => 'new test description',
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'title' => 'new test title',
            'description' => 'new test description',
            'owner' => ['@id' => '/api/users/1'],
        ]);

        $response = $this->request('GET', '/api/todo_lists/1');

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'title' => 'new test title',
            'description' => 'new test description',
            'owner' => ['@id' => '/api/users/1'],
        ]);
    }

    public function testUpdateListIDontOwn(): void
    {
        $this->login();
        $response = $this->request('PUT', '/api/todo_lists/2', ['json' => ['title' => 'new test title again',]]);

        $this->assertResponseStatusCodeSame(403);
        $this->assertJsonContains(['hydra:description' => 'You are not allowed to edit someone else\'s list']);
    }

    public function testDeleteList(): void
    {
        $this->login();
        $response = $this->request('DELETE', '/api/todo_lists/1');

        $this->assertResponseIsSuccessful();

        $response = $this->request('GET', '/api/todo_lists/1');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testDeleteListFromSomeoneElse(): void
    {
        $this->login();
        $response = $this->request('DELETE', '/api/todo_lists/2');

        $this->assertResponseStatusCodeSame(403);
        $this->assertJsonContains(['hydra:description' => 'You are not allowed to delete someone else\'s list']);

        $response = $this->request('GET', '/api/todo_lists/1');
        $this->assertResponseIsSuccessful();
    }

}
