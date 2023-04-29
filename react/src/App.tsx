import {Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './Home'
import taskRoutes from './routes/task'
import todolistRoutes from './routes/todolist'
import userRoutes from './routes/user'


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} key='home' />
        { taskRoutes }
        { todolistRoutes }
        { userRoutes }
      </Routes>
    </>
  )
}

export default App
