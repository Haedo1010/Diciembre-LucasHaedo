import sequelize from '../src/config/initbd.js';

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a BD');

    // Agregar columnas para verificación de email
    const columnas = [
      { nombre: 'emailVerified', sql: 'ALTER TABLE users ADD COLUMN emailVerified BOOLEAN DEFAULT 0;' },
      { nombre: 'verificationCode', sql: 'ALTER TABLE users ADD COLUMN verificationCode VARCHAR(6) DEFAULT NULL;' },
      { nombre: 'verificationCodeExpiresAt', sql: 'ALTER TABLE users ADD COLUMN verificationCodeExpiresAt DATETIME DEFAULT NULL;' }
    ];

    for (const col of columnas) {
      try {
        await sequelize.query(col.sql);
        console.log(`✅ Columna ${col.nombre} agregada`);
      } catch (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`✅ Columna ${col.nombre} ya existe`);
        } else {
          throw err;
        }
      }
    }

    console.log('✅ Todas las columnas de verificación agregadas');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

main();
