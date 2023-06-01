import {ResourceService} from "./resourceService.ts";
import {TodoList} from "../../interfaces/TodoList.ts";
import {User} from "../../interfaces/User.ts";


export class UserService extends ResourceService<User> {
  path: string = 'users';

}
