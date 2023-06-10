import {ResourceService} from "./resourceService.ts";
import {TodoList} from "../../interfaces/TodoList.ts";
import {Client} from "../http/client.ts";
import {ToastStack} from "../toastStack.ts";
import {Broadcast} from "../broadcast.ts";


export class TodoListService extends ResourceService<TodoList> {
  path: string = 'todo_lists';

  constructor(client: Client, toastStack: ToastStack, private readonly broadcast: Broadcast) {
    super(client, toastStack);
  }

  protected handleDeleteSuccess() {
    super.handleDeleteSuccess();
    this.broadcast.push({type: 'rest', name: 'list.deleted'})
  }

  protected handleCreationSuccess() {
    super.handleCreationSuccess();
    this.broadcast.push({type: 'rest', name: 'list.created'})
  }

  protected handleUpdateSuccess() {
    super.handleUpdateSuccess();
    this.broadcast.push({type: 'rest', name: 'list.updated'})
  }

}
