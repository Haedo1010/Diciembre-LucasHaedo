import sequelize from '../src/config/initbd.js';

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD (fix_role_permisos)');

    // Eliminar tabla existente y crearla con el esquema correcto
    await sequelize.query('DROP TABLE IF EXISTS role_permisos;');

    await sequelize.query(`CREATE TABLE role_permisos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_nombre TEXT NOT NULL,
      permiso_id INTEGER NOT NULL,
      FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (role_nombre) REFERENCES roles(nombre) ON DELETE CASCADE ON UPDATE CASCADE
    );`);

    console.log('Tabla role_permisos recreada correctamente');
    process.exit(0);
  } catch (err) {
    console.error('Error recreando role_permisos:', err);
    process.exit(1);
  }
};

main();
