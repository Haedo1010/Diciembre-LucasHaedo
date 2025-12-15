import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Register = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Verification & Data
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserDirectly } = useAuth();
  const navigate = useNavigate();

  // Paso 1: Solicitar código de verificación
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/request-verification', { email });
      
      if (response.data.success) {
        setStep(2);
      } else {
        setError(response.data.error || 'Error al solicitar código');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar código');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código y completar registro
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/verify-and-register', {
        email,
        verificationCode,
        nombre,
        password,
        telefono
      });

      if (response.data.success) {
        // Guardar token y usuario en localStorage
        const { token, usuario } = response.data;
        localStorage.setItem('token', token);
        setUserDirectly(usuario);
        navigate('/dashboard');
      } else {
        setError(response.data.error || 'Error al registrarse');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="form-container">
        <h2 className="card-title text-center mb-2">📝 Crear Cuenta</h2>
        <p className="text-center mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {step === 1 ? 'Paso 1: Verifica tu email' : 'Paso 2: Completa tu registro'}
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {step === 1 ? (
          // PASO 1: Solicitar código
          <form onSubmit={handleRequestCode}>
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
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Te enviaremos un código de 6 dígitos
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mt-3"
              disabled={loading}
            >
              {loading ? 'Enviando código...' : 'Solicitar Código'}
            </button>
          </form>
        ) : (
          // PASO 2: Verificar código y datos
          <form onSubmit={handleVerifyAndRegister}>
            <div className="form-group">
              <label className="form-label">Código de verificación</label>
              <input
                className="form-input"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                placeholder="000000"
                maxLength="6"
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '5px' }}
              />
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Código de 6 dígitos enviado a {email}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                className="form-input"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Juan Pérez"
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
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => setStep(1)}
              >
                Atrás
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta?{' '}
          <a
            href="/login"
            style={{
              color: 'var(--primary-color)',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
