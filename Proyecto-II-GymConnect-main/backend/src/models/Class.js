import { DataTypes } from 'sequelize';
import sequelize from '../config/initbd.js';

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  disponibles: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  profesor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'classes',
  timestamps: true
});

export default Class;