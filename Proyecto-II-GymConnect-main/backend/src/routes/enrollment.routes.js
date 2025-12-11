import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Class from '../models/Class.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  next();
});

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de inscripciones funcionando' });
});

// Obtener mis clases
router.get('/mis-clases', verifyToken, async (req, res) => {
  try {
    const userId = req.usuario_id;
    
    const enrollments = await Enrollment.findAll({
      where: { user_id: userId },
      include: [{
        model: Class,
        as: 'clase'
      }]
    });
    
    res.json(enrollments);
  } catch (error) {
    console.error(' Error obteniendo clases:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/inscribirse', verifyToken, async (req, res) => {
  try {
    
    const { class_id } = req.body;
    const userId = req.usuario_id;

    if (!class_id) {
      console.log(' class_id no recibido');
      return res.status(400).json({ error: 'class_id es requerido' });
    }

    const clase = await Class.findByPk(class_id);
    
    if (!clase) {
      console.log(' Clase no encontrada');
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    // Verificar si ya está inscrito
    const existing = await Enrollment.findOne({
      where: { user_id: userId, class_id }
    });

    if (existing) {
      console.log(' Ya inscrito en esta clase');
      return res.status(400).json({ error: 'Ya estás inscrito en esta clase' });
    }

    // Crear inscripción
    const enrollment = await Enrollment.create({
      user_id: userId,
      class_id,
      estado: 'inscrito',
      fecha_inscripcion: new Date()
    });

    
    res.status(201).json({
      message: 'Inscripción exitosa',
      enrollment: {
        id: enrollment.id,
        user_id: enrollment.user_id,
        class_id: enrollment.class_id,
        estado: enrollment.estado
      }
    });

  } catch (error) {
    console.error(' ERROR EN INSCRIPCIÓN:', error);
    res.status(500).json({ 
      error: 'Error al inscribirse: ' + error.message 
    });
  }
});

// Cancelar inscripción
router.post('/cancelar', verifyToken, async (req, res) => {
  try {
    const { enrollment_id } = req.body;
    const userId = req.usuario_id;

    const enrollment = await Enrollment.findOne({
      where: { id: enrollment_id, user_id: userId }
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    await enrollment.destroy();
    res.json({ message: 'Inscripción cancelada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;