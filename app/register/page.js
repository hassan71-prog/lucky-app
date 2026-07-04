'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== password2) {
      setError('Dono passwords match nahi karte!');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password, referral_code: referralCode }),
    });

    const data = await res.json();

    if (data.success) {
      setSuccess(data.message);
      setTimeout(() => router.push('/'), 2000);
    } else {
      setError(data.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0eaff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(108,63,197,0.15)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#6c3fc5', fontSize: '2em' }}>🍀 Lucky Draw</h2>
        <h3 style={{ margin: '10px 0 20px', color: '#444' }}>Naya Account Banayein</h3>

        {error && (
          <div style={{ background: '#f8d7da', color: '#842029', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#d1e7dd', color: '#0a3622', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Apna Poora Naam" value={name}
            onChange={(e) => setName(e.target.value)} required
            style={{ width: '100%', padding: '12px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
          />
          <input type="tel" placeholder="Phone Number (03xxxxxxxxx)" value={phone}
            onChange={(e) => setPhone(e.target.value)} required
            style={{ width: '100%', padding: '12px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
          />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            style={{ width: '100%', padding: '12px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
          />
          <input type="password" placeholder="Password Dobara Likhein" value={password2}
            onChange={(e) => setPassword2(e.target.value)} required
            style={{ width: '100%', padding: '12px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
          />
          <input type="text" placeholder="Referral Code (optional)" value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            style={{ width: '100%', padding: '12px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box', background: referralCode ? '#f0eaff' : '#fff' }}
          />
          {referralCode && (
            <p style={{ color: '#6c3fc5', fontSize: '0.85em', marginBottom: '8px' }}>
              ✅ Referral code apply hoga!
            </p>
          )}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '13px', background: loading ? '#999' : '#6c3fc5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1em', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
            {loading ? 'Register ho raha hai...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '15px' }}>
          Pehle se account hai?{' '}
          <Link href="/" style={{ color: '#6c3fc5' }}>Login karein</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}