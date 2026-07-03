'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminWinners() {
  const router = useRouter();
  const [pendingPrizes, setPendingPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/admin/winners');
    const data = await res.json();

    if (!data.success) {
      router.push('/admin');
      return;
    }

    setPendingPrizes(data.pending_prizes);
    setWinners(data.winners);
    setParticipants(data.participants);
    setLoading(false);
  };

  const handleSelectWinner = async (prize_id, deposit_id) => {
    const res = await fetch('/api/admin/winners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prize_id, deposit_id }),
    });
    const data = await res.json();
    if (data.success) {
      setMsg('🎉 Winner select ho gaya!');
      fetchData();
    }
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

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>🏆 Winner Select Karein</h2>

        {msg && (
          <div style={{
            background: '#d1e7dd', color: '#0a3622',
            padding: '12px', borderRadius: '8px', marginBottom: '15px'
          }}>{msg}</div>
        )}

        {/* Pending Prizes */}
        <h3 style={{
          color: '#6c3fc5',
          borderLeft: '4px solid #6c3fc5',
          paddingLeft: '10px',
          marginBottom: '15px'
        }}>⏳ Winner Pending Prizes</h3>

        {pendingPrizes.length === 0 ? (
          <div style={{
            background: '#f8d7da', color: '#842029',
            padding: '12px', borderRadius: '8px',
            marginBottom: '20px'
          }}>
            Sab prizes ke winners select ho chuke hain!
          </div>
        ) : (
          pendingPrizes.map(prize => {
            const prizeParticipants = participants.filter(
              p => Number(p.amount) === Number(prize.card_amount)
            );
            return (
              <div key={prize.id} style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '15px',
                boxShadow: '0 2px 10px rgba(108,63,197,0.12)',
                border: '2px solid #e8d5ff'
              }}>
                <h3 style={{ color: '#6c3fc5' }}>🎁 {prize.prize_description}</h3>
                <p style={{ color: '#666', margin: '5px 0' }}>
                  Draw: <strong>{prize.draw_title}</strong> | 
                  Card: <strong>Rs. {prize.card_amount}</strong> | 
                  Participants: <strong>{prizeParticipants.length}</strong>
                </p>

                {prizeParticipants.length === 0 ? (
                  <div style={{
                    background: '#fff3cd', color: '#856404',
                    padding: '10px', borderRadius: '8px', marginTop: '10px'
                  }}>
                    ⚠️ Is amount ka koi approved deposit nahi!
                  </div>
                ) : (
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>Winner Select Karein:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleSelectWinner(prize.id, e.target.value);
                        }
                      }}
                      style={{
                        width: '100%', padding: '12px',
                        margin: '8px 0', border: '1px solid #ddd',
                        borderRadius: '8px', fontSize: '1em'
                      }}
                    >
                      <option value="">-- Participant Select Karein --</option>
                      {prizeParticipants.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Selected Winners */}
        <h3 style={{
          color: '#6c3fc5',
          borderLeft: '4px solid #6c3fc5',
          paddingLeft: '10px',
          marginBottom: '15px'
        }}>🥇 Selected Winners</h3>

        {winners.length === 0 ? (
          <div style={{
            background: '#fff3cd', color: '#856404',
            padding: '12px', borderRadius: '8px'
          }}>
            Abhi koi winner select nahi hua!
          </div>
        ) : (
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            background: '#fff', borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: '#6c3fc5', color: '#fff' }}>
                <th style={{ padding: '12px' }}>Draw</th>
                <th style={{ padding: '12px' }}>Prize</th>
                <th style={{ padding: '12px' }}>Card</th>
                <th style={{ padding: '12px' }}>Winner</th>
                <th style={{ padding: '12px' }}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {winners.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{w.draw_title}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{w.prize_description}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>Rs. {w.card_amount}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <strong>{w.winner_name}</strong>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{w.winner_phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}