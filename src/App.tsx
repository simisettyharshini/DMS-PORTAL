
import './App.css'
import { Route,Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'

function App() {


  return (
    <>
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
     </Routes>
    </>
  )
}

export default App
