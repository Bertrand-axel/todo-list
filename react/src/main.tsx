import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import {AuthWrapper} from "./auth/AuthWrapper.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <App/>
      </AuthWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)
