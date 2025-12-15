import { DataTypes } from 'sequelize';
import sequelize from '../config/initbd.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  metodo_pago: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  numero_tarjeta: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

export default Order;
