import React, { useState } from 'react';

const PaymentModal = ({ open, onClose, onSubmit, total, loading }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const reset = () => {
    setCardNumber(''); setExpiry(''); setCvv(''); setName(''); setError('');
  };

  const validateAndSubmit = () => {
    setError('');
    const digits = (s) => s.replace(/\s+/g, '');
    const num = digits(cardNumber);
    if (!/^[0-9]{13,19}$/.test(num)) return setError('Número de tarjeta inválido');
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(expiry)) return setError('Fecha debe ser MM/AA');
    const [m, y] = expiry.split('/').map(n => parseInt(n, 10));
    if (m < 1 || m > 12) return setError('Mes inválido');
    const now = new Date();
    const fullYear = 2000 + y;
    const expDate = new Date(fullYear, m);
    if (expDate <= now) return setError('Tarjeta expirada');
    if (!/^[0-9]{3,4}$/.test(cvv)) return setError('CVV inválido');
    if (!name.trim()) return setError('Ingresa el nombre del titular');

    onSubmit({ numero_tarjeta: num, nombre_tarjeta: name, metodo_pago: 'tarjeta' })
      .then(() => {
        reset();
        onClose();
      })
      .catch((err) => {
        setError(err?.message || 'Error procesando pago');
      });
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000 }} onClick={onClose} />
      <div style={{ position: 'fixed', right: '50%', top: '50%', transform: 'translate(50%,-50%)', zIndex: 2001, width: '420px', background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
        <h3 style={{ color: '#00ff87', marginTop: 0 }}>Pago seguro</h3>
        <p style={{ color: '#a0a0a0' }}>Total a pagar: ${total.toLocaleString('es-AR')}</p>

        <div style={{ marginTop: '10px' }}>
          <label style={{ color: '#a0a0a0' }}>Número de tarjeta</label>
          <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: '8px', marginTop: '6px' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#a0a0a0' }}>Fecha (MM/AA)</label>
            <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="08/26" style={{ width: '100%', padding: '8px', marginTop: '6px' }} />
          </div>
          <div style={{ width: '120px' }}>
            <label style={{ color: '#a0a0a0' }}>CVV</label>
            <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="123" style={{ width: '100%', padding: '8px', marginTop: '6px' }} />
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label style={{ color: '#a0a0a0' }}>Nombre en la tarjeta</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="JUAN PEREZ" style={{ width: '100%', padding: '8px', marginTop: '6px' }} />
        </div>

        {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #444', color: '#a0a0a0', borderRadius: '6px' }}>Cancelar</button>
          <button onClick={validateAndSubmit} disabled={loading} style={{ flex: 1, padding: '10px', background: '#60efff', border: 'none', color: '#0a0a0a', borderRadius: '6px' }}>{loading ? 'Procesando...' : 'Pagar Ahora'}</button>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
