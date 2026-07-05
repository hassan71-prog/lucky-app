'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminClaims() {
  const router = useRouter();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    const res = await fetch('/api/claims');
    const data = await res.json();
    if (!data.success) { router.push('/admin'); return; }
    setClaims(data.claims);
    setLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0eaff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: '#6c3fc5' }}>Loading... 🍀</h2>
    </div>
  );

  return (
    <div style={{ background: '#f0eaff', minHeight: '100vh' }}>
      <div style={{ background: '#4a2a9e', padding: '15px 20px', color: '#fff', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <strong>🍀 Admin Panel</strong>
        <Link href="/admin/dashboard" style={{ color: '#ffd700' }}>🏠 Dashboard</Link>
        <Link href="/admin/deposits" style={{ color: '#ffd700' }}>💳 Deposits</Link>
        <Link href="/admin/draws" style={{ color: '#ffd700' }}>🎯 Draws</Link>
        <Link href="/admin/winners" style={{ color: '#ffd700' }}>🏆 Winners</Link>
        <Link href="/admin/claims" style={{ color: '#ffd700' }}>💰 Claims</Link>
        <Link href="/admin/whatsapp" style={{ color: '#ffd700' }}>📱 WhatsApp</Link>
        <Link href="/api/auth/admin-logout" style={{ color: '#ffd700' }}>🚪 Logout</Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>💰 Winner Claims</h2>

        {claims.length === 0 ? (
          <div style={{ background: '#fff3cd', color: '#856404', padding: '12px', borderRadius: '8px' }}>
            Abhi koi claim nahi aaya!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#6c3fc5', color: '#fff' }}>
                  <th style={{ padding: '12px' }}>#</th>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Phone</th>
                  <th style={{ padding: '12px' }}>Prize</th>
                  <th style={{ padding: '12px' }}>Account Naam</th>
                  <th style={{ padding: '12px' }}>Account No.</th>
                  <th style={{ padding: '12px' }}>CNIC</th>
                  <th style={{ padding: '12px' }}>Method</th>
                  <th style={{ padding: '12px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{i + 1}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{c.name}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{c.phone}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{c.prize_description}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{c.account_name}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <strong>{c.account_number}</strong>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{c.id_card}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px',
                        fontSize: '0.8em', fontWeight: 'bold',
                        background: c.payment_method === 'easypaisa' ? '#d1e7dd' : '#fff3cd',
                        color: c.payment_method === 'easypaisa' ? '#0a3622' : '#856404'
                      }}>
                        {c.payment_method}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}