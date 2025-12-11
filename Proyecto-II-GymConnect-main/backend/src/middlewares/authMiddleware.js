import jwt from 'jsonwebtoken';
import { generarIdSeguro } from './seguridadMiddleware.js';

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala_en_produccion';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario_id = decoded.usuario_id || decoded.id;
    req.usuario_id_seguro = generarIdSeguro(req.usuario_id);
    req.usuario_email = decoded.email;
    req.usuario_rol = decoded.rol;

    next();
  } catch (error) {
    console.error(' Error verificando token:', error.message);
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export const optionalToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.usuario_id = decoded.usuario_id || decoded.id;
      req.usuario_id_seguro = generarIdSeguro(req.usuario_id);
      req.usuario_email = decoded.email;
      req.usuario_rol = decoded.rol;
    }
    next();
  } catch (error) {
    next();
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.usuario_rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo admins' });
  }
  next();
};

export const verifyProfesor = (req, res, next) => {
  if (req.usuario_rol !== 'profesor') {
    return res.status(403).json({ error: 'Acceso denegado: solo profesores' });
  }
  next();
};