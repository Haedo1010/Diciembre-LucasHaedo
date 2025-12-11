import express from 'express';
import Class from '../models/Class.js';

const router = express.Router();

// Obtener todas las clases
router.get('/', async (req, res) => {
  try {
    const clases = await Class.findAll();
    res.json(clases);
  } catch (error) {
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

// Crear clase
router.post('/crear', async (req, res) => {
  try {
    const clase = await Class.create(req.body);
    res.status(201).json(clase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar clase
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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