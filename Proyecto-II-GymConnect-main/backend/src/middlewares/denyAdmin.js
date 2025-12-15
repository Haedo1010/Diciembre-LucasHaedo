export default function denyAdmin(req, res, next) {
  try {
    // Si no hay usuario en la request, continuar (público o no autenticado)
    if (!req.user) return next();

    // Si el usuario es admin, bloquear
    if (req.user.rol === 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: los administradores sólo pueden acceder a su perfil y al panel de admin' });
    }

    return next();
  } catch (error) {
    console.error('Error en denyAdmin middleware:', error);
    return res.status(500).json({ error: 'Error interno en middleware' });
  }
}
