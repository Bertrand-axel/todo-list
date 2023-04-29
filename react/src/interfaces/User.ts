import { ApiResource } from "../utils/types";

export interface User extends ApiResource {
  username?: string;
  tasks?: string[];
  todoLists?: string[];
  email?: string;
}
