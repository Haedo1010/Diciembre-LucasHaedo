import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('🔍 Validando token...');
      const response = await authAPI.validarToken();
      console.log('✅ Respuesta validar-token:', response.data);
      
      // Maneja tanto 'user' como 'usuario'
      const usuario = response.data.user || response.data.usuario;
      
      if (usuario) {
        console.log('👤 Usuario válido:', usuario);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        setUser(usuario);
        setIsAuthenticated(true);
      } else {
        console.warn('⚠️ Respuesta sin usuario');
        logout();
      }
    } catch (error) {
      console.error('❌ Error en checkAuth:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      console.log('📤 Iniciando sesión...');
      const response = await authAPI.iniciarSesion(userData);
      console.log('✅ Respuesta login:', response.data);
      
      // Extrae token y usuario (maneja ambos casos)
      const token = response.data.token;
      const usuario = response.data.usuario || response.data.user;
      
      if (!token || !usuario) {
        throw new Error('Datos incompletos en la respuesta');
      }
      
      console.log('👤 Usuario logueado:', usuario);
      
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      
      setUser(usuario);
      setIsAuthenticated(true);

      alert(`✅ Bienvenido ${usuario.nombre}!`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error en login:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Error en el login';
      alert('❌ ' + errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.registrarse(userData);
      
      const token = response.data.token;
      const usuario = response.data.usuario || response.data.user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      
      setUser(usuario);
      setIsAuthenticated(true);

      alert(`✅ ¡Registro exitoso! Bienvenido ${usuario.nombre}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Error en el registro';
      alert('❌ ' + errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    console.log('👋 Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};