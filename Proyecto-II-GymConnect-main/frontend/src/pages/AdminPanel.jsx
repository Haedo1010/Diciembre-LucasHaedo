// src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { profesorAPI, adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import UserVerification from '../components/UserVerification';
import { validarIdRecibido, generarIdSeguro } from '../utils/idSeguro';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [erroresIds, setErroresIds] = useState([]);
  const [showDescripcion, setShowDescripcion] = useState(false);
  const [descripcionData, setDescripcionData] = useState(null);

  useEffect(() => {
    if (activeTab === 'solicitudes') {
      loadSolicitudes();
    } else if (activeTab === 'usuarios') {
      loadUsuarios();
    }
    // El tab 'verificacion' no necesita cargar nada aquí, lo hace el componente
  }, [activeTab]);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.obtenerSolicitudes();
      
      // Validar IDs recibidos
      const solicitudesValidadas = response.data.map(solicitud => {
        const validacion = validarIdRecibido(solicitud.id);
        return {
          ...solicitud,
          _idValido: validacion.valido,
          _idError: validacion.error
        };
      });
      
      // Identificar IDs inválidos
      const idsInvalidos = solicitudesValidadas
        .filter(s => !s._idValido)
        .map(s => ({ id: s.id, error: s._idError }));
      
      if (idsInvalidos.length > 0) {
        setErroresIds(idsInvalidos);
        console.warn(' Solicitudes con IDs potencialmente alterados:', idsInvalidos);
      }
      
      setSolicitudes(solicitudesValidadas);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.obtenerUsuarios();

      console.log(" IDs recibidos del backend:", response.data.map(u => u.id));
      
      // Validar IDs recibidos y calcular estado de bloqueo efectivo
      const usuariosValidados = response.data.map(usuario => {
        const validacion = validarIdRecibido(usuario.id);

        // Normalizar ID numérico a ID seguro
        if (typeof usuario.id === 'number' || /^\d+$/.test(usuario.id)) {
          const idConDigito = generarIdSeguro(usuario.id);
          usuario.id = idConDigito;
        }

        // Re-validar ID (ya sea original o convertido)
        const validacionFinal = validarIdRecibido(usuario.id);

        // Calcular si está bloqueado efectivamente (admin block OR locks por login/verification aún vigentes)
        const ahora = new Date();
        const tieneLoginLock = usuario.loginLockedUntil && new Date(usuario.loginLockedUntil) > ahora;
        const tieneVerificationLock = usuario.verificationLockedUntil && new Date(usuario.verificationLockedUntil) > ahora;
        const isBlockedFlag = !!usuario.isBlocked || !!tieneLoginLock || !!tieneVerificationLock;

        return {
          ...usuario,
          _idValido: validacionFinal.valido,
          _idError: validacionFinal.error,
          isBlockedFlag,
          _hasLoginLock: !!tieneLoginLock,
          _hasVerificationLock: !!tieneVerificationLock
        };
      });
      
      // Identificar IDs inválidos
      const idsInvalidos = usuariosValidados
        .filter(u => !u._idValido)
        .map(u => ({ id: u.id, error: u._idError }));
      
      if (idsInvalidos.length > 0) {
        setErroresIds(idsInvalidos);
        console.warn(' Usuarios con IDs potencialmente alterados:', idsInvalidos);
      }
      
      setUsuarios(usuariosValidados);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (idSeguro) => {
    try {
      // Validar ID antes de enviar
      const validacion = validarIdRecibido(idSeguro);
      if (!validacion.valido) {
        alert(` Error de seguridad: ${validacion.error}`);
        return;
      }
      
      // El interceptor en api.js convertirá automáticamente el ID a formato seguro
      const response = await adminAPI.aprobarProfesor(idSeguro);
      alert('✔' + response.data.message);
      loadSolicitudes();
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.error?.includes('ID alterado')) {
        alert(' Error de seguridad: El ID ha sido alterado. Operación cancelada.');
      } else {
        alert('Error aprobando solicitud');
      }
    }
  };

  const handleRechazar = async (idSeguro) => {
    if (window.confirm('¿Estás seguro de rechazar esta solicitud?')) {
      try {
        // Validar ID antes de enviar
        const validacion = validarIdRecibido(idSeguro);
        if (!validacion.valido) {
          alert(` Error de seguridad: ${validacion.error}`);
          return;
        }
        
        await adminAPI.rechazarProfesor(idSeguro);
        alert('Solicitud rechazada');
        loadSolicitudes();
      } catch (error) {
        if (error.response?.status === 400 && error.response.data?.error?.includes('ID alterado')) {
          alert(' Error de seguridad: El ID ha sido alterado. Operación cancelada.');
        } else {
          alert('Error rechazando solicitud');
        }
      }
    }
  };

  const handleBuscar = async () => {
    if (busqueda.trim().length < 2) {
      alert('Ingresa al menos 2 caracteres');
      return;
    }
    try {
      const response = await adminAPI.buscarUsuarios(busqueda);
      
      // Validar IDs recibidos
      const usuariosValidados = response.data.map(usuario => {
        const validacion = validarIdRecibido(usuario.id);
        return {
          ...usuario,
          _idValido: validacion.valido,
          _idError: validacion.error
        };
      });
      
      setUsuarios(usuariosValidados);
    } catch (error) {
      console.error('Error buscando:', error);
    }
  };

  const handleCambiarRol = async (idSeguro, nuevoRol) => {
    try {
      // Validar ID antes de enviar
      const validacion = validarIdRecibido(idSeguro);
      if (!validacion.valido) {
        alert(` Error de seguridad: ${validacion.error}`);
        return;
      }
      
      await adminAPI.cambiarRol(idSeguro, nuevoRol);
      alert('Rol cambiado exitosamente');
      loadUsuarios();
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.error?.includes('ID alterado')) {
        alert(' Error de seguridad: El ID ha sido alterado. Operación cancelada.');
      } else {
        alert('Error cambiando rol');
      }
    }
  };

  const handleEliminar = async (idSeguro) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        // Validar ID antes de enviar
        const validacion = validarIdRecibido(idSeguro);
        if (!validacion.valido) {
          alert(` Error de seguridad: ${validacion.error}`);
          return;
        }
        
        await adminAPI.eliminarUsuario(idSeguro);
        alert('Usuario eliminado');
        loadUsuarios();
      } catch (error) {
        if (error.response?.status === 400 && error.response.data?.error?.includes('ID alterado')) {
          alert(' Error de seguridad: El ID ha sido alterado. Operación cancelada.');
        } else {
          alert(error.response?.data?.error || 'Error eliminando usuario');
        }
      }
    }
  };

  const handleToggleBlock = async (idSeguro, usuarioEmail) => {
    if (usuarioEmail === 'admin@gymconnect.com') {
      alert('No puedes bloquear al admin principal');
      return;
    }

    const validacion = validarIdRecibido(idSeguro);
    if (!validacion.valido) {
      alert(` Error de seguridad: ${validacion.error}`);
      return;
    }

    try {
      const usuario = usuarios.find(u => u.id === idSeguro);
      const accion = usuario?.isBlockedFlag ? 'desbloquear' : 'bloquear';
      
      if (window.confirm(`¿Estás seguro de ${accion} a este usuario?`)) {
        await adminAPI.toggleBloqueoUsuario(idSeguro);
        alert(`Usuario ${accion}do exitosamente`);
        loadUsuarios();
      }
    } catch (error) {
      alert(error.response?.data?.error || `Error ${accion} usuario`);
    }
  };

  const handleMostrarDescripcion = async (idSeguro) => {
    try {
      const validacion = validarIdRecibido(idSeguro);
      if (!validacion.valido) {
        alert(` Error de seguridad: ${validacion.error}`);
        return;
      }

      const resp = await adminAPI.obtenerDescripcionUsuario(idSeguro);
      setDescripcionData(resp.data);
      setShowDescripcion(true);
    } catch (error) {
      alert(error.response?.data?.error || 'Error obteniendo descripción');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '80px' }}>
      <Navbar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '2rem'
        }}>
          Panel de Administración 🔐
        </h1>

        {/* Banner de seguridad */}
        {erroresIds.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
            color: '#0a0a0a',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '2px solid #ff4444'
          }}>
            <strong>⚠️ Advertencia de Seguridad</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
              Se detectaron {erroresIds.length} ID(s) potencialmente alterados. 
              Esto podría indicar un intento de manipulación.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('solicitudes')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'solicitudes' ? '#00ff87' : '#161616',
              color: activeTab === 'solicitudes' ? '#0a0a0a' : '#a0a0a0',
              border: '1px solid #2a2a2a',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Solicitudes de Profesor
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'usuarios' ? '#00ff87' : '#161616',
              color: activeTab === 'usuarios' ? '#0a0a0a' : '#a0a0a0',
              border: '1px solid #2a2a2a',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Gestión de Usuarios
          </button>
          <button
            onClick={() => setActiveTab('verificacion')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'verificacion' ? '#00ff87' : '#161616',
              color: activeTab === 'verificacion' ? '#0a0a0a' : '#a0a0a0',
              border: '1px solid #2a2a2a',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔐 Verificar Usuarios
          </button>
        </div>

        {/* Contenido de Solicitudes */}
        {activeTab === 'solicitudes' && (
          <div>
            {loading ? (
              <p style={{ color: '#a0a0a0' }}>Cargando...</p>
            ) : solicitudes.length === 0 ? (
              <p style={{ color: '#a0a0a0' }}>No hay solicitudes pendientes</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {solicitudes.map((solicitud) => (
                  <div key={solicitud.id} style={{
                    background: solicitud._idValido ? '#161616' : 'rgba(255, 107, 107, 0.1)',
                    border: solicitud._idValido ? '1px solid #2a2a2a' : '2px solid #ff4444',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    position: 'relative'
                  }}>
                    {!solicitud._idValido && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: '#ff4444',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        ⚠️ ID ALTERADO
                      </div>
                    )}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ color: solicitud._idValido ? '#00ff87' : '#ff4444', margin: 0 }}>
                            {solicitud.nombre}
                          </h3>
                          <span style={{
                            fontSize: '0.7rem',
                            color: solicitud._idValido ? '#00ff87' : '#ff4444',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '0.25rem',
                            background: solicitud._idValido ? 'rgba(0, 255, 135, 0.1)' : 'rgba(255, 68, 68, 0.1)'
                          }}>
                            ID: {solicitud.id}
                          </span>
                        </div>
                        
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                          📧 {solicitud.email_personal}
                        </p>
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                          📱 {solicitud.telefono || 'No especificado'}
                        </p>
                        {solicitud.mensaje && (
                          <p style={{ color: '#ffffff', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                            "{solicitud.mensaje}"
                          </p>
                        )}
                        <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                          Estado: <strong>{solicitud.estado}</strong> | 
                          Fecha: {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                        </p>
                        
                        {!solicitud._idValido && (
                          <p style={{ color: '#ff4444', fontSize: '0.8rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                            ⚠️ {solicitud._idError}
                          </p>
                        )}
                      </div>
                      
                      {solicitud.estado === 'pendiente' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleAprobar(solicitud.id)}
                            disabled={!solicitud._idValido}
                            style={{
                              padding: '0.5rem 1rem',
                              background: solicitud._idValido ? '#00ff87' : '#666',
                              color: solicitud._idValido ? '#0a0a0a' : '#999',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: solicitud._idValido ? 'pointer' : 'not-allowed',
                              fontWeight: '600',
                              opacity: solicitud._idValido ? 1 : 0.6
                            }}
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleRechazar(solicitud.id)}
                            disabled={!solicitud._idValido}
                            style={{
                              padding: '0.5rem 1rem',
                              background: solicitud._idValido ? '#ff4444' : '#666',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: solicitud._idValido ? 'pointer' : 'not-allowed',
                              fontWeight: '600',
                              opacity: solicitud._idValido ? 1 : 0.6
                            }}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contenido de Usuarios */}
        {activeTab === 'usuarios' && (
          <div>
            {/* Buscador */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Buscar por nombre, o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '0.5rem',
                  color: '#ffffff'
                }}
              />
              <button
                onClick={handleBuscar}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#00ff87',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Buscar
              </button>
              <button
                onClick={loadUsuarios}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#161616',
                  color: '#a0a0a0',
                  border: '1px solid #2a2a2a',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Ver Todos
              </button>
            </div>

            {/* Tabla de usuarios */}
            {loading ? (
              <p style={{ color: '#a0a0a0' }}>Cargando...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#161616', borderBottom: '2px solid #00ff87' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>ID</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>Nombre</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>Rol</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>Teléfono</th>
                       <th style={{ padding: '1rem', textAlign: 'center', color: '#00ff87' }}>Estado Bloqueo</th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: '#00ff87' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario, index) => (
                      <tr 
                        key={usuario.id || `usuario-${index}`} 
                        style={{ 
                          borderBottom: '1px solid #2a2a2a',
                          background: usuario._idValido ? 'transparent' : 'rgba(255, 107, 107, 0.05)'
                        }}
                      >
                        <td style={{ padding: '1rem' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            color: usuario._idValido ? '#a0a0a0' : '#ff4444'
                          }}>
                            {usuario.id}
                            {!usuario._idValido && (
                              <span title={usuario._idError} style={{ 
                                color: '#ff4444', 
                                fontSize: '0.7rem',
                                cursor: 'help'
                              }}>
                                ⚠️
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#ffffff' }}>
                          {usuario.nombre}
                        </td>
                        <td style={{ padding: '1rem', color: '#a0a0a0' }}>{usuario.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={usuario.rol}
                            onChange={(e) => handleCambiarRol(usuario.id, e.target.value)}
                            disabled={usuario.email === 'admin@gymconnect.com' || !usuario._idValido}
                            style={{
                              padding: '0.5rem',
                              background: usuario._idValido ? '#0a0a0a' : '#2a2a2a',
                              border: usuario._idValido ? '1px solid #2a2a2a' : '1px solid #ff4444',
                              borderRadius: '0.25rem',
                              color: usuario._idValido ? '#ffffff' : '#ff4444',
                              cursor: (usuario.email === 'admin@gymconnect.com' || !usuario._idValido) ? 'not-allowed' : 'pointer',
                              opacity: (usuario.email === 'admin@gymconnect.com' || !usuario._idValido) ? 0.6 : 1
                            }}
                          >
                            <option value="cliente">Cliente</option>
                            <option value="profesor">Profesor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem', color: '#a0a0a0' }}>
                          {usuario.telefono || '-'}
                        </td>
                         <td style={{ padding: '1rem', textAlign: 'center' }}>
                           <span style={{
                             padding: '0.25rem 0.75rem',
                             borderRadius: '0.25rem',
                             fontSize: '0.85rem',
                             fontWeight: '600',
                             background: usuario.isBlockedFlag ? 'rgba(255, 68, 68, 0.2)' : 'rgba(0, 255, 135, 0.2)',
                             color: usuario.isBlockedFlag ? '#ff4444' : '#00ff87'
                           }}>
                             {usuario.isBlockedFlag ? '🔒 Bloqueado' : '✓ Activo'}
                           </span>
                         </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                           <button
                             onClick={() => handleToggleBlock(usuario.id, usuario.email)}
                             disabled={usuario.email === 'admin@gymconnect.com' || !usuario._idValido}
                             style={{
                               padding: '0.5rem 1rem',
                               background: usuario.email === 'admin@gymconnect.com' || !usuario._idValido
                                 ? '#666'
                                 : usuario.isBlockedFlag
                                 ? '#00ff87'
                                 : '#ff4444',
                               color: usuario.email === 'admin@gymconnect.com' || !usuario._idValido
                                 ? '#999'
                                 : '#0a0a0a',
                               border: 'none',
                               borderRadius: '0.25rem',
                               cursor: (usuario.email === 'admin@gymconnect.com' || !usuario._idValido) ? 'not-allowed' : 'pointer',
                               fontSize: '0.85rem',
                               fontWeight: '600',
                               marginRight: '0.5rem',
                               opacity: (usuario.email === 'admin@gymconnect.com' || !usuario._idValido) ? 0.6 : 1
                             }}
                           >
                             {usuario.isBlockedFlag ? 'Desbloquear' : 'Bloquear'}
                           </button>
                          <button
                            onClick={() => handleMostrarDescripcion(usuario.id)}
                            disabled={!usuario._idValido}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#161616',
                              color: '#a0a0a0',
                              border: '1px solid #2a2a2a',
                              borderRadius: '0.25rem',
                              cursor: usuario._idValido ? 'pointer' : 'not-allowed',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}
                          >
                            Descripción
                          </button>
                          {usuario.rol !== 'admin' && (
                            <button
                              onClick={() => handleEliminar(usuario.id)}
                              disabled={!usuario._idValido}
                              style={{
                                padding: '0.5rem 1rem',
                                background: usuario._idValido ? '#ff4444' : '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: usuario._idValido ? 'pointer' : 'not-allowed',
                                fontSize: '0.85rem',
                                opacity: usuario._idValido ? 1 : 0.6
                              }}
                            >
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal simple para mostrar descripción del usuario */}
      {showDescripcion && descripcionData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '90%', maxWidth: '900px', background: '#0f0f0f', padding: '1.5rem', borderRadius: '0.5rem', color: '#fff', maxHeight: '80vh', overflow: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>{descripcionData.usuario.nombre} — Descripción</h2>
            <p style={{ color: '#a0a0a0' }}>Email: {descripcionData.usuario.email} | Rol: {descripcionData.usuario.rol}</p>

            <section style={{ marginTop: '1rem' }}>
              <h3>Compras</h3>
              {descripcionData.compras && descripcionData.compras.length > 0 ? (
                descripcionData.compras.map(orden => (
                  <div key={orden.id} style={{ border: '1px solid #222', padding: '0.75rem', borderRadius: '0.35rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>Orden #{orden.id} — Fecha: {new Date(orden.createdAt).toLocaleString()}</div>
                      <div>Total: ${orden.total || orden.totalAmount || '—'}</div>
                    </div>
                    <ul>
                      {orden.items && orden.items.map(item => (
                        <li key={item.id} style={{ color: '#a0a0a0' }}>{item.product ? item.product.nombre : item.product_id} — Cant: {item.cantidad || item.quantity || 1}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p style={{ color: '#a0a0a0' }}>Sin compras registradas</p>
              )}
            </section>

            <section style={{ marginTop: '1rem' }}>
              <h3>Clases Inscritas</h3>
              {descripcionData.inscripciones && descripcionData.inscripciones.length > 0 ? (
                descripcionData.inscripciones.map(ins => (
                  <div key={ins.id} style={{ border: '1px solid #222', padding: '0.75rem', borderRadius: '0.35rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '600' }}>{ins.clase ? ins.clase.nombre : `Clase ${ins.class_id}`}</div>
                    <div style={{ color: '#a0a0a0' }}>{ins.clase?.descripcion || ''} — Fecha: {ins.clase?.fecha ? new Date(ins.clase.fecha).toLocaleString() : '—'}</div>
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>Inscripción: {new Date(ins.createdAt).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#a0a0a0' }}>Sin inscripciones</p>
              )}
            </section>

            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button onClick={() => { setShowDescripcion(false); setDescripcionData(null); }} style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', background: '#00ff87', color: '#0a0a0a', border: 'none', fontWeight: '600' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de Verificación */}
      {activeTab === 'verificacion' && (
        <div style={{ background: '#1a1a1a', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <UserVerification />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;