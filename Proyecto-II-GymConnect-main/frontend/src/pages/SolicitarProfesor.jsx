// frontend/src/pages/SolicitarProfesor.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profesorAPI } from '../services/api';

const SolicitarProfesor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email_personal: '',
    telefono: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

    try {
      await profesorAPI.solicitar(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error enviando solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: '#161616',
          borderRadius: '1rem',
          padding: '3rem',
          maxWidth: '500px',
          textAlign: 'center',
          border: '1px solid #2a2a2a'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#00ff87', marginBottom: '1rem' }}>¡Solicitud Enviada!</h2>
          <p style={{ color: '#a0a0a0', marginBottom: '2rem' }}>
            Tu solicitud ha sido enviada exitosamente. Recibirás una respuesta del equipo de GymConnect pronto.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
              color: '#0a0a0a',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        background: '#161616',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        border: '1px solid #2a2a2a'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>Solicitar Cuenta de Profesor</h2>
          <p style={{ color: '#a0a0a0', fontSize: '0.95rem' }}>
            Completa el formulario para solicitar una cuenta como profesor
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid #ff4444',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#ff4444'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={ {marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '0.5rem',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Email Personal
            </label>
            <input
              type="email"
              name="email_personal"
              value={formData.email_personal}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '0.5rem',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '0.5rem',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Mensaje (Opcional)
            </label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              rows="4"
              placeholder="Cuéntanos por qué quieres ser profesor en GymConnect..."
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '0.5rem',
                color: '#ffffff',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#666' : 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
              color: loading ? '#ccc' : '#0a0a0a',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'transparent',
              color: '#a0a0a0',
              border: '1px solid #2a2a2a',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Volver al Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolicitarProfesor;
