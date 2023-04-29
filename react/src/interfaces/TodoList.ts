import { ApiResource } from "../utils/types";

export interface TodoList extends ApiResource {
  title?: string;
  description?: string;
  owner?: string;
  tasks?: string[];
}
