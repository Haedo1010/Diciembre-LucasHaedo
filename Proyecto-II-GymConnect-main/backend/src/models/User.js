import { DataTypes } from 'sequelize';
import sequelize from '../config/initbd.js';
import { createEncryptionHooks } from '../utils/encryptionHooks.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rol: {
    type: DataTypes.STRING,
    defaultValue: 'cliente'
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  verificationCodeExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  verificationAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  verificationLockedUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  loginLockedUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  blockedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  blockReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: false  // Desactivamos paranoid para manejarlo manualmente
});

// Aplicar hooks de encriptación reversible a campos sensibles
// El email y verificationCode se encriptarán/desencriptarán automáticamente
createEncryptionHooks(User, ['email', 'verificationCode', 'telefono']);

export default User;
