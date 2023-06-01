import { ApiResource } from "../utils/types";
import {User} from "./User.ts";
import {TodoList} from "./TodoList.ts";

export interface Task extends ApiResource {
  title?: string;
  description?: string;
  status?: string;
  responsible?: User | null;
  todoList?: TodoList | null;
}
