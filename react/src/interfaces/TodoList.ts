import { ApiResource } from "../utils/types";
import {User} from "./User.ts";
import {Task} from "./Task.ts";

export interface TodoList extends ApiResource {
  id?: number
  title?: string;
  description?: string;
  owner?: User | null;
  tasks?: Task[];
}
