import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import {ContainerWrapper} from "./contexts/containerWrapper.tsx";
import {Container, Factory} from "./services/container.ts";
import {LocalStorage} from "./services/storage.ts";
import AuthService from "./services/auth.ts";
import {Logger} from "./services/logger.ts";
import {Client} from "./services/http/client.ts";
import {CurrentUserProvider} from "./services/providers/currentUserProvider.ts";



const container = new Container();
container
  .inject('Logger', new Factory(Logger))
  .inject('Storage', new Factory(LocalStorage))
  .inject('AuthService', new Factory(AuthService, ['Storage']))
  .inject('Client', new Factory(Client, ['AuthService']))
  .inject('CurrentUserProvider', new Factory(CurrentUserProvider, ['AuthService', 'Client']))
;

container.get<Logger>('Logger').log('thers');


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContainerWrapper container={container}>
        <App/>
      </ContainerWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)
