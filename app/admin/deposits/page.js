'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDeposits() {
  const router = useRouter();
  const [deposits, setDeposits] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    const res = await fetch('/api/admin/deposits');
    const data = await res.json();

    if (!data.success) {
      router.push('/admin');
      return;
    }

    setDeposits(data.deposits);
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    await fetch('/api/admin/deposits', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    fetchDeposits();
  };

  const filtered = filter === 'all' ? deposits :
    deposits.filter(d => d.status === filter);

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: '#f0eaff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h2 style={{ color: '#6c3fc5' }}>Loading... 🍀</h2>
    </div>
  );

  return (
    <div style={{ background: '#f0eaff', minHeight: '100vh' }}>

      {/* Nav */}
      <div style={{
        background: '#4a2a9e',
        padding: '15px 20px',
        color: '#fff',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <strong>🍀 Admin Panel</strong>
        <Link href="/admin/dashboard" style={{ color: '#ffd700' }}>🏠 Dashboard</Link>
        <Link href="/admin/deposits" style={{ color: '#ffd700' }}>💳 Deposits</Link>
        <Link href="/admin/draws" style={{ color: '#ffd700' }}>🎯 Draws</Link>
        <Link href="/admin/winners" style={{ color: '#ffd700' }}>🏆 Winners</Link>
        <Link href="/api/auth/admin-logout" style={{ color: '#ffd700' }}>🚪 Logout</Link>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>💳 Deposits Manage Karein</h2>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Sab', value: 'all', bg: '#6c3fc5' },
            { label: '⏳ Pending', value: 'pending', bg: 'orange' },
            { label: '✅ Approved', value: 'approved', bg: '#198754' },
            { label: '❌ Rejected', value: 'rejected', bg: '#dc3545' },
          ].map(f => (
            <button key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                background: filter === f.value ? '#333' : f.bg,
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Deposits Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: '#6c3fc5', color: '#fff' }}>
                <th style={{ padding: '12px' }}>#</th>
                <th style={{ padding: '12px' }}>User</th>
                <th style={{ padding: '12px' }}>Phone</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Method</th>
                <th style={{ padding: '12px' }}>TXN ID</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#999'
                  }}>
                    Koi deposit nahi mili
                  </td>
                </tr>
              ) : (
                filtered.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{i + 1}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{d.name}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{d.phone}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <strong>Rs. {d.amount}</strong>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {d.payment_method}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {d.transaction_id || '—'}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8em',
                        fontWeight: 'bold',
                        background: d.status === 'approved' ? '#d1e7dd' :
                          d.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                        color: d.status === 'approved' ? '#0a3622' :
                          d.status === 'rejected' ? '#842029' : '#856404'
                      }}>
                        {d.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {d.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(d.id, 'approve')}
                            style={{
                              background: '#198754', color: '#fff',
                              padding: '5px 12px', borderRadius: '6px',
                              border: 'none', cursor: 'pointer', margin: '2px'
                            }}>✔ Approve</button>
                          <button
                            onClick={() => handleAction(d.id, 'reject')}
                            style={{
                              background: '#dc3545', color: '#fff',
                              padding: '5px 12px', borderRadius: '6px',
                              border: 'none', cursor: 'pointer', margin: '2px'
                            }}>✘ Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}