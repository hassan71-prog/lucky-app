'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prizeId = searchParams.get('id');

  const [prize, setPrize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('');
  const [txnId, setTxnId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Apna Easypaisa number yahan likho
  const easypaisaNumber = "03273003414";
  const easypaisaLink = `https://easypaisa.com.pk/payment?to=${easypaisaNumber}`;

  useEffect(() => {
    fetchPrize();
  }, []);

  const fetchPrize = async () => {
    const res = await fetch(`/api/prize?id=${prizeId}`);
    const data = await res.json();
    if (data.success) setPrize(data.prize);
    setLoading(false);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/deposits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount: prize.card_amount, 
        payment_method: method, 
        transaction_id: txnId || 'Online Payment'
      }),
    });

    const data = await res.json();

    if (data.success) {
      setSuccess('✅ Card submit ho gaya! Admin approve karega.');
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      setError(data.message);
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0eaff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: '#6c3fc5' }}>Loading... 🍀</h2>
    </div>
  );

  if (!prize) return (
    <div style={{ minHeight: '100vh', background: '#f0eaff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: '#842029' }}>Prize nahi mila!</h2>
    </div>
  );

  return (
    <div style={{ background: '#f0eaff', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#6c3fc5', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🍀 Lucky Draw</h2>
        <Link href="/dashboard" style={{ color: '#ffd700' }}>← Wapas</Link>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>

        {/* Prize Card */}
        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 4px 20px rgba(108,63,197,0.15)', border: '2px solid #e8d5ff' }}>
          {prize.prize_image && (
            <img src={prize.prize_image} alt={prize.prize_description}
              style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
          )}
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#6c3fc5' }}>{prize.prize_description}</h2>
            <div style={{ background: '#6c3fc5', color: '#fff', padding: '6px 14px', borderRadius: '20px', display: 'inline-block', margin: '10px 0', fontWeight: 'bold' }}>
              Rs. {prize.card_amount} Card
            </div>
            {prize.description && (
              <p style={{ color: '#555', lineHeight: '1.6', marginTop: '10px' }}>
                {prize.description}
              </p>
            )}
          </div>
        </div>

        {success ? (
          <div style={{ background: '#d1e7dd', color: '#0a3622', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            {success}
          </div>
        ) : (
          <>
            {/* Step 1: Payment */}
            {step === 1 && (
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px' }}>
                <h3 style={{ marginBottom: '15px' }}>💳 Step 1: Payment Karein</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Rs. <strong>{prize.card_amount}</strong> pay karein:
                </p>

                {/* Easypaisa Button */}
                <a href={easypaisaLink} target="_blank" rel="noreferrer"
                  style={{ display: 'block', background: '#00a651', color: '#fff', padding: '15px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '10px' }}>
                  📱 Easypaisa Se Pay Karein — Rs. {prize.card_amount}
                </a>

                {/* JazzCash Button */}
                <a href={`jazz://transfer?to=${easypaisaNumber}&amount=${prize.card_amount}`} target="_blank" rel="noreferrer"
                  style={{ display: 'block', background: '#db1f29', color: '#fff', padding: '15px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}>
                  📱 JazzCash Se Pay Karein — Rs. {prize.card_amount}
                </a>

                <button onClick={() => setStep(2)}
                  style={{ width: '100%', padding: '13px', background: '#6c3fc5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1em', cursor: 'pointer' }}>
                  Payment Ho Gayi — Aage Barho ➡️
                </button>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '15px' }}>✅ Step 2: Confirm Karein</h3>

                {error && (
                  <div style={{ background: '#f8d7da', color: '#842029', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleDeposit}>
                  <label style={{ fontWeight: 'bold' }}>Payment Method:</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)} required
                    style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em' }}>
                    <option value="">-- Select Karein --</option>
                    <option value="easypaisa">Easypaisa</option>
                    <option value="jazzcash">JazzCash</option>
                  </select>

                  <label style={{ fontWeight: 'bold' }}>Transaction ID (optional):</label>
                  <input type="text" placeholder="TXN ID (agar mile to likhein)"
                    value={txnId} onChange={(e) => setTxnId(e.target.value)}
                    style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
                  />

                  <button type="submit" disabled={submitting}
                    style={{ width: '100%', padding: '13px', background: submitting ? '#999' : '#6c3fc5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1em', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting ? 'Submit ho raha hai...' : '🎟️ Deposit Confirm Karein'}
                  </button>

                  <button type="button" onClick={() => setStep(1)}
                    style={{ width: '100%', padding: '12px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1em', cursor: 'pointer', marginTop: '8px' }}>
                    ← Wapas
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardContent />
    </Suspense>
  );
}