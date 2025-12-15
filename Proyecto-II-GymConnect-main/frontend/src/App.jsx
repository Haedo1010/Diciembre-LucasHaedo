import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NonAdminRoute from './components/NonAdminRoute';
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
          <Route path="/dashboard" element={<NonAdminRoute><Dashboard /></NonAdminRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-classes" element={<NonAdminRoute><MyClasses /></NonAdminRoute>} />
          <Route path="/classes" element={<NonAdminRoute><Classes /></NonAdminRoute>} />
          <Route path="/tienda" element={<NonAdminRoute><Tienda /></NonAdminRoute>} />
          <Route path="/purchases" element={<NonAdminRoute><Purchases /></NonAdminRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;