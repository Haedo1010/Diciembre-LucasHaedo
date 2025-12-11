import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyClasses from './pages/MyClasses';
import Classes from './pages/Classes';
import Tienda from './pages/Tienda';
import Purchases from './pages/Purchases';
import AdminPanel from './pages/AdminPanel';
import SolicitarProfesor from './pages/SolicitarProfesor';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/solicitar-profesor" element={<SolicitarProfesor />} />

          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-classes" element={<MyClasses />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/admin" element={<AdminPanel />} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;