import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import TaskForm from './components/TaskForm'


function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken'); // Verifica se o token existe no localStorage
  console.log('Token no PrivateRoute encontrado:', token); // Log para depuração
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route 
        path="/tasks/new"
        element={
          <PrivateRoute>
            <TaskForm />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  )
}
