import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      console.log(' Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      {
        usuario_id: user.id,
        email: user.email,
        rol: user.rol
      },
      SECRET_KEY,
      { expiresIn: '24h' }
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

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      telefono,
      rol: 'cliente'
    });

    // Generar token
    const token = jwt.sign(
      {
        usuario_id: user.id,
        email: user.email,
        rol: user.rol
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      usuario: { 
        id: user.id, 
        nombre: user.nombre, 
        email: user.email, 
        rol: user.rol 
      }
    });
  } catch (error) {
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
      attributes: ['id', 'nombre', 'email', 'rol', 'telefono']
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
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
    console.error(' Error validando token:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada' });
});

export default router;