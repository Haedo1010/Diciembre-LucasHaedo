import express from 'express';
import cors from 'cors';
import sequelize from './config/initbd.js';
import authRoutes from './routes/auth.routes.js';
import classRoutes from './routes/class.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import profesorRoutes from './routes/profesor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import shopRoutes from './routes/shop.routes.js';
import './models/asociacion.js';

const app = express();

app.use(cors());
app.use(express.json());

// Sincronizar BD
(async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log(' BD sincronizada');
  } catch (error) {
    console.error(' Error sincronizando BD:', error.message);
  }
})();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clases', classRoutes);
app.use('/api/inscripciones', enrollmentRoutes);
app.use('/api/profesor', profesorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);

console.log(' Rutas de inscripciones montadas:');
console.log('   POST /api/inscripciones');
console.log('   POST /api/inscripciones/inscribirse'); 
console.log('   GET /api/inscripciones/mis-clases');
console.log('   POST /api/inscripciones/cancelar');
console.log('   GET /api/inscripciones/test');

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
