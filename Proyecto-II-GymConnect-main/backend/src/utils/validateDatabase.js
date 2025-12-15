import sequelize from '../config/initbd.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Class from '../models/Class.js';
import Product from '../models/Product.js';
import Enrollment from '../models/Enrollment.js';
import RolePermiso from '../models/RolePermiso.js';
import Permiso from '../models/Permiso.js';

class DatabaseValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log('\n🔍 Iniciando validación de base de datos...\n');
    
    try {
      // Verificar conexión
      await this.validateConnection();
      
      // Validar estructura de tablas
      await this.validateTableStructure();
      
      // Validar integridad de datos
      await this.validateDataIntegrity();
      
      // Validar relaciones
      await this.validateRelationships();
      
      // Generar reporte
      return this.generateReport();
    } catch (error) {
      console.error('\n❌ Error crítico en validación:', error.message);
      throw error;
    }
  }

  async validateConnection() {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión a BD validada');
    } catch (error) {
      this.errors.push(`Error de conexión: ${error.message}`);
      throw new Error('No se pudo conectar a la BD');
    }
  }

  async validateTableStructure() {
    console.log('\n📋 Validando estructura de tablas...');
    
    const models = [
      { name: 'users', model: User },
      { name: 'roles', model: Role },
      { name: 'classes', model: Class },
      { name: 'products', model: Product },
      { name: 'enrollments', model: Enrollment },
      { name: 'permisos', model: Permiso },
      { name: 'rolepermisos', model: RolePermiso }
    ];

    for (const { name, model } of models) {
      try {
        const table = await sequelize.getQueryInterface().showAllTables();
        const tableName = model.tableName || name;
        
        if (table.includes(tableName)) {
          console.log(`  ✅ Tabla '${tableName}' existe`);
        } else {
          this.errors.push(`Tabla '${tableName}' no existe`);
        }
      } catch (error) {
        this.errors.push(`Error validando tabla '${name}': ${error.message}`);
      }
    }
  }

  async validateDataIntegrity() {
    console.log('\n🔐 Validando integridad de datos...');
    
    try {
      // Validar que no haya usuarios sin rol
      const usersWithoutRole = await User.findAll({
        where: { rol: null },
        raw: true
      });
      
      if (usersWithoutRole.length > 0) {
        this.warnings.push(`⚠️  ${usersWithoutRole.length} usuario(s) sin rol asignado`);
      } else {
        console.log('  ✅ Todos los usuarios tienen rol');
      }

      // Validar que no haya usuarios con rol inexistente
      const allUsers = await User.findAll({ raw: true });
      const validRoles = await Role.findAll({ attributes: ['nombre'], raw: true });
      const validRoleNames = validRoles.map(r => r.nombre);

      const invalidRoleUsers = allUsers.filter(u => u.rol && !validRoleNames.includes(u.rol));
      if (invalidRoleUsers.length > 0) {
        this.errors.push(`❌ ${invalidRoleUsers.length} usuario(s) tienen rol inválido`);
        invalidRoleUsers.forEach(u => {
          this.errors.push(`   - Usuario ID ${u.id}: rol '${u.rol}'`);
        });
      } else {
        console.log('  ✅ Todos los roles de usuarios son válidos');
      }

      // Validar productos
      const productsWithoutPrice = await Product.findAll({
        where: { precio: null },
        raw: true
      });
      if (productsWithoutPrice.length > 0) {
        this.warnings.push(`⚠️  ${productsWithoutPrice.length} producto(s) sin precio`);
      } else {
        console.log('  ✅ Todos los productos tienen precio');
      }

      // Validar clases
      const classesWithoutName = await Class.findAll({
        where: { nombre: null },
        raw: true
      });
      if (classesWithoutName.length > 0) {
        this.errors.push(`❌ ${classesWithoutName.length} clase(s) sin nombre`);
      } else {
        console.log('  ✅ Todas las clases tienen nombre');
      }

    } catch (error) {
      this.errors.push(`Error en validación de integridad: ${error.message}`);
    }
  }

  async validateRelationships() {
    console.log('\n🔗 Validando relaciones...');
    
    try {
      // Validar inscripciones con usuarios inexistentes
      const enrollmentsWithoutUser = await Enrollment.findAll({
        where: { user_id: null },
        raw: true
      });
      if (enrollmentsWithoutUser.length > 0) {
        this.warnings.push(`⚠️  ${enrollmentsWithoutUser.length} inscripción(es) sin usuario`);
      } else {
        console.log('  ✅ Todas las inscripciones tienen usuario');
      }

      // Validar inscripciones con clases inexistentes
      const enrollmentsWithoutClass = await Enrollment.findAll({
        where: { class_id: null },
        raw: true
      });
      if (enrollmentsWithoutClass.length > 0) {
        this.warnings.push(`⚠️  ${enrollmentsWithoutClass.length} inscripción(es) sin clase`);
      } else {
        console.log('  ✅ Todas las inscripciones tienen clase asociada');
      }

      // Validar RolePermisos
      const rolePermisos = await RolePermiso.findAll({ raw: true });
      if (rolePermisos.length === 0) {
        this.warnings.push('⚠️  No hay permisos asignados a roles');
      } else {
        console.log(`  ✅ ${rolePermisos.length} relación(es) role-permiso`);
      }

    } catch (error) {
      this.errors.push(`Error en validación de relaciones: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(50));
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ BASE DE DATOS VALIDADA CORRECTAMENTE');
      console.log('='.repeat(50) + '\n');
      return true;
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  ADVERTENCIAS:');
      this.warnings.forEach(w => console.log(`   ${w}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORES ENCONTRADOS:');
      this.errors.forEach(e => console.log(`   ${e}`));
      console.log('\n='.repeat(50));
      console.log('No se puede iniciar el servidor con errores en la BD');
      console.log('='.repeat(50) + '\n');
      return false;
    }

    console.log('='.repeat(50) + '\n');
    return true;
  }
}

export const validateDatabase = async () => {
  const validator = new DatabaseValidator();
  const isValid = await validator.validate();
  
  if (!isValid) {
    process.exit(1);
  }
  
  return isValid;
};
