import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import '../styles/UserVerification.css';

const UserVerification = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    cargarUsuariosNoVerificados();
  }, []);

  const cargarUsuariosNoVerificados = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.obtenerUsuariosNoVerificados();
      setUsuarios(response.data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setMensaje({
        tipo: 'error',
        texto: 'Error al cargar usuarios no verificados'
      });
    } finally {
      setLoading(false);
    }
  };

  const verificarUsuario = async (usuarioId) => {
    try {
      setVerificando(usuarioId);
      const response = await adminAPI.verificarUsuario(usuarioId);
      
      setMensaje({
        tipo: 'exito',
        texto: response.data.mensaje
      });

      // Recargar lista
      cargarUsuariosNoVerificados();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error('Error verificando usuario:', error);
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.error || 'Error al verificar usuario'
      });
    } finally {
      setVerificando(null);
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="user-verification-container">
      <div className="verification-header">
        <h2>🔐 Verificación de Usuarios</h2>
        <p className="subtitle">Administra la verificación de correos electrónicos de usuarios</p>
      </div>

      {mensaje && (
        <div className={`mensaje-alerta ${mensaje.tipo}`}>
          <span>{mensaje.texto}</span>
          <button onClick={() => setMensaje(null)}>✕</button>
        </div>
      )}

      <div className="verification-stats">
        <div className="stat-box">
          <div className="stat-number">{usuarios.length}</div>
          <div className="stat-label">Usuarios sin verificar</div>
        </div>
      </div>

      <div className="verification-controls">
        <button 
          className={`control-btn ${filtro === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltro('todos')}
        >
          Todos
        </button>
        <button 
          className={`control-btn refresh-btn`}
          onClick={cargarUsuariosNoVerificados}
          disabled={loading}
        >
          {loading ? '⟳ Recargando...' : '⟳ Actualizar'}
        </button>
      </div>

      {loading && <div className="loading-spinner">Cargando usuarios...</div>}

      <div className="usuarios-list">
        {usuarios.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <p>Todos los usuarios están verificados</p>
          </div>
        ) : (
          usuarios.map((usuario) => (
            <div key={usuario.idBase || usuario.id} className="usuario-card">
              <div className="usuario-info">
                <div className="usuario-header">
                  <h3 className="usuario-nombre">{usuario.nombre}</h3>
                  <span className="usuario-id">ID: {usuario.id}</span>
                </div>
                
                <div className="usuario-details">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{usuario.email}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Código verificación:</span>
                    <span className="detail-value code">
                      {usuario.verificationCode ? `${usuario.verificationCode.substring(0, 6)}...` : 'No generado'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Registrado:</span>
                    <span className="detail-value">{formatearFecha(usuario.createdAt)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Estado:</span>
                    <span className="detail-value status-pendiente">
                      ⏳ Pendiente de verificación
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="btn-verificar"
                onClick={() => verificarUsuario(usuario.id)}
                disabled={verificando === usuario.id}
              >
                {verificando === usuario.id ? (
                  <>⟳ Verificando...</>
                ) : (
                  <>✓ Verificar Usuario</>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="verification-info">
        <h4>ℹ️ Información</h4>
        <ul>
          <li>Los usuarios aparecen aquí cuando se registran sin verificar su correo</li>
          <li>Al hacer clic en "Verificar Usuario", se marca la cuenta como verificada</li>
          <li>El usuario podrá acceder a todas las funciones de la plataforma</li>
          <li>El código de verificación será eliminado automáticamente</li>
        </ul>
      </div>
    </div>
  );
};

export default UserVerification;
