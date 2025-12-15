import express from 'express';
import denyAdmin from '../middlewares/denyAdmin.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { enviarComprobanteCompra } from '../config/email.js';

const router = express.Router();

// OBTENER PRODUCTOS DESDE LA BASE DE DATOS
router.get('/productos', async (req, res) => {
  try {
    const productos = await Product.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'precio', 'imagen', 'categoria', 'descripcion', 'stock']
    });
    res.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREAR ORDEN CON CONTROL DE STOCK
router.post('/ordenes', verifyToken, async (req, res) => {
  try {
    const { items, metodo_pago, numero_tarjeta } = req.body;
    const userId = req.usuario_id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Obtener datos del usuario
    const usuario = await User.findByPk(userId, { attributes: ['nombre', 'email'] });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar stock y calcular total
    let total = 0;
    const orderItems = [];
    const productosParaActualizar = [];
    const productosDetalles = [];

    for (const item of items) {
      const producto = await Product.findByPk(item.product_id);
      
      if (!producto) {
        return res.status(400).json({ error: `Producto ${item.product_id} no encontrado` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` 
        });
      }

      const subtotal = producto.precio * item.cantidad;
      total += subtotal;

      orderItems.push({
        product_id: item.product_id,
        cantidad: item.cantidad,
        precio: producto.precio
      });

      productosDetalles.push({
        nombre: producto.nombre,
        cantidad: item.cantidad,
        subtotal: subtotal
      });

      // Guardar productos para actualizar stock
      productosParaActualizar.push({
        producto,
        nuevaCantidad: producto.stock - item.cantidad
      });
    }

    // Crear orden
    const order = await Order.create({
      usuario_id: userId,
      total,
      estado: 'pagado',
      metodo_pago: metodo_pago || 'tarjeta',
      numero_tarjeta: numero_tarjeta || null
    });

    // Crear items de la orden
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        cantidad: item.cantidad,
        precio: item.precio
      });
    }

    // Actualizar stock de productos
    for (const { producto, nuevaCantidad } of productosParaActualizar) {
      await producto.update({ stock: nuevaCantidad });
    }

    // Enviar comprobante por email (no bloqueante)
    enviarComprobanteCompra({
      email: usuario.email,
      nombre: usuario.nombre,
      orderId: order.id,
      items: productosDetalles,
      total: total,
      metodoPago: metodo_pago || 'tarjeta',
      numeroTarjeta: numero_tarjeta
    }).then(result => {
      if (result.success) {
        console.log(` Comprobante enviado a ${usuario.email}`);
      } else {
        console.warn(` No se pudo enviar comprobante: ${result.error}`);
      }
    }).catch(emailError => {
      console.warn(` Error en envío de comprobante (no crítico): ${emailError.message}`);
    });

    res.status(201).json({ 
      message: 'Orden creada exitosamente',
      order_id: order.id,
      total: order.total
    });

  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({ error: error.message });
  }
});

// OBTENER MIS COMPRAS CON PRODUCTOS REALES
// Evitar que usuarios con rol 'admin' accedan a rutas de tienda
router.use(denyAdmin);

router.get('/mis-compras', verifyToken, async (req, res) => {
  try {
    const userId = req.usuario_id;
    
    const orders = await Order.findAll({
      where: { usuario_id: userId },
      include: [{ 
        model: OrderItem, 
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'nombre', 'precio', 'categoria']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error(' Error obteniendo compras:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;