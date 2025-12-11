import axios from 'axios';
import { generarIdSeguro, validarIdRecibido, convertirObjetoConIdsSeguros, validarIdsEnArray } from '../utils/idSeguro';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== INTERCEPTOR PARA IDs SEGUROS ====================
// Interceptor de request: Convertir IDs normales a seguros antes de enviar
api.interceptors.request.use((config) => {
  // Solo procesar para ciertos métodos y endpoints
  const metodosQueContienenIds = ['post', 'put', 'delete', 'patch'];
  const endpointsAdmin = ['/admin/', '/profesor/'];
  
  const esEndpointConIdSeguro = endpointsAdmin.some(endpoint => 
    config.url.includes(endpoint)
  );
  
  if (metodosQueContienenIds.includes(config.method) && esEndpointConIdSeguro) {
    // Para DELETE con ID en la URL (ej: /admin/usuarios/123)
    if (config.method === 'delete' || config.method === 'put' || config.method === 'patch') {
      const match = config.url.match(/\/(\d+)$/);
      if (match) {
        const idNumerico = match[1];
        const idSeguro = generarIdSeguro(idNumerico);
        config.url = config.url.replace(/\/(\d+)$/, `/${idSeguro}`);
        console.log(`🔐 Request: Convertido ID ${idNumerico} → ${idSeguro} en ${config.url}`);
      }
    }
    
    // Para POST/PUT con data que contiene IDs
    if (config.data) {
      const camposId = ['id', 'usuarioId', 'userId', 'solicitudId', 'profesorId'];
      config.data = convertirObjetoConIdsSeguros(config.data, camposId);
    }
    
    // Para GET con params que contienen IDs
    if (config.params) {
      const camposId = ['id', 'usuarioId', 'userId'];
      Object.keys(config.params).forEach(key => {
        if (camposId.includes(key) && config.params[key]) {
          config.params[key] = generarIdSeguro(config.params[key]);
        }
      });
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de response: Validar IDs seguros recibidos
api.interceptors.response.use((response) => {
  // Solo validar para endpoints de admin
  if (response.config.url.includes('/admin/') || response.config.url.includes('/profesor/')) {
    const endpointsConIds = ['/usuarios', '/solicitudes', '/aprobar-profesor', '/rechazar-profesor'];
    const esEndpointConIds = endpointsConIds.some(endpoint => 
      response.config.url.includes(endpoint)
    );
    
    if (esEndpointConIds && response.data) {
      // Si es un array de objetos (ej: lista de usuarios/solicitudes)
      if (Array.isArray(response.data)) {
        const arrayValidado = validarIdsEnArray(response.data);
        const tieneIdsInvalidos = arrayValidado.some(item => !item._idsValidos);
        
        if (tieneIdsInvalidos) {
          console.warn(' Se recibieron IDs potencialmente alterados del servidor');
          // Podríamos mostrar una notificación al usuario aquí
        }
        
        // Reemplazar data con versión validada (opcional)
        // response.data = arrayValidado;
      }
      
      // Si es un solo objeto con ID
      else if (response.data.id && typeof response.data.id === 'string') {
        const validacion = validarIdRecibido(response.data.id);
        if (!validacion.valido) {
          console.warn(' ID alterado recibido del servidor:', response.data.id, validacion.error);
        }
      }
    }
  }
  
  return response;
}, (error) => {
  // Manejar errores específicos de validación de IDs
  if (error.response?.status === 400) {
    const mensajeError = error.response.data?.error || '';
    if (mensajeError.includes('ID alterado') || mensajeError.includes('dígito verificador')) {
      console.error(' Error de seguridad: ID potencialmente alterado:', mensajeError);
      // Podríamos mostrar un mensaje específico al usuario aquí
    }
  }
  return Promise.reject(error);
});


// ========================================
//  AUTH 
// ========================================
export const authAPI = {
  iniciarSesion: (datos) => api.post('/auth/login', datos),
  registrarse: (datos) => api.post('/auth/register', datos),
  validarToken: () => api.get('/auth/validar-token'),
  cerrarSesion: () => api.post('/auth/logout')
};

// ========================================
//  CLASES
// ========================================
export const clasesAPI = {
  obtenerTodas: () => api.get('/clases'),
  obtenerPorId: (id) => api.get(`/clases/${id}`),
  crear: (datos) => api.post('/clases/crear', datos),
  actualizar: (id, datos) => api.put(`/clases/${id}`, datos),
  eliminar: (id) => api.delete(`/clases/${id}`)
};

// ========================================
//  INSCRIPCIONES
// ========================================
export const inscripcionesAPI = {
  getMyClasses: () => api.get('/inscripciones/mis-clases'),
  inscribirse: (classId) => api.post('/inscripciones/inscribirse', { 
    class_id: classId
  }),
  cancelar: (enrollmentId) => api.post('/inscripciones/cancelar', { 
    enrollment_id: enrollmentId 
  })
};

// ========================================
//  TIENDA
// ========================================
export const tiendaAPI = {
  obtenerProductos: () => api.get('/shop/productos'),
  crearOrden: (datos) => api.post('/shop/ordenes', datos),
  obtenerMisCompras: () => api.get('/shop/mis-compras'), // ← NUEVA RUTA
  obtenerOrdenes: () => api.get('/shop/ordenes')
};
// ========================================
//  PROFESOR
// ========================================
export const profesorAPI = {
  solicitar: (datos) => api.post('/profesor/solicitar', datos)
};

// ========================================
//  ADMIN
// ========================================
export const adminAPI = {
  obtenerSolicitudes: () => api.get('/admin/solicitudes-profesor'),
  aprobarProfesor: (solicitudId) => api.post(`/admin/aprobar-profesor/${solicitudId}`),
  rechazarProfesor: (solicitudId) => api.post(`/admin/rechazar-profesor/${solicitudId}`),
  obtenerUsuarios: () => api.get('/admin/usuarios'),
  actualizarUsuario: (usuarioId, datos) => api.put(`/admin/usuario/${usuarioId}`, datos)
};

// Aliases para compatibilidad con código anterior
export const enrollmentAPI = inscripcionesAPI;
export const shopAPI = tiendaAPI;

export default api;