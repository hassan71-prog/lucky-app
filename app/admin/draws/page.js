'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDraws() {
  const router = useRouter();
  const [draws, setDraws] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Draw form
  const [title, setTitle] = useState('');
  const [drawDate, setDrawDate] = useState('');

  // Prize form
  const [drawId, setDrawId] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [prizeDesc, setPrizeDesc] = useState('');
  const [prizeImage, setPrizeImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/admin/draws');
    const data = await res.json();
    if (!data.success) { router.push('/admin'); return; }
    setDraws(data.draws);
    setPrizes(data.prizes);
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPrizeImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreateDraw = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/draws', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'draw', title, draw_date: drawDate }),
    });
    const data = await res.json();
    if (data.success) {
      setMsg('✅ Draw ban gaya!');
      setTitle(''); setDrawDate('');
      fetchData();
    }
  };

  const handleAddPrize = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/draws', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'prize', 
        draw_id: drawId, 
        card_amount: cardAmount, 
        prize_description: prizeDesc,
        prize_image: prizeImage,
        description: description
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMsg('✅ Prize add ho gaya!');
      setDrawId(''); setCardAmount('');
      setPrizeDesc(''); setPrizeImage('');
      setDescription('');
      fetchData();
    }
  };

  const handleStatusChange = async (id, status) => {
    await fetch('/api/admin/draws', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0eaff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: '#6c3fc5' }}>Loading... 🍀</h2>
    </div>
  );

  const activeDraws = draws.filter(d => d.status === 'active');

  return (
    <div style={{ background: '#f0eaff', minHeight: '100vh' }}>

      {/* Nav */}
      <div style={{ background: '#4a2a9e', padding: '15px 20px', color: '#fff', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <strong>🍀 Admin Panel</strong>
        <Link href="/admin/dashboard" style={{ color: '#ffd700' }}>🏠 Dashboard</Link>
        <Link href="/admin/deposits" style={{ color: '#ffd700' }}>💳 Deposits</Link>
        <Link href="/admin/draws" style={{ color: '#ffd700' }}>🎯 Draws</Link>
        <Link href="/admin/winners" style={{ color: '#ffd700' }}>🏆 Winners</Link>
        <Link href="/api/auth/admin-logout" style={{ color: '#ffd700' }}>🚪 Logout</Link>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>🎯 Draws Manage Karein</h2>

        {msg && (
          <div style={{ background: '#d1e7dd', color: '#0a3622', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
            {msg}
          </div>
        )}

        {/* Naya Draw */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3>➕ Naya Draw Banayein</h3>
          <form onSubmit={handleCreateDraw}>
            <input
              type="text"
              placeholder="Draw ka Naam (Weekly Draw #1)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
            />
            <label style={{ fontWeight: 'bold' }}>Draw ki Tarikh:</label>
            <input
              type="date"
              value={drawDate}
              onChange={(e) => setDrawDate(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
            />
            <button type="submit" style={{ background: '#6c3fc5', color: '#fff', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '1em' }}>
              Draw Banao
            </button>
          </form>
        </div>

        {/* Prize Add */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3>🎁 Prize Add Karein</h3>
          <form onSubmit={handleAddPrize}>
            <label style={{ fontWeight: 'bold' }}>Draw Select Karein:</label>
            <select
              value={drawId}
              onChange={(e) => setDrawId(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em' }}
            >
              <option value="">-- Draw Select Karein --</option>
              {activeDraws.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>

            <label style={{ fontWeight: 'bold' }}>Card Amount:</label>
            <select
              value={cardAmount}
              onChange={(e) => setCardAmount(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em' }}
            >
              <option value="">-- Amount Select Karein --</option>
              <option value="10">Rs. 10</option>
              <option value="20">Rs. 20</option>
              <option value="50">Rs. 50</option>
              <option value="100">Rs. 100</option>
            </select>

            <label style={{ fontWeight: 'bold' }}>Prize ka Naam:</label>
            <input
              type="text"
              placeholder="Prize (Mobile Phone, Rs. 1000 Cash)"
              value={prizeDesc}
              onChange={(e) => setPrizeDesc(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
            />

            <label style={{ fontWeight: 'bold' }}>Prize ki Description:</label>
            <textarea
              placeholder="Prize ke baare mein detail likhein..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
            />

            <label style={{ fontWeight: 'bold' }}>Prize ki Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ width: '100%', padding: '10px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px' }}
            />

            {prizeImage && (
              <img src={prizeImage} alt="preview"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
              />
            )}

            <button type="submit" style={{ background: '#6c3fc5', color: '#fff', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '1em' }}>
              🎁 Prize Add Karein
            </button>
          </form>
        </div>

        {/* Draws List */}
        <h3 style={{ color: '#6c3fc5', borderLeft: '4px solid #6c3fc5', paddingLeft: '10px', marginBottom: '15px' }}>📋 Sare Draws</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: '#6c3fc5', color: '#fff' }}>
              <th style={{ padding: '12px' }}>Draw</th>
              <th style={{ padding: '12px' }}>Tarikh</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {draws.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', textAlign: 'center' }}>{d.title}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{new Date(d.draw_date).toLocaleDateString()}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold',
                    background: d.status === 'active' ? '#d1e7dd' : d.status === 'completed' ? '#f8d7da' : '#fff3cd',
                    color: d.status === 'active' ? '#0a3622' : d.status === 'completed' ? '#842029' : '#856404'
                  }}>{d.status}</span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {d.status === 'active' && (
                    <button onClick={() => handleStatusChange(d.id, 'completed')}
                      style={{ background: '#dc3545', color: '#fff', padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                      Complete Karein
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Prizes List */}
        <h3 style={{ color: '#6c3fc5', borderLeft: '4px solid #6c3fc5', paddingLeft: '10px', marginBottom: '15px' }}>🎁 Sare Prizes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {prizes.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              {p.prize_image && (
                <img src={p.prize_image} alt={p.prize_description}
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
              )}
              <div style={{ padding: '12px' }}>
                <strong>{p.prize_description}</strong>
                <p style={{ color: '#6c3fc5', margin: '5px 0' }}>Rs. {p.card_amount} Card</p>
                {p.description && <p style={{ color: '#666', fontSize: '0.85em' }}>{p.description}</p>}
                <span style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold',
                  background: p.winner_deposit_id ? '#d1e7dd' : '#fff3cd',
                  color: p.winner_deposit_id ? '#0a3622' : '#856404'
                }}>
                  {p.winner_deposit_id ? '✅ Winner Selected' : '⏳ Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}