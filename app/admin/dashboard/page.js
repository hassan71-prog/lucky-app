'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/admin/dashboard');
    const data = await res.json();

    if (!data.success) {
      router.push('/admin');
      return;
    }

    setStats(data.stats);
    setDeposits(data.latest_deposits);
    setLoading(false);
  };

  const handleDeposit = async (id, action) => {
    await fetch('/api/admin/deposits', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    fetchData();
  };

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

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>📊 Admin Dashboard</h2>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {[
            { label: 'Total Users', value: stats?.total_users, color: '#6c3fc5' },
            { label: 'Pending', value: stats?.pending, color: 'orange' },
            { label: 'Approved', value: stats?.approved, color: 'green' },
            { label: 'Total Draws', value: stats?.total_draws, color: '#6c3fc5' },
            { label: 'Winners', value: stats?.winners, color: 'green' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{ color: s.color }}>{s.value || 0}</h2>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {[
            { href: '/admin/deposits', icon: '💳', label: 'Deposits Approve' },
            { href: '/admin/draws', icon: '🎯', label: 'Draw Banayein' },
            { href: '/admin/winners', icon: '🏆', label: 'Winner Select' },
            { href: '/admin/password', icon: '🔑', label: 'Password Change' },
          ].map((link, i) => (
            <Link key={i} href={link.href} style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '2px solid #e8d5ff',
              display: 'block'
            }}>
              <div style={{ fontSize: '2em' }}>{link.icon}</div>
              <div style={{ fontWeight: 'bold', marginTop: '8px' }}>{link.label}</div>
            </Link>
          ))}
        </div>

        {/* Latest Deposits */}
        <h3 style={{
          color: '#6c3fc5',
          borderLeft: '4px solid #6c3fc5',
          paddingLeft: '10px',
          marginBottom: '15px'
        }}>
          🕐 Latest Deposits
        </h3>
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
                <th style={{ padding: '12px' }}>User</th>
                <th style={{ padding: '12px' }}>Phone</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Method</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{d.name}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{d.phone}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <strong>Rs. {d.amount}</strong>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{d.payment_method}</td>
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
                        <button onClick={() => handleDeposit(d.id, 'approve')}
                          style={{
                            background: '#198754', color: '#fff',
                            padding: '5px 10px', borderRadius: '6px',
                            border: 'none', cursor: 'pointer', margin: '2px'
                          }}>✔</button>
                        <button onClick={() => handleDeposit(d.id, 'reject')}
                          style={{
                            background: '#dc3545', color: '#fff',
                            padding: '5px 10px', borderRadius: '6px',
                            border: 'none', cursor: 'pointer', margin: '2px'
                          }}>✘</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}