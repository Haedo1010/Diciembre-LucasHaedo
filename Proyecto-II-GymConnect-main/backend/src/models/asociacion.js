import User from './User.js';
import Role from './Role.js';
import Class from './Class.js';
import Enrollment from './Enrollment.js';
import ProfesorRequest from './ProfesorRequest.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Product from './Product.js';

// Asociaciones User - Role
User.belongsTo(Role, { foreignKey: 'rol', targetKey: 'nombre' });
Role.hasMany(User, { foreignKey: 'rol', sourceKey: 'nombre' });

// Asociaciones User - Enrollment
User.hasMany(Enrollment, { foreignKey: 'user_id' });
Enrollment.belongsTo(User, { foreignKey: 'user_id' });

// Asociaciones Class - Enrollment
Class.hasMany(Enrollment, { foreignKey: 'class_id' });
Enrollment.belongsTo(Class, { foreignKey: 'class_id', as: 'clase' });

// Asociaciones User - ProfesorRequest
User.hasMany(ProfesorRequest, { foreignKey: 'usuario_id' });
ProfesorRequest.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

// Asociaciones User - Order
User.hasMany(Order, { foreignKey: 'usuario_id' });
Order.belongsTo(User, { foreignKey: 'usuario_id' });

// Asociaciones Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Asociaciones Product - OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

console.log('✅ Asociaciones de modelos configuradas');


