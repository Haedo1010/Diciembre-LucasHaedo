import Permiso from '../models/Permiso.js';
import RolePermiso from '../models/RolePermiso.js';

/**
 * Middleware factory: checkPermiso('clave')
 * Requiere que `verifyToken` haya poblado `req.usuario_rol`.
 */
export const checkPermiso = (clave) => {
  return async (req, res, next) => {
    try {
      const roleNombre = req.usuario_rol;
      if (!roleNombre) {
        return res.status(401).json({ error: 'Token requerido' });
      }

      // Admin tiene acceso total
      if (roleNombre === 'admin') return next();

      const permiso = await Permiso.findOne({ where: { clave } });
      if (!permiso) {
        return res.status(403).json({ error: 'Permiso no definido' });
      }

      const tiene = await RolePermiso.findOne({ where: { role_nombre: roleNombre, permiso_id: permiso.id } });
      if (!tiene) {
        return res.status(403).json({ error: 'Acceso denegado: permiso requerido' });
      }

      next();
    } catch (error) {
      console.error('Error en checkPermiso:', error);
      res.status(500).json({ error: 'Error interno verificando permiso' });
    }
  };
};

export default checkPermiso;
