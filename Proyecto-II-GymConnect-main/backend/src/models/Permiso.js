import { DataTypes } from 'sequelize';
import sequelize from '../config/initbd.js';

const Permiso = sequelize.define('Permiso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clave: {
    type: DataTypes.STRING,
    allowNull: false
    ,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'permisos',
  timestamps: true
});

export default Permiso;