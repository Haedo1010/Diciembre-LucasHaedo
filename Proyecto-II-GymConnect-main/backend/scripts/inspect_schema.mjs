import sequelize from '../src/config/initbd.js';

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD (inspect_schema)');

    const [fk] = await sequelize.query("PRAGMA foreign_key_list('role_permisos');");
    console.log('foreign_key_list role_permisos:', fk);

    const [info] = await sequelize.query("PRAGMA table_info('role_permisos');");
    console.log('table_info role_permisos:', info);

    process.exit(0);
  } catch (err) {
    console.error('Error inspeccionando esquema:', err);
    process.exit(1);
  }
};

main();
