// frontend/src/components/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(22, 22, 22, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #2a2a2a',
      padding: '0.75rem 0'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo/Brand - CLICK VA AL HOME */}
        <h2 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          GYMCONNECT
        </h2>


        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user?.rol !== 'admin' ? (
            <> 
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: isActive('/dashboard') ? 'rgba(0, 255, 135, 0.1)' : 'transparent',
                  color: isActive('/dashboard') ? '#00ff87' : '#a0a0a0',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Dashboard
              </button>

              <button onClick={() => navigate('/tienda')} style={{
                background: isActive('/tienda') ? 'rgba(0, 255, 135, 0.1)' : 'transparent',
                color: isActive('/tienda') ? '#00ff87' : '#a0a0a0',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}> Tienda</button>

              <button
                onClick={() => navigate('/classes')}
                style={{
                  background: isActive('/classes') ? 'rgba(0, 255, 135, 0.1)' : 'transparent',
                  color: isActive('/classes') ? '#00ff87' : '#a0a0a0',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Clases
              </button>

              {user?.rol === 'profesor' ? (
                <button
                  onClick={() => navigate('/my-classes')}
                  style={{
                    background: isActive('/my-classes') ? 'rgba(0, 255, 135, 0.1)' : 'transparent',
                    color: isActive('/my-classes') ? '#00ff87' : '#a0a0a0',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Clases Tomadas
                </button>
              ) : (
                <button
                  onClick={() => navigate('/my-classes')}
                  style={{
                    background: isActive('/my-classes') ? 'rgba(0, 255, 135, 0.1)' : 'transparent',
                    color: isActive('/my-classes') ? '#00ff87' : '#a0a0a0',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Mis Clases
                </button>
              )}

              {user && (
                <button
                  onClick={() => navigate('/profile')}
                  style={{
                    background: isActive('/profile') ? 'rgba(0, 255, 135, 0.1)' : 'transparent',
                    color: isActive('/profile') ? '#00ff87' : '#a0a0a0',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Perfil
                </button>
              )}
            </>
          ) : (
            // Si es admin, sólo mostrar Perfil (si existe) y AdminPanel (el botón Admin está en User Menu)
            user && (
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: isActive('/profile') ? 'rgba(0, 255, 135, 0.1)' : 'transparent',
                  color: isActive('/profile') ? '#00ff87' : '#a0a0a0',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Perfil
              </button>
            )
          )}
        </div>

        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
            {user?.nombre} {user?.rol === 'profesor' && '(Profesor)'}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 68, 68, 0.1)',
              color: '#ff4444',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ff4444';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 68, 68, 0.1)';
              e.target.style.color = '#ff4444';
            }}
          >
            Cerrar Sesión
          </button>
          {user?.rol === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              style={{
                background: isActive('/admin') ? 'rgba(0, 255, 135, 0.1)' : 'transparent',
                color: isActive('/admin') ? '#00ff87' : '#a0a0a0',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Admin Panel
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
