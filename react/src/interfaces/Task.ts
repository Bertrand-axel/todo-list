import { ApiResource } from "../utils/types";

export interface Task extends ApiResource {
  title?: string;
  description?: string;
  status?: string;
  responsible?: string;
  todoList?: string;
}
