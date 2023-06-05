import {ResourceService} from "./resourceService.ts";
import {Task} from "../../interfaces/Task.ts";
import {map, Observable} from "rxjs";
import {PagedCollection} from "../../interfaces/Collection.ts";
import {ENTRYPOINT} from "../../config/entrypoint.ts";


export class TaskService extends ResourceService<Task> {
  path: string = 'tasks';

  getForList(id: number, params: Object = {}): Observable<PagedCollection<Task>> {
    return this.client.get(`${ENTRYPOINT}todo_lists/${id}/tasks`, {params: params}).pipe(map(result => result.data));
  }
}
