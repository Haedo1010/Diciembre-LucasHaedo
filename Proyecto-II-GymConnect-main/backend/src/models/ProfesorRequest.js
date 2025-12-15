import { DataTypes } from 'sequelize';
import sequelize from '../config/initbd.js';

const ProfesorRequest = sequelize.define('ProfesorRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email_personal: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'profesor_requests',
  timestamps: true
});

export default ProfesorRequest;