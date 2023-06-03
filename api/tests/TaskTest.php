<?php

namespace App\Tests;

use App\Enums\Status;
use App\Test\Abstract\BaseApiTestCase;

class TaskTest extends BaseApiTestCase
{
    public function testGetCollectionWithoutUserIs401(): void
    {
        $response = $this->request('GET', '/api/tasks');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testGetWithoutUserIs401(): void
    {
        $response = $this->request('GET', '/api/tasks/1');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testPostWithoutUserIs401(): void
    {
        $response = $this->request('POST', '/api/tasks', ['json' => ['title' => 'some title']]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testPutWithoutUserIs401(): void
    {
        $response = $this->request('PUT', '/api/tasks/1', ['json' => ['id' => '1', 'title' => 'some title']]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testGetCollectionIs200(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/tasks');

        $this->assertResponseIsSuccessful();
    }

    public function testGetIs200(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/tasks/1');

        $this->assertResponseIsSuccessful();
    }

    public function testGetNonExisting(): void
    {
        $this->login();
        $response = $this->request('GET', '/api/tasks/999000999');

        $this->assertResponseStatusCodeSame(404);
    }

    public function testCreate(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/tasks', ['json' => [
            'todoList' => '/api/todo_lists/1',
            'title' => 'my test task',
            'status' => Status::DOING->value,
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains([
            'todoList' => ['@id' =>'/api/todo_lists/1'],
            'title' => 'my test task',
            'status' => Status::DOING->value,
        ]);
    }

    public function testCreateWithoutList(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/tasks', ['json' => [
            'title' => 'my test task',
            'status' => Status::DOING->value,
        ]]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testCreateListForMyself(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/tasks', ['json' => [
            'todoList' => '/api/todo_lists/1',
            'title' => 'my test task',
            'description' => 'here is a description',
            'status' => Status::DOING->value,
            'responsible' => '/api/users/1',
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains([
            'todoList' => ['@id' =>'/api/todo_lists/1'],
            'title' => 'my test task',
            'status' => Status::DOING->value,
            'responsible' => ['@id' => '/api/users/1'],
        ]);

        $response = $this->request('GET', $response->toArray()['@id']);
        $this->assertResponseStatusCodeSame(200);
        $this->assertJsonContains([
            'todoList' => ['@id' =>'/api/todo_lists/1'],
            'title' => 'my test task',
            'description' => 'here is a description',
            'status' => Status::DOING->value,
            'responsible' => ['@id' => '/api/users/1'],
        ]);
    }

    public function testCreateForSomeoneElseAsIOwnList(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/tasks', ['json' => [
            'todoList' => '/api/todo_lists/1',
            'title' => 'my test task',
            'status' => Status::DOING->value,
            'responsible' => '/api/users/2',
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'todoList' => ['@id' =>'/api/todo_lists/1'],
            'title' => 'my test task',
            'status' => Status::DOING->value,
            'responsible' => ['@id' => '/api/users/2'],
        ]);
    }

    public function testCreateForSomeoneElseAsIDontOwnList(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/tasks', ['json' => [
            'todoList' => '/api/todo_lists/2',
            'title' => 'my test task',
            'status' => Status::DOING->value,
            'responsible' => '/api/users/2',
        ]]);

        $this->assertResponseStatusCodeSame(500);
        $this->assertJsonContains(['message' => 'You can\'t create a task on a list you don\'t own']);
    }

    public function testCreateAsIDontOwnList(): void
    {
        $this->login();
        $response = $this->request('POST', '/api/tasks', ['json' => [
            'todoList' => '/api/todo_lists/2',
            'title' => 'my test task',
            'status' => Status::DOING->value,
            'responsible' => '/api/users/1',
        ]]);

        $this->assertResponseStatusCodeSame(500);
        $this->assertJsonContains(['message' => 'You can\'t create a task on a list you don\'t own']);
    }

    public function testUpdateTask(): void
    {
        $this->login();
        $response = $this->request('PUT', '/api/tasks/1', ['json' => [
            'title' => 'new test title',
            'description' => 'new test description',
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'title' => 'new test title',
            'description' => 'new test description',
            'responsible' => ['@id' => '/api/users/1'],
        ]);

        $response = $this->request('GET', '/api/tasks/1');

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'title' => 'new test title',
            'description' => 'new test description',
            'responsible' => ['@id' => '/api/users/1'],
        ]);
    }

    public function testUpdateTaskForSomeoneElseOnListIOwn(): void
    {
        $this->login();
        $response = $this->request('PUT', '/api/tasks/2', ['json' => ['title' => 'test again']]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'title' => 'test again',
            'responsible' => ['@id' => '/api/users/2'],
        ]);
    }

    public function testUpdateTaskForMeElseOnListIDonOwn(): void
    {
        $this->login('zoro@op.com');
        $response = $this->request('PUT', '/api/tasks/2', ['json' => ['status' => Status::DONE->value]]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'status' => Status::DONE->value,
            'responsible' => ['@id' => '/api/users/2'],
        ]);
    }

    public function testUpdateTaskForSomeoneElseOnListIDontOwn(): void
    {
        $this->login();
        $response = $this->request('PUT', '/api/tasks/3', ['json' => ['title' => 'test again']]);

        $this->assertResponseStatusCodeSame(500);
        $this->assertJsonContains(['message' => 'You are not allowed to edit someone else\'s task']);
    }

}
