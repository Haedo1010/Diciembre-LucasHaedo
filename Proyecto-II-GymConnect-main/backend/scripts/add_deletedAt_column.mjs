import sequelize from '../src/config/initbd.js';

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a BD');

    // Agregar columna deletedAt a tabla users si no existe
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN deletedAt DATETIME DEFAULT NULL;
    `);

    console.log('✅ Columna deletedAt agregada exitosamente');
    process.exit(0);
  } catch (err) {
    // Si la columna ya existe, no es un error
    if (err.message.includes('duplicate column name')) {
      console.log('✅ Columna deletedAt ya existe');
      process.exit(0);
    }
    console.error('Error:', err.message);
    process.exit(1);
  }
};

main();
