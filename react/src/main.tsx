import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ContainerWrapper} from "./contexts/containerWrapper.tsx";
import {Container, Factory} from "./services/container.ts";
import {LocalStorage} from "./services/storage.ts";
import AuthService from "./services/auth.ts";
import {Logger} from "./services/logger.ts";
import {Client} from "./services/http/client.ts";
import {CurrentUserProvider} from "./services/providers/currentUserProvider.ts";
import {TodoListService} from "./services/providers/todoListService.ts";
import {TaskService} from "./services/providers/taskService.ts";
import {UserService} from "./services/providers/userService.ts";
import {ToastStack} from "./services/toastStack.ts";
import {Broadcast} from "./services/broadcast.ts";


const container = new Container();
container
  .inject('Logger', new Factory(Logger))
  .inject('Storage', new Factory(LocalStorage))
  .inject('AuthService', new Factory(AuthService, ['Storage']))
  .inject('Client', new Factory(Client, ['AuthService']))
  .inject('CurrentUserProvider', new Factory(CurrentUserProvider, ['AuthService', 'Client']))
  .inject('TodoListService', new Factory(TodoListService, ['Client', 'ToastStack', 'Broadcast']))
  .inject('TaskService', new Factory(TaskService, ['Client', 'ToastStack']))
  .inject('UserService', new Factory(UserService, ['Client', 'ToastStack']))
  .inject('ToastStack', new Factory(ToastStack))
  .inject('Broadcast', new Factory(Broadcast))
;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ContainerWrapper container={container}>
      <App/>
    </ContainerWrapper>
  </React.StrictMode>,
)
