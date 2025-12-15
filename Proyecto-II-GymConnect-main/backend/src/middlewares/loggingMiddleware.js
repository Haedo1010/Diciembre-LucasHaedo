import LoggerService from '../utils/loggerService.js';

/**
 * Middleware para registrar todas las requests HTTP
 */
export const loggingMiddleware = (req, res, next) => {
  // Guardar información original de response
  const originalSend = res.send;

  // Capturar el body del request
  let body = '';
  if (req.body) {
    body = JSON.stringify(req.body);
  }

  // Obtener IP del cliente
  const ip = req.ip || req.connection.remoteAddress || 'unknown';

  // Obtener usuario del token (si existe)
  const usuario = req.user;

  // Interceptar response
  res.send = function (data) {
    // NO registrar logs verbosos de API_REQUEST para mantener limpia la terminal
    // Los logs se guardan en archivos pero no se muestran en consola
    // Solo registrar acciones de seguridad
    if (req.originalUrl.includes('/admin/') || req.originalUrl.includes('/profesor/')) {
      LoggerService.registrarAccesoUsuario(
        usuario?.id || 'anónimo',
        usuario?.email || 'no-autenticado',
        `${req.method} ${req.originalUrl}`,
        ip,
        { statusCode: res.statusCode }
      );
    }

    // Llamar al send original
    res.send = originalSend;
    return res.send(data);
  };

  next();
};

/**
 * Middleware para registrar errores
 */
export const errorLoggingMiddleware = (err, req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const usuario = req.user;

  LoggerService.registrarErrorSeguridad(
    'HTTP_ERROR',
    `${req.method} ${req.originalUrl}`,
    {
      mensaje: err.message,
      statusCode: err.statusCode || 500,
      stack: process.env.NODE_ENV === 'development' ? err.stack : 'No disponible',
      usuarioId: usuario?.id,
      ip
    }
  );

  next(err);
};

export default loggingMiddleware;
