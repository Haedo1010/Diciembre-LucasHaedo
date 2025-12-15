import sequelize from '../src/config/initbd.js';

const addProfesorIdColumn = async () => {
  try {
    console.log('🔄 Iniciando migración: agregando columna profesor_id a classes...\n');

    // Crear la columna profesor_id
    await sequelize.query(`
      ALTER TABLE classes 
      ADD COLUMN profesor_id INTEGER REFERENCES users(id)
    `);

    console.log('✅ Columna profesor_id agregada exitosamente\n');

    // Verificar que la columna existe
    const result = await sequelize.query(`
      PRAGMA table_info(classes)
    `);

    console.log('📋 Estructura actual de la tabla classes:');
    result[0].forEach(col => {
      console.log(`   - ${col.name} (${col.type})`);
    });

    console.log('\n✅ Migración completada exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    process.exit(1);
  }
};

addProfesorIdColumn();
