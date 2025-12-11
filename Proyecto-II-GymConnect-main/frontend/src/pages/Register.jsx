import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="form-container">
        <h2 className="card-title text-center mb-2">📝 Crear Cuenta</h2>
        <p className="text-center mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Únete a GymConnect
        </p>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              className="form-input"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Mínimo 6 caracteres
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono (opcional)</label>
            <input
              className="form-input"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+54 9 11 1234-5678"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-2"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <p className="text-center mt-2" style={{ fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
