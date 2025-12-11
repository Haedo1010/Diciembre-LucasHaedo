import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { inscripcionesAPI } from '../services/api';

const MyClasses = () => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarClases();
  }, []);

  const cargarClases = async () => {
    try {
      const res = await inscripcionesAPI.getMyClasses();
      setClases(res.data || []);
    } catch (error) {
      console.error('Error:', error);
      setClases([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelar = async (id) => {
    if (window.confirm('¿Cancelar?')) {
      try {
        await inscripcionesAPI.cancelar(id);
        cargarClases();
      } catch (error) {
        alert('Error al cancelar');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '80px' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#00ff87', marginBottom: '2rem' }}>Mis Clases</h1>

        {loading ? (
          <p style={{ color: '#a0a0a0' }}>Cargando...</p>
        ) : clases.length === 0 ? (
          <p style={{ color: '#a0a0a0' }}>No hay clases inscritas</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {clases.map((e) => (
              <div key={e.id} style={{ background: '#1a1a1a', border: '1px solid #00ff87', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <h3 style={{ color: '#00ff87' }}>{e.clase?.nombre || 'Clase'}</h3>
                <p style={{ color: '#a0a0a0', marginBottom: '1rem' }}>{e.clase?.descripcion}</p>
                <button
                  onClick={() => cancelar(e.id)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClasses;
