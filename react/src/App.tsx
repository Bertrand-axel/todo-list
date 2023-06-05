import {createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider} from 'react-router-dom'
import './App.css'
import Login from "./components/utils/Login.tsx";
import PrivateRoutes from "./components/routing/PrivateRoutes.tsx";
import Dashboard from "./components/Dashboard.tsx";
import * as React from "react";
import {ValidateParam} from "./components/routing/ValidateParam.tsx";
import {TodoListDetails} from "./components/documents/todolist/TodoListDetails.tsx";
import {TaskDetails} from "./components/documents/task/TaskDetails.tsx";
import {TodoListFormWrapper} from "./components/documents/todolist/TodoListFormWrapper.tsx";
import {TaskFormWrapper} from "./components/documents/task/TaskFormWrapper.tsx";
import {Notifier} from "./components/Notifier.tsx";

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(<>
        <Route path='/login' element={<Login/>}/>
        <Route element={<PrivateRoutes/>}>
          <Route path='/' element={<Navigate to='/dashboard'/>}/>
          <Route path='/dashboard' element={<Dashboard/>}>
            <Route path='lists/create' element={<TodoListFormWrapper/>}/>
            <Route path='lists/:listId' element={<ValidateParam param='listId' regex={/^\d+$/}><Outlet/></ValidateParam>}>
              <Route path='' element={<TodoListDetails/>}/>
              <Route path='edit' element={<TodoListFormWrapper/>}/>
              <Route path='tasks/create' element={<TaskFormWrapper/>}/>
              <Route path='tasks/:taskId'
                     element={<ValidateParam param='taskId' regex={/^\d+$/}><Outlet/></ValidateParam>}>
                <Route path='details' element={<TaskDetails/>}/>
                <Route path='edit' element={<TaskFormWrapper/>}/>
              </Route>
            </Route>
          </Route>
        </Route>
      </>
    )
  );

  return <>
    <Notifier />
    <RouterProvider router={router}/>
  </>
}

export default App
