import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { inscripcionesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Purchases from './Purchases';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myClassesCount, setMyClassesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('home');

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await inscripcionesAPI.getMyClasses();
      setMyClassesCount(response.data?.length || 0);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setMyClassesCount(0);
    } finally {
      setLoading(false);
    }   
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '80px' }}>
      <Navbar />
      
      {/* Tabs Navigation */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 2rem 0 2rem',
        display: 'flex',
        gap: '10px',
        borderBottom: '2px solid #2a2a2a',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setTab('home')}
          style={{
            padding: '12px 20px',
            background: tab === 'home' ? '#00ff87' : 'transparent',
            color: tab === 'home' ? '#000' : '#a0a0a0',
            border: tab === 'home' ? 'none' : '1px solid #2a2a2a',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            if (tab !== 'home') {
              e.target.style.borderColor = '#00ff87';
              e.target.style.color = '#00ff87';
            }
          }}
          onMouseLeave={(e) => {
            if (tab !== 'home') {
              e.target.style.borderColor = '#2a2a2a';
              e.target.style.color = '#a0a0a0';
            }
          }}
        >
          📊 Dashboard
        </button>
        
        <button
          onClick={() => setTab('compras')}
          style={{
            padding: '12px 20px',
            background: tab === 'compras' ? '#00ff87' : 'transparent',
            color: tab === 'compras' ? '#000' : '#a0a0a0',
            border: tab === 'compras' ? 'none' : '1px solid #2a2a2a',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            if (tab !== 'compras') {
              e.target.style.borderColor = '#00ff87';
              e.target.style.color = '#00ff87';
            }
          }}
          onMouseLeave={(e) => {
            if (tab !== 'compras') {
              e.target.style.borderColor = '#2a2a2a';
              e.target.style.color = '#a0a0a0';
            }
          }}
        >
          🛍️ Mis Compras
        </button>
      </div>

      {/* Contenido del Tab */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {tab === 'home' ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.5rem'
              }}>Bienvenido a GymConnect</h1>
              <p style={{ color: '#a0a0a0', fontSize: '1.1rem', margin: 0 }}>Tu sistema de gestión de gimnasio</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
              {/* Info Personal - Sidebar */}
              <div style={{
                background: '#161616',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                border: '1px solid #2a2a2a',
                position: 'relative',
                overflow: 'hidden',
                height: 'fit-content'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }} />
                
                <h2 style={{
                  color: '#00ff87',
                  marginBottom: '1.5rem',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}>Información Personal</h2>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[
                    { label: 'Nombre', value: user?.nombre || 'Usuario' },
                    { label: 'Email', value: user?.email },
                    { label: 'Rol', value: user?.rol === 'admin' ? 'Administrador' : user?.rol === 'profesor' ? 'Profesor' : 'Cliente' },
                    { label: 'Teléfono', value: user?.telefono || 'No especificado' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      padding: '0.75rem 0',
                      borderBottom: idx < 3 ? '1px solid #2a2a2a' : 'none'
                    }}>
                      <span style={{ fontWeight: '600', color: '#a0a0a0', fontSize: '0.85rem' }}>{item.label}</span>
                      <span style={{ color: '#ffffff', fontWeight: '500', fontSize: '1rem' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Stats Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem'
                }}>
                  {[
                    { icon: '🏋️‍♀️', title: 'Clases Tomadas', value: loading ? '-' : myClassesCount },
                    { icon: '📅', title: 'Próximas Clases', value: '-' },
                    { icon: '🛍️', title: 'Mis Compras', value: '->', action: true }
                  ].map((stat, idx) => (
                    <div key={idx} style={{
                      background: '#161616',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                      border: '1px solid #2a2a2a',
                      cursor: stat.action ? 'pointer' : 'default',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => {
                      if (stat.action) setTab('compras');
                    }}
                    onMouseEnter={(e) => {
                      if (stat.action) {
                        e.currentTarget.style.borderColor = '#00ff87';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 135, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (stat.action) {
                        e.currentTarget.style.borderColor = '#2a2a2a';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                      }
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 255, 135, 0.1)',
                        borderRadius: '0.75rem'
                      }}>
                        {stat.icon}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '0.9rem',
                          color: '#a0a0a0',
                          marginBottom: '0.5rem',
                          margin: 0
                        }}>{stat.title}</h3>
                        <p style={{
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          color: '#ffffff',
                          margin: 0
                        }}>{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div style={{
                  background: '#161616',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                  border: '1px solid #2a2a2a',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)'
                  }} />
                  
                  <h2 style={{
                    color: '#00ff87',
                    marginBottom: '1.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginTop: 0
                  }}>Acciones Rápidas</h2>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    {[
                      { icon: '🏃‍♀️', title: 'Ver Clases', desc: 'Explorar e inscribirse en clases', path: '/classes' },
                      { icon: '📚', title: 'Clases Tomadas', desc: 'Ver clases que dirijo como profesor', path: '/my-classes' },
                      { icon: '👤', title: 'Mi Perfil', desc: 'Ver y editar información personal', path: '/profile' },
                      { icon: '🛍️', title: 'Tienda', desc: 'Compra productos y accesorios', path: '/tienda' }
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate(action.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1.5rem',
                          background: '#1f1f1f',
                          border: '1px solid #2a2a2a',
                          borderRadius: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textAlign: 'left',
                          color: '#fff'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#00ff87';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 135, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#2a2a2a';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          fontSize: '2rem',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0, 255, 135, 0.1)',
                          borderRadius: '0.75rem',
                          flexShrink: 0
                        }}>
                          {action.icon}
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: '1.1rem',
                            marginBottom: '0.5rem',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            margin: 0
                          }}>{action.title}</h3>
                          <p style={{
                            fontSize: '0.9rem',
                            color: '#a0a0a0',
                            margin: 0
                          }}>{action.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Purchases />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
