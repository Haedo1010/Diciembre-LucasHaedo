import express from 'express';
import denyAdmin from '../middlewares/denyAdmin.js';
import Class from '../models/Class.js';
import Enrollment from '../models/Enrollment.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkPermiso } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

// Obtener todas las clases
// Evitar que usuarios con rol 'admin' accedan a rutas de clases
router.use(denyAdmin);

router.get('/', async (req, res) => {
  try {
    const clases = await Class.findAll();
    res.json(clases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener las clases que dirige el profesor autenticado
router.get('/profesor/mis-clases', verifyToken, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;

    // Obtener todas las clases que dirige este usuario
    const clases = await Class.findAll({
      where: { profesor_id: usuarioId },
      include: [
        {
          model: Enrollment,
          attributes: ['id', 'user_id'],
          required: false
        }
      ]
    });

    // Enriquecer con información de conteo de alumnos
    const clasesConAlumnos = clases.map((clase) => {
      const totalAlumnos = clase.Enrollments ? clase.Enrollments.length : 0;
      const capacidad = clase.disponibles || 20;
      const espaciosLibres = capacidad - totalAlumnos;

      return {
        ...clase.toJSON(),
        totalAlumnos,
        capacidad,
        espaciosLibres,
        porcentajeOcupado: Math.round((totalAlumnos / capacidad) * 100)
      };
    });

    res.json(clasesConAlumnos);
  } catch (error) {
    console.error('Error obteniendo clases del profesor:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Obtener clase por ID
router.get('/:id', async (req, res) => {
  try {
    const clase = await Class.findByPk(req.params.id);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });
    res.json(clase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear clase (requiere permiso 'crear_clase')
router.post('/crear', verifyToken, checkPermiso('crear_clase'), async (req, res) => {
  try {
    const clase = await Class.create(req.body);
    res.status(201).json(clase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar clase
router.put('/:id', verifyToken, checkPermiso('editar_clase'), async (req, res) => {
  try {
    const clase = await Class.findByPk(req.params.id);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });
    
    await clase.update(req.body);
    res.json(clase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar clase
router.delete('/:id', verifyToken, checkPermiso('eliminar_clase'), async (req, res) => {
  try {
    const clase = await Class.findByPk(req.params.id);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });
    
    await clase.destroy();
    res.json({ mensaje: 'Clase eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;