'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminPassword() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');

    if (newPass !== confirm) {
      setError('Naye passwords match nahi karte!');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/admin/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current, newPass }),
    });

    const data = await res.json();
    if (data.success) {
      setMsg('✅ Password change ho gaya!');
      setCurrent(''); setNewPass(''); setConfirm('');
    } else {
      setError(data.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#f0eaff', minHeight: '100vh' }}>
      <div style={{ background: '#4a2a9e', padding: '15px 20px', color: '#fff', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <strong>🍀 Admin Panel</strong>
        <Link href="/admin/dashboard" style={{ color: '#ffd700' }}>🏠 Dashboard</Link>
        <Link href="/admin/deposits" style={{ color: '#ffd700' }}>💳 Deposits</Link>
        <Link href="/admin/draws" style={{ color: '#ffd700' }}>🎯 Draws</Link>
        <Link href="/admin/winners" style={{ color: '#ffd700' }}>🏆 Winners</Link>
        <Link href="/api/auth/admin-logout" style={{ color: '#ffd700' }}>🚪 Logout</Link>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>🔑 Password Change</h2>

        {msg && <div style={{ background: '#d1e7dd', color: '#0a3622', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>{msg}</div>}
        {error && <div style={{ background: '#f8d7da', color: '#842029', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>{error}</div>}

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
          <form onSubmit={handleSubmit}>
            <label style={{ fontWeight: 'bold' }}>Purana Password:</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required
              placeholder="Purana password"
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }} />

            <label style={{ fontWeight: 'bold' }}>Naya Password:</label>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required
              placeholder="Naya password"
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }} />

            <label style={{ fontWeight: 'bold' }}>Naya Password Dobara:</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
              placeholder="Naya password dobara"
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }} />

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#999' : '#6c3fc5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1em', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Change ho raha hai...' : '🔑 Password Change Karein'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}