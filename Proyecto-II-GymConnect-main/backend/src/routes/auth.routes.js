import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { enviarCodigoVerificacion } from '../config/email.js';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala_en_produccion';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(' Usuario no encontrado:', email);
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar si el usuario fue bloqueado por un administrador
    if (user.isBlocked) {
      return res.status(403).json({ error: 'Cuenta bloqueada por administrador' });
    }

    // Verificar si la cuenta está bloqueada por intentos fallidos de login
    if (user.loginLockedUntil && new Date() < user.loginLockedUntil) {
      const horasRestantes = Math.ceil((user.loginLockedUntil - new Date()) / (1000 * 60 * 60));
      return res.status(429).json({ 
        error: `Cuenta bloqueada por seguridad. Intenta nuevamente en ${horasRestantes} hora(s)` 
      });
    }

    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      console.log(' Contraseña incorrecta');
      
      // Incrementar contador de intentos fallidos
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      // Si supera 3 intentos, bloquear por 24 horas
      if (user.loginAttempts >= 3) {
        user.loginLockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();
        return res.status(429).json({ 
          error: 'Demasiados intentos de login fallidos. Cuenta bloqueada por 24 horas por seguridad' 
        });
      }

      await user.save();
      return res.status(401).json({ 
        error: 'Credenciales incorrectas',
        intentosRestantes: 3 - user.loginAttempts
      });
    }

    // Contraseña correcta: reiniciar intentos
    user.loginAttempts = 0;
    user.loginLockedUntil = null;
    await user.save();

    const token = jwt.sign(
      {
        usuario_id: user.id,
        email: user.email,
        rol: user.rol
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    );


    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error(' Error en login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Solicitar código de verificación
router.post('/request-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    // Generar código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Verificar si el email ya está registrado
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      // Si ya está verificado, es conflicto
      if (usuarioExistente.emailVerified) {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }

      // Si existe pero NO está verificado, reescribimos el código y re-enviamos
      try {
        await enviarCodigoVerificacion({
          email,
          codigo: verificationCode
        });
      } catch (emailError) {
        console.error(' Error enviando email:', emailError.message);
        return res.status(500).json({ error: 'Error enviando email de verificación' });
      }

      usuarioExistente.verificationCode = verificationCode;
      usuarioExistente.verificationCodeExpiresAt = expiresAt;
      await usuarioExistente.save();

      return res.json({
        success: true,
        message: 'Código de verificación reenviado al email',
        email,
        usuarioId: usuarioExistente.id
      });
    }

    // No existe: crear usuario temporal y enviar código
    try {
      await enviarCodigoVerificacion({
        email,
        codigo: verificationCode
      });
    } catch (emailError) {
      console.error(' Error enviando email:', emailError.message);
      return res.status(500).json({ error: 'Error enviando email de verificación' });
    }

    const usuarioTemporal = await User.create({
      email,
      nombre: 'temporal',
      password: 'temporal',
      verificationCode,
      verificationCodeExpiresAt: expiresAt,
      emailVerified: false,
      rol: 'cliente'
    });

    res.json({
      success: true,
      message: 'Código de verificación enviado al email',
      email,
      usuarioId: usuarioTemporal.id
    });
  } catch (error) {
    console.error(' Error en request-verification:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar código y completar registro
router.post('/verify-and-register', async (req, res) => {
  try {
    const { email, verificationCode, nombre, password, telefono } = req.body;

    if (!email || !verificationCode || !nombre || !password) {
      return res.status(400).json({ error: 'Campos requeridos: email, codigo, nombre, contraseña' });
    }

    // Buscar usuario temporal
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado. Solicita nuevo código' });
    }

    // Verificar si la cuenta está bloqueada por intentos fallidos
    if (user.verificationLockedUntil && new Date() < user.verificationLockedUntil) {
      const horasRestantes = Math.ceil((user.verificationLockedUntil - new Date()) / (1000 * 60 * 60));
      return res.status(429).json({ 
        error: `Cuenta bloqueada por seguridad. Intenta nuevamente en ${horasRestantes} hora(s)` 
      });
    }

    // Verificar código
    if (user.verificationCode !== verificationCode) {
      // Incrementar contador de intentos fallidos
      user.verificationAttempts = (user.verificationAttempts || 0) + 1;

      // Si supera 3 intentos, bloquear por 24 horas
      if (user.verificationAttempts >= 3) {
        user.verificationLockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();
        return res.status(429).json({ 
          error: 'Demasiados intentos fallidos. Cuenta bloqueada por 24 horas por seguridad' 
        });
      }

      await user.save();
      return res.status(400).json({ 
        error: 'Código de verificación incorrecto',
        intentosRestantes: 3 - user.verificationAttempts
      });
    }

    // Código correcto: reiniciar intentos
    user.verificationAttempts = 0;
    user.verificationLockedUntil = null;

    // Verificar que no haya expirado (15 minutos)
    if (new Date() > user.verificationCodeExpiresAt) {
      return res.status(400).json({ error: 'Código expirado. Solicita uno nuevo' });
    }

    // Actualizar usuario con datos finales
    const hashedPassword = await bcrypt.hash(password, 10);
    user.nombre = nombre;
    user.password = hashedPassword;
    user.telefono = telefono || null;
    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;

    await user.save();

    // Generar token
    const token = jwt.sign(
      {
        usuario_id: user.id,
        email: user.email,
        rol: user.rol
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error(' Error en verify-and-register:', error);
    res.status(500).json({ error: error.message });
  }
});

// Validar token
router.get('/validar-token', async(req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findByPk(decoded.usuario_id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'telefono', 'isBlocked']
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Rechazar si el administrador bloqueó al usuario
    if (user.isBlocked) {
      return res.status(403).json({ error: 'Cuenta bloqueada por administrador' });
    }


    res.json({ 
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono
      }
    });
  } catch (error) {
    // Manejar errores de JWT de forma más silenciosa
    if (error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
      console.warn(' Error validando token:', error.message);
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    console.error(' Error validando token:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada' });
});

export default router;