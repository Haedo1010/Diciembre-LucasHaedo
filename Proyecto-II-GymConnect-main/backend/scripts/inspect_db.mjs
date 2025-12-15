import sequelize from '../src/config/initbd.js';
import Role from '../src/models/Role.js';
import Permiso from '../src/models/Permiso.js';
import RolePermiso from '../src/models/RolePermiso.js';

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD (inspect_db)');

    const roles = await Role.findAll({ raw: true });
    console.log('Roles:', roles);

    const permisos = await Permiso.findAll({ raw: true });
    console.log('Permisos:', permisos);

    const rolePermisos = await RolePermiso.findAll({ raw: true });
    console.log('RolePermisos:', rolePermisos);

    process.exit(0);
  } catch (err) {
    console.error('Error inspeccionando DB:', err);
    process.exit(1);
  }
};

main();
