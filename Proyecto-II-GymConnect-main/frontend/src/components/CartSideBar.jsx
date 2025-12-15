import { useState } from 'react';
import { tiendaAPI } from '../services/api';
import PaymentModal from './PaymentModal';

const CartSidebar = ({ isOpen, cart, onRemove, onClose, onCheckout }) => {
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.precio, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(' Debes iniciar sesión para comprar');
      return;
    }

    if (cart.length === 0) {
      alert(' El carrito está vacío');
      return;
    }

    // Abrir modal de pago
    setShowPayment(true);
  };

  const handleSubmitPayment = async (paymentData) => {
    setLoading(true);
    try {
      const items = cart.map(item => ({ product_id: item.id, cantidad: 1 }));
      const response = await tiendaAPI.crearOrden({ items, metodo_pago: paymentData.metodo_pago, numero_tarjeta: paymentData.numero_tarjeta });
      const ultimosDos = paymentData.numero_tarjeta.slice(-2);
      alert(`✅ ¡Pago exitoso!\nOrden: #${response.data.order_id}\nTarjeta: •••••••••••••${ultimosDos}`);
      onCheckout();
      return response;
    } catch (error) {
      console.error(' Error en compra:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 999
          }}
        />
      )}

      {/* Carrito */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '350px',
        height: '100vh',
        background: '#0a0a0a',
        border: '1px solid #00ff87',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '80px'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #2a2a2a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#00ff87', margin: 0, fontSize: '1.2rem' }}>
            Carrito ({cart.length})
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#00ff87',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {cart.length === 0 ? (
            <p style={{ color: '#a0a0a0', textAlign: 'center', marginTop: '2rem' }}>
              Carrito vacío
            </p>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '0.4rem',
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#00ff87', margin: 0, fontSize: '0.9rem' }}>
                    {item.nombre}
                  </p>
                  <p style={{ color: '#60efff', margin: 0, fontSize: '0.85rem' }}>
                    ${item.precio}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(idx)}
                  style={{
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.3rem',
                    padding: '0.3rem 0.6rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  X
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            borderTop: '1px solid #2a2a2a',
            padding: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #2a2a2a'
            }}>
              <span style={{ color: '#a0a0a0' }}>Total:</span>
              <span style={{ color: '#00ff87', fontWeight: '600', fontSize: '1.1rem' }}>
                ${total}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: loading ? '#888' : '#60efff',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '0.4rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Procesando...' : 'Comprar Ahora'}
            </button>
          </div>
        )}
        <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} total={total} loading={loading} onSubmit={handleSubmitPayment} />
      </div>
    </>
  );
};

export default CartSidebar;