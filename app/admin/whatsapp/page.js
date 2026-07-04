'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WhatsAppPage() {
  const [link, setLink] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLink();
  }, []);

  const fetchLink = async () => {
    const res = await fetch('/api/admin/whatsapp');
    const data = await res.json();
    if (data.success) setLink(data.link);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link }),
    });
    const data = await res.json();
    if (data.success) setMsg('✅ WhatsApp link save ho gaya!');
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
        <Link href="/admin/whatsapp" style={{ color: '#ffd700' }}>📱 WhatsApp</Link>
        <Link href="/api/auth/admin-logout" style={{ color: '#ffd700' }}>🚪 Logout</Link>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>📱 WhatsApp Channel Link</h2>

        {msg && (
          <div style={{ background: '#d1e7dd', color: '#0a3622', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
            {msg}
          </div>
        )}

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Yeh link user dashboard par dikhega — dosto ko WhatsApp channel join karne ke liye!
          </p>
          <form onSubmit={handleSave}>
            <label style={{ fontWeight: 'bold' }}>WhatsApp Channel Link:</label>
            <input
              type="url"
              placeholder="https://whatsapp.com/channel/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
            />
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#999' : '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1em', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Save ho raha hai...' : '📱 WhatsApp Link Save Karein'}
            </button>
          </form>
        </div>

        {link && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginTop: '15px', textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '10px' }}>Preview:</p>
            <a href={link} target="_blank" rel="noreferrer"
              style={{ background: '#25D366', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', display: 'inline-block', fontWeight: 'bold' }}>
              📱 WhatsApp Channel Join Karein
            </a>
          </div>
        )}
      </div>
    </div>
  );
}