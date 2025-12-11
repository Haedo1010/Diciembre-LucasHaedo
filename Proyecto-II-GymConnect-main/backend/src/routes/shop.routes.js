import express from 'express';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

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

    // Verificar stock y calcular total
    let total = 0;
    const orderItems = [];
    const productosParaActualizar = [];

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