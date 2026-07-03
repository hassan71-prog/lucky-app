'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });

    const data = await res.json();

    if (data.success) {
      router.push('/dashboard');
    } else {
      setError(data.message || 'Login failed!');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0eaff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(108,63,197,0.15)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#6c3fc5', fontSize: '2em' }}>🍀 Lucky Draw</h2>
        <h3 style={{ margin: '10px 0 20px', color: '#444' }}>Login Karein</h3>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#842029',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="tel"
            placeholder="Phone Number (03xxxxxxxxx)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '8px 0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1em',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '8px 0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1em',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? '#999' : '#6c3fc5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Login ho raha hai...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '15px' }}>
          Account nahi?{' '}
          <Link href="/register" style={{ color: '#6c3fc5' }}>
            Register karein
          </Link>
        </p>
      </div>
    </div>
  );
}