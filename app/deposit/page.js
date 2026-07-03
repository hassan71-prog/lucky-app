'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [txnId, setTxnId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!amount) {
      setError('Card amount select karein!');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/deposits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, payment_method: method, transaction_id: txnId }),
    });

    const data = await res.json();

    if (data.success) {
      setSuccess('Card submit ho gaya! Admin approve karega. ✅');
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      setError(data.message);
    }
    setLoading(false);
  };

  const amounts = [5, 10, 20, 50, 100];

  return (
    <div style={{ background: '#f0eaff', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: '#6c3fc5',
        color: '#fff',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>🍀 Lucky Draw</h2>
        <Link href="/dashboard" style={{ color: '#ffd700' }}>← Wapas</Link>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0', color: '#333' }}>💳 Card Deposit</h2>

        {error && (
          <div style={{
            background: '#f8d7da', color: '#842029',
            padding: '12px', borderRadius: '8px', marginBottom: '15px'
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            background: '#d1e7dd', color: '#0a3622',
            padding: '12px', borderRadius: '8px', marginBottom: '15px'
          }}>{success}</div>
        )}

        {/* Payment Info */}
        <div style={{
          background: '#e8f4fd', padding: '16px',
          borderRadius: '10px', marginBottom: '20px'
        }}>
          <h3>⚠️ Pehle Payment Karein:</h3>
          <p style={{ margin: '6px 0' }}>📱 <strong>Easypaisa:</strong> 03273003414</p>
          <p style={{ margin: '6px 0' }}>📱 <strong>JazzCash:</strong> 03273003414</p>
          <p style={{ color: 'red', marginTop: '10px' }}>
            ⚠️ Payment ke baad Transaction ID zaroor likhein!
          </p>
        </div>

        <form onSubmit={handleDeposit}>

          {/* Amount Selection */}
          <label style={{ fontWeight: 'bold' }}>Card Amount:</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px', margin: '10px 0 20px'
          }}>
            {amounts.map(a => (
              <div
                key={a}
                onClick={() => setAmount(a)}
                style={{
                  background: amount === a ? '#4a2a9e' : '#6c3fc5',
                  color: '#fff',
                  padding: '12px 5px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: amount === a ? '3px solid #ffd700' : '3px solid transparent'
                }}
              >
                Rs. {a}
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <label style={{ fontWeight: 'bold' }}>Payment Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            required
            style={{
              width: '100%', padding: '12px',
              margin: '8px 0 16px', border: '1px solid #ddd',
              borderRadius: '8px', fontSize: '1em'
            }}
          >
            <option value="">-- Select Karein --</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="jazzcash">JazzCash</option>
            <option value="manual">Cash / Manual</option>
          </select>

          {/* Transaction ID */}
          <label style={{ fontWeight: 'bold' }}>Transaction ID:</label>
          <input
            type="text"
            placeholder="TXN ID likhein (Cash ho to 'Cash' likhein)"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            style={{
              width: '100%', padding: '12px',
              margin: '8px 0 16px', border: '1px solid #ddd',
              borderRadius: '8px', fontSize: '1em',
              boxSizing: 'border-box'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#999' : '#6c3fc5',
              color: '#fff', border: 'none',
              borderRadius: '8px', fontSize: '1.1em',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Submit ho raha hai...' : 'Card Submit Karein 🎟️'}
          </button>
        </form>
      </div>
    </div>
  );
}