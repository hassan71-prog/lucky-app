'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WinnersPage() {
  const router = useRouter();
  const [winners, setWinners] = useState([]);
  const [myWins, setMyWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimData, setClaimData] = useState({});
  const [claimMsg, setClaimMsg] = useState('');
  const [showClaim, setShowClaim] = useState(null);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    const res = await fetch('/api/winners');
    const data = await res.json();
    if (!data.success) { router.push('/'); return; }
    setWinners(data.winners);
    setMyWins(data.my_wins);
    setLoading(false);
  };

  const handleClaim = async (e, prizeId) => {
    e.preventDefault();
    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prize_id: prizeId,
        ...claimData[prizeId]
      }),
    });
    const data = await res.json();
    if (data.success) {
      setClaimMsg('✅ Claim submit ho gaya! Admin jald payment karega.');
      setShowClaim(null);
    } else {
      setClaimMsg(data.message);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0eaff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: '#6c3fc5' }}>Loading... 🍀</h2>
    </div>
  );

  return (
    <div style={{ background: '#f0eaff', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#6c3fc5', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🍀 Lucky Draw</h2>
        <Link href="/dashboard" style={{ color: '#ffd700' }}>← Dashboard</Link>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>🏆 Winners</h2>

        {claimMsg && (
          <div style={{ background: '#d1e7dd', color: '#0a3622', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
            {claimMsg}
          </div>
        )}

        {/* Meri Jeetein */}
        {myWins.length > 0 && (
          <>
            <h3 style={{ color: '#6c3fc5', borderLeft: '4px solid #ffd700', paddingLeft: '10px', marginBottom: '15px' }}>
              🥇 Aapki Jeetein!
            </h3>
            {myWins.map(w => (
              <div key={w.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '15px', border: '2px solid #ffd700', boxShadow: '0 2px 10px rgba(108,63,197,0.12)' }}>
                <h3 style={{ color: '#6c3fc5' }}>🎁 {w.prize_description}</h3>
                <p style={{ color: '#666', margin: '5px 0' }}>
                  Draw: <strong>{w.draw_title}</strong> | Card: <strong>Rs. {w.card_amount}</strong>
                </p>

                {/* Claim Button */}
                {showClaim === w.id ? (
                  <form onSubmit={(e) => handleClaim(e, w.id)} style={{ marginTop: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Apna Naam:</label>
                    <input type="text" placeholder="Apna poora naam"
                      onChange={(e) => setClaimData(prev => ({ ...prev, [w.id]: { ...prev[w.id], account_name: e.target.value } }))}
                      required
                      style={{ width: '100%', padding: '10px', margin: '5px 0 10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                    <label style={{ fontWeight: 'bold' }}>Payment Method:</label>
                    <select
                      onChange={(e) => setClaimData(prev => ({ ...prev, [w.id]: { ...prev[w.id], payment_method: e.target.value } }))}
                      required
                      style={{ width: '100%', padding: '10px', margin: '5px 0 10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    >
                      <option value="">-- Select Karein --</option>
                      <option value="easypaisa">Easypaisa</option>
                      <option value="jazzcash">JazzCash</option>
                    </select>
                    <label style={{ fontWeight: 'bold' }}>Account Number:</label>
                    <input type="tel" placeholder="03xxxxxxxxx"
                      onChange={(e) => setClaimData(prev => ({ ...prev, [w.id]: { ...prev[w.id], account_number: e.target.value } }))}
                      required
                      style={{ width: '100%', padding: '10px', margin: '5px 0 10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                    <label style={{ fontWeight: 'bold' }}>CNIC Number:</label>
                    <input type="text" placeholder="xxxxx-xxxxxxx-x"
                      onChange={(e) => setClaimData(prev => ({ ...prev, [w.id]: { ...prev[w.id], id_card: e.target.value } }))}
                      required
                      style={{ width: '100%', padding: '10px', margin: '5px 0 15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                    <button type="submit"
                      style={{ width: '100%', padding: '12px', background: '#198754', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1em', cursor: 'pointer' }}>
                      ✅ Claim Submit Karein
                    </button>
                    <button type="button" onClick={() => setShowClaim(null)}
                      style={{ width: '100%', padding: '12px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1em', cursor: 'pointer', marginTop: '8px' }}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setShowClaim(w.id)}
                    style={{ marginTop: '10px', padding: '10px 20px', background: '#ffd700', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1em' }}>
                    🎉 Prize Claim Karein
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        {/* Sare Winners */}
        <h3 style={{ color: '#6c3fc5', borderLeft: '4px solid #6c3fc5', paddingLeft: '10px', marginBottom: '15px' }}>
          🏆 Sare Winners
        </h3>
        {winners.length === 0 ? (
          <div style={{ background: '#fff3cd', color: '#856404', padding: '12px', borderRadius: '8px' }}>
            Abhi koi winner announce nahi hua!
          </div>
        ) : (
          winners.map(w => (
            <div key={w.id} style={{ background: '#fff', borderRadius: '12px', padding: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              {w.prize_image ? (
                <img src={w.prize_image} alt={w.prize_description} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '70px', height: '70px', background: '#f0eaff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2em', flexShrink: 0 }}>🎁</div>
              )}
              <div>
                <h3 style={{ color: '#6c3fc5', margin: '0 0 5px' }}>{w.prize_description}</h3>
                <p style={{ margin: '2px 0', color: '#666', fontSize: '0.9em' }}>
                  👤 Winner: <strong>{w.winner_name?.substring(0, 2)}***</strong>
                </p>
                <p style={{ margin: '2px 0', color: '#666', fontSize: '0.9em' }}>
                  💳 Card: Rs. {w.card_amount} | 🎯 {w.draw_title}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}