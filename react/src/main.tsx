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



const container = new Container();
container
  .inject('Storage', new Factory(LocalStorage))
  .inject( 'AuthService', new Factory(AuthService, ['Storage']))
  .inject('Logger', new Factory(Logger))
// .inject('client', new Factory(Client, ['AuthService']))
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
