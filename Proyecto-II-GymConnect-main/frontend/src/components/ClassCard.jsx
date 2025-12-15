import { useState } from 'react';
import { inscripcionesAPI } from '../services/api';

const ClassCard = ({ clase, onEnroll }) => {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async () => {
  try {
    setLoading(true);
    
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      alert(' Debes iniciar sesión para inscribirte');
      window.location.href = '/login';
      return;
    }

    console.log(' Inscribiendo a clase:', clase.id);
    
    const response = await inscripcionesAPI.inscribirse(clase.id);
    
    setEnrolled(true);
    alert(' ¡Inscripción exitosa!');
    if (onEnroll) onEnroll();
    
  } catch (error) {
    console.error(' Error en inscripción:', error);
    
    if (error.response?.status === 401) {
      alert(' Sesión expirada. Por favor, inicia sesión nuevamente.');
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    } else if (error.response?.status === 404) {
      alert(' Error: La ruta de inscripción no existe. Contacta al administrador.');
    } else {
      alert(' Error: ' + (error.response?.data?.error || error.message));
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid #00ff87',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        background: '#0a0a0a'
      }}>
        <img
          src={clase.imagen}
          alt={clase.nombre}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Clase';
          }}
        />
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: '#00ff87', margin: 0, marginBottom: '0.5rem' }}>
          {clase.nombre}
        </h3>
        
        <p style={{ color: '#a0a0a0', margin: '0.5rem 0', fontSize: '0.9rem', flex: 1 }}>
          {clase.descripcion}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#60efff' }}>📅 {clase.fecha}</span>
          <span style={{ color: '#00ff87' }}>⏱️ {clase.duracion}min</span>
        </div>

        <button
          onClick={handleEnroll}
          disabled={loading || enrolled}
          style={{
            padding: '0.6rem',
            background: enrolled ? '#888' : '#00ff87',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: '0.4rem',
            cursor: enrolled ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Tomando...' : enrolled ? 'Ya tomada' : 'Tomar'}
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
