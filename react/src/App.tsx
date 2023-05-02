import {Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './Home'
import taskRoutes from './routes/task'
import todolistRoutes from './routes/todolist'
import userRoutes from './routes/user'
import Login from "./components/login/Login.tsx";
import PrivateRoutes from "./components/routing/PrivateRoutes.tsx";
import {useAuthData} from "./auth/AuthWrapper.tsx";


function App() {
  const {user} = useAuthData();

  return (
    <Routes>
      {user.logged ? null : <Route path='/login' element={<Login/>}/>}
      <Route element={<PrivateRoutes/>}>
        {taskRoutes}
        {todolistRoutes}
        {userRoutes}
        <Route path='/' element={<Home/>} key='home'/>
      </Route>
    </Routes>
  )
}

export default App
