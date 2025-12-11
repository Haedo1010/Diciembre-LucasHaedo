import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ email, password });


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
        <h2 className="card-title text-center mb-2">🏋️ GymConnect</h2>
        <p className="text-center mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Inicia sesión en tu cuenta
        </p>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-2"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/solicitar-profesor')}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'transparent',
              color: '#00ff87',
              border: '1px solid #00ff87',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem',
              marginTop: '1rem'
            }}
          >
            ¿Quieres ser Profesor? Solicita aquí
          </button>

        </form>
        
        <p className="text-center mt-2" style={{ fontSize: '0.9rem' }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
