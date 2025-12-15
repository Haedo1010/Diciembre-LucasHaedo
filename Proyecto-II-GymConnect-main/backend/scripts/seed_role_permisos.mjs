import sequelize from '../src/config/initbd.js';
import Role from '../src/models/Role.js';
import Permiso from '../src/models/Permiso.js';
import RolePermiso from '../src/models/RolePermiso.js';

const rolePermisosMap = {
  admin: ['ver_clases', 'crear_clase', 'editar_clase', 'eliminar_clase', 'comprar', 'gestionar_usuarios'],
  profesor: ['ver_clases', 'crear_clase', 'editar_clase'],
  cliente: ['ver_clases', 'comprar']
};

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a DB (seed_role_permisos)');

    // Cargar permisos en un map
    const permisos = await Permiso.findAll({ raw: true });
    const permisosMap = {};
    for (const p of permisos) permisosMap[p.clave] = p;

    for (const [roleName, claves] of Object.entries(rolePermisosMap)) {
      const role = await Role.findOne({ where: { nombre: roleName } });
      if (!role) {
        console.warn(`Role ${roleName} no encontrado, se salta`);
        continue;
      }

      for (const clave of claves) {
        const permiso = permisosMap[clave];
        if (!permiso) continue;
        try {
          await RolePermiso.findOrCreate({ where: { role_nombre: roleName, permiso_id: permiso.id }, defaults: { role_nombre: roleName, permiso_id: permiso.id } });
          console.log(`Asociado ${roleName} -> ${clave}`);
        } catch (err) {
          console.error(`Error asociando ${roleName} -> ${clave}:`, err.message || err);
        }
      }
    }

    console.log('Seed role_permisos completado');
    process.exit(0);
  } catch (err) {
    console.error('Error en seed_role_permisos:', err);
    process.exit(1);
  }
};

main();
