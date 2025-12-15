import sequelize from '../src/config/initbd.js';
import { QueryTypes } from 'sequelize';

async function addLoginLockColumns() {
  try {
    console.log('Iniciando migración: agregar columnas de bloqueo de login...');

    // Intentar agregar loginAttempts
    try {
      await sequelize.query(
        'ALTER TABLE users ADD COLUMN loginAttempts INTEGER DEFAULT 0'
      );
      console.log('✓ Columna loginAttempts agregada');
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        console.log('✓ Columna loginAttempts ya existe');
      } else {
        throw err;
      }
    }

    // Intentar agregar loginLockedUntil
    try {
      await sequelize.query(
        'ALTER TABLE users ADD COLUMN loginLockedUntil DATETIME'
      );
      console.log('✓ Columna loginLockedUntil agregada');
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        console.log('✓ Columna loginLockedUntil ya existe');
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

addLoginLockColumns();
