'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function QuickDepositContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '';
  const prize = searchParams.get('prize') || '';

  const [method, setMethod] = useState('');
  const [txnId, setTxnId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const easypaisa_number = "03273003414";
  const jazzcash_number = "03273003414";

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!txnId) {
      setError('Transaction ID likhna zaroori hai!');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/deposits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount, 
        payment_method: method, 
        transaction_id: txnId 
      }),
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
        <h2 style={{ margin: '20px 0' }}>⚡ Quick Deposit</h2>

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

        {/* Prize Preview */}
        {prize && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(108,63,197,0.12)',
            border: '2px solid #ffd700'
          }}>
            🎁 Aap yeh prize ke liye deposit kar rahe hain:
            <h3 style={{ color: '#6c3fc5', marginTop: '5px' }}>{prize}</h3>
            <p style={{ color: '#666' }}>Card Amount: <strong>Rs. {amount}</strong></p>
          </div>
        )}

        {/* Step 1: Payment */}
        <div style={{
          background: '#fff', padding: '20px',
          borderRadius: '12px', marginBottom: '20px'
        }}>
          <h3>Step 1: Payment Karein</h3>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            App khulay ga — Rs. {amount} bhej dein
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            <a href={`easypaisa://send?phone=${easypaisa_number}&amount=${amount}`}
              style={{
                background: '#fff',
                border: '2px solid #00a651',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#333',
                fontWeight: 'bold',
                display: 'block'
              }}>
              <div style={{ fontSize: '2.5em' }}>📱</div>
              Easypaisa Se Bhejein
            </a>
            <a href={`jazzcash://send?phone=${jazzcash_number}&amount=${amount}`}
              style={{
                background: '#fff',
                border: '2px solid #db1f29',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#333',
                fontWeight: 'bold',
                display: 'block'
              }}>
              <div style={{ fontSize: '2.5em' }}>📱</div>
              JazzCash Se Bhejein
            </a>
          </div>
        </div>

        {/* Step 2: Confirm */}
        <div style={{
          background: '#fff', padding: '20px',
          borderRadius: '12px', marginBottom: '20px'
        }}>
          <h3>Step 2: Payment Confirm Karein</h3>
          <form onSubmit={handleDeposit}>
            <label style={{ fontWeight: 'bold' }}>Card Amount:</label>
            <input
              type="text"
              value={`Rs. ${amount}`}
              disabled
              style={{
                width: '100%', padding: '12px',
                margin: '8px 0 16px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '1em',
                background: '#f0eaff', fontWeight: 'bold',
                boxSizing: 'border-box'
              }}
            />

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
            </select>

            <label style={{ fontWeight: 'bold' }}>Transaction ID:</label>
            <input
              type="text"
              placeholder="Payment ke baad mila TXN ID likhein"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              required
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
              {loading ? 'Submit ho raha hai...' : '✅ Deposit Confirm Karein'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function QuickDepositPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuickDepositContent />
    </Suspense>
  );
}