import sequelize from '../src/config/initbd.js';
import { QueryTypes } from 'sequelize';

async function addVerificationLockColumns() {
  try {
    console.log('Iniciando migración: agregar columnas de bloqueo de verificación...');

    // Intentar agregar verificationAttempts
    try {
      await sequelize.query(
        'ALTER TABLE users ADD COLUMN verificationAttempts INTEGER DEFAULT 0'
      );
      console.log('✓ Columna verificationAttempts agregada');
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        console.log('✓ Columna verificationAttempts ya existe');
      } else {
        throw err;
      }
    }

    // Intentar agregar verificationLockedUntil
    try {
      await sequelize.query(
        'ALTER TABLE users ADD COLUMN verificationLockedUntil DATETIME'
      );
      console.log('✓ Columna verificationLockedUntil agregada');
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        console.log('✓ Columna verificationLockedUntil ya existe');
      } else {
        throw err;
      }
    }

    console.log('✓ Migración completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error en migración:', error.message);
    process.exit(1);
  }
}

addVerificationLockColumns();
