import { useState, useEffect } from 'react';
import { tiendaAPI } from '../services/api';

const Purchases = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = async () => {
    try {
      const response = await tiendaAPI.obtenerMisCompras();
      setCompras(response.data || []);
    } catch (error) {
      console.error('Error cargando compras:', error);
      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h1 style={{ 
        color: '#00ff87', 
        marginBottom: '2rem',
        fontSize: '2.5rem'
      }}>
        🛍️ Mis Compras
      </h1>

      {loading ? (
        <p style={{ color: '#a0a0a0' }}>Cargando tus compras...</p>
      ) : compras.length === 0 ? (
        <div style={{
          background: '#161616',
          border: '1px solid #2a2a2a',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h3 style={{ color: '#a0a0a0', marginBottom: '1rem' }}>
            No hay compras realizadas
          </h3>
          <p style={{ color: '#666' }}>
            Cuando realices compras en la tienda, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {compras.map((compra) => (
            <div key={compra.id} style={{
              background: '#161616',
              border: '1px solid #00ff87',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
            }}>
              {/* Header de la compra */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #2a2a2a'
              }}>
                <div>
                  <h3 style={{ 
                    color: '#00ff87', 
                    margin: 0,
                    fontSize: '1.3rem'
                  }}>
                    Orden #{compra.id}
                  </h3>
                  <p style={{ 
                    color: '#a0a0a0', 
                    margin: '0.5rem 0 0 0',
                    fontSize: '0.9rem'
                  }}>
                    📅 {formatearFecha(compra.createdAt)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    color: '#60efff', 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    ${compra.total}
                  </p>
                  <span style={{
                    background: compra.estado === 'pagado' ? '#00ff87' : '#ffa500',
                    color: '#0a0a0a',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {compra.estado}
                  </span>
                </div>
              </div>

              {/* Productos de la compra */}
              <div>
                <h4 style={{ 
                  color: '#a0a0a0', 
                  marginBottom: '1rem',
                  fontSize: '1.1rem'
                }}>
                  Productos comprados:
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {compra.items && compra.items.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: '#1a1a1a',
                      borderRadius: '0.5rem',
                      border: '1px solid #2a2a2a'
                    }}>
                      <div>
                        <p style={{ 
                          color: '#ffffff', 
                          margin: 0,
                          fontWeight: '600'
                        }}>
                          {item.producto?.nombre || `Producto ${item.product_id}`}
                        </p>
                        <p style={{ 
                          color: '#a0a0a0', 
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.9rem'
                        }}>
                          Cantidad: {item.cantidad}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ 
                          color: '#60efff', 
                          margin: 0,
                          fontWeight: '600'
                        }}>
                          ${item.precio}
                        </p>
                        <p style={{ 
                          color: '#a0a0a0', 
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.9rem'
                        }}>
                          Subtotal: ${item.precio * item.cantidad}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de pago */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #2a2a2a'
              }}>
                <p style={{ 
                  color: '#a0a0a0', 
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  <strong>Método de pago:</strong> {compra.metodo_pago || 'Tarjeta'}
                  {compra.numero_tarjeta && (
                    <span style={{ marginLeft: '1rem' }}>
                      ••••••••••••• {compra.numero_tarjeta.slice(-3)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchases;