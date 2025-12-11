import { useState } from 'react';

const ProductCard = ({ producto, onAddToCart }) => {
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setLoading(true);
    setTimeout(() => {
      onAddToCart(producto);
      setLoading(false);
    }, 300);
  };

  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid #00ff87',
      borderRadius: '0.5rem',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{
        width: '100%',
        height: '150px',
        background: '#0a0a0a',
        borderRadius: '0.4rem',
        marginBottom: '0.75rem',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.src = '📦';
          }}
        />
      </div>
      
      <h3 style={{
        color: '#00ff87',
        marginBottom: '0.4rem',
        fontSize: '0.95rem',
        margin: 0
      }}>
        {producto.nombre}
      </h3>
      
      <p style={{
        color: '#a0a0a0',
        marginBottom: '0.8rem',
        fontSize: '0.8rem',
        flex: 1,
        margin: '0.4rem 0'
      }}>
        {producto.descripcion}
      </p>

      <p style={{
        color: '#60efff',
        marginBottom: '0.75rem',
        fontSize: '1.1rem',
        fontWeight: '600',
        margin: 0
      }}>
        ${producto.precio}
      </p>

      <button
        onClick={handleAdd}
        disabled={loading}
        style={{
          padding: '0.6rem',
          background: '#00ff87',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: '0.4rem',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.85rem',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Agregando...' : 'Agregar'}
      </button>
    </div>
  );
};

export default ProductCard;
