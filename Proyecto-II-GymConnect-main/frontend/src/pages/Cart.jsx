import React, { useState } from 'react';
import { shopAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';

export default function Cart() {
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('carrito')) || []);
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para comprar');
      navigate('/login');
      return;
    }
    if (!numeroTarjeta.trim()) {
    }
    alert('Ingresa numero de tarjeta');
    alert('Por favor, ingresa un número de tarjeta válido');
      return;
    }

    // Abrir modal de pago
    setShowPayment(true);
  };

  const handleSubmitPayment = async (paymentData) => {
    setLoading(true);
    try {
      const items = carrito.map(item => ({ 
        product_id: item.id, 
        cantidad: item.cantidad 
      }));


      const response = await shopAPI.crearOrden({ 
        items, 
        metodo_pago: paymentData.metodo_pago || metodoPago, 
        numero_tarjeta: paymentData.numero_tarjeta 
      });

      const ultimosDos = paymentData.numero_tarjeta.slice(-2);
      alert(`✅ ¡Pago exitoso!\nOrden: #${response.data.order_id}\nTarjeta: •••••••••••••${ultimosDos}`);
      
      localStorage.removeItem('carrito');
      setCarrito([]);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en compra:', error);
      throw new Error(error.response?.data?.error || 'Error en compra');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  if (carrito.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🛒 Carrito vacío</h2>
        <button onClick={() => navigate('/tienda')}>Ir a la tienda</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🛒 Carrito de Compras</h2>
      
      {carrito.map(item => (
        <div key={item.id} style={{ 
          border: '1px solid #ddd', 
          padding: '15px', 
          marginBottom: '10px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3>{item.nombre}</h3>
            <p>${item.precio} × {item.cantidad}</p>
          </div>
          <button 
            onClick={() => removeItem(item.id)}
            style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            ❌ Eliminar
          </button>
        </div>
      ))}

      <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Total: ${total.toLocaleString('es-AR')}</h3>
        
        <div style={{ marginTop: '20px' }}>
          <label>Método de Pago:</label>
          <select 
            value={metodoPago} 
            onChange={(e) => setMetodoPago(e.target.value)}
            style={{ marginLeft: '10px', padding: '8px' }}
          >
            <option value="tarjeta">Tarjeta</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Número de Tarjeta:</label>
          <input
            type="text"
            value={numeroTarjeta}
            onChange={(e) => setNumeroTarjeta(e.target.value)}
            placeholder="1234 5678 9012 3456"
            style={{ marginLeft: '10px', padding: '8px', width: '250px' }}
          />
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          style={{ 
            marginTop: '20px', 
            padding: '12px 30px', 
            background: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
        >
          {loading ? 'Procesando...' : '💳 Finalizar Compra'}
        </button>
      </div>

      <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} total={total} loading={loading} onSubmit={handleSubmitPayment} />
      </div>
  );
