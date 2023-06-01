import {ResourceService} from "./resourceService.ts";
import {TodoList} from "../../interfaces/TodoList.ts";


export class TodoListService extends ResourceService<TodoList> {
  path: string = 'todo_lists';

}
