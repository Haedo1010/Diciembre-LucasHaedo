import { DataTypes } from 'sequelize';
import sequelize from '../config/initbd.js';

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'inscrito'
  },
  fecha_inscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'enrollments',
  timestamps: true
});

export default Enrollment;
