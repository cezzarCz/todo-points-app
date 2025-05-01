import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/login" element={<Login />} />
       </Routes>
    </BrowserRouter>
  );
}
