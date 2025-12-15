import { DataTypes } from 'sequelize';
import sequelize from '../config/initbd.js';

// Tabla intermedia que vincula roles (por nombre) con permisos
const RolePermiso = sequelize.define('RolePermiso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permiso_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'role_permisos',
  timestamps: false
});

export default RolePermiso;