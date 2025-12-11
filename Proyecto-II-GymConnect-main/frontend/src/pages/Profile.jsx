// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    nombre: '',
    telefono: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        telefono: user.telefono || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authAPI.updateProfile({
        email: user.email,
        ...profileData
      });
      setMessage('Perfil actualizado exitosamente');
    } catch (err) {
      setError(err.response?.data?.error || 'Error actualizando perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await authAPI.changePassword({
        email: user.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('Contraseña actualizada exitosamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error cambiando contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Mi Perfil</h1>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: 'var(--spacing-lg)', 
          flexWrap: 'wrap', 
          borderBottom: '2px solid var(--border-color)' 
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '600',
              color: activeTab === 'profile' ? 'var(--primary-color)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'profile' ? '2px solid var(--primary-color)' : 'none',
              marginBottom: '-2px'
            }}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '600',
              color: activeTab === 'password' ? 'var(--primary-color)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'password' ? '2px solid var(--primary-color)' : 'none',
              marginBottom: '-2px'
            }}
          >
            Cambiar Contraseña
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Tab: Perfil */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                className="form-input"
                type="text"
                value={profileData.nombre}
                onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={user?.email}
                disabled
                style={{ background: 'var(--bg-dark)', cursor: 'not-allowed', opacity: 0.6 }}
              />
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                El email no se puede cambiar
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                className="form-input"
                type="tel"
                value={profileData.telefono}
                onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rol</label>
              <input
                className="form-input"
                type="text"
                value={user?.rol}
                disabled
                style={{ background: 'var(--bg-dark)', cursor: 'not-allowed', opacity: 0.6, textTransform: 'capitalize' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        )}

        {/* Tab: Contraseña */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Contraseña actual</label>
              <input
                className="form-input"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <input
                className="form-input"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength="6"
              />
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Mínimo 6 caracteres
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar nueva contraseña</label>
              <input
                className="form-input"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
