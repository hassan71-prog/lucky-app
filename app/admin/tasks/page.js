'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [reward, setReward] = useState('10');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/admin/tasks');
    const data = await res.json();
    if (!data.success) { router.push('/admin'); return; }
    setTasks(data.tasks);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, link, reward_amount: reward }),
    });
    const data = await res.json();
    if (data.success) {
      setMsg('✅ Task add ho gaya!');
      setTitle(''); setDescription(''); setLink(''); setReward('10');
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    await fetch('/api/admin/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTasks();
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
        <Link href="/admin/tasks" style={{ color: '#ffd700' }}>📋 Tasks</Link>
        <Link href="/admin/claims" style={{ color: '#ffd700' }}>💰 Claims</Link>
        <Link href="/admin/whatsapp" style={{ color: '#ffd700' }}>📱 WhatsApp</Link>
        <Link href="/api/auth/admin-logout" style={{ color: '#ffd700' }}>🚪 Logout</Link>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>📋 Tasks Manage Karein</h2>

        {msg && (
          <div style={{ background: '#d1e7dd', color: '#0a3622', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
            {msg}
          </div>
        )}

        {/* Add Task Form */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3>➕ Naya Task Add Karein</h3>
          <form onSubmit={handleAdd}>
            <label style={{ fontWeight: 'bold' }}>Task Title:</label>
            <input type="text" placeholder="YouTube Channel Subscribe Karein"
              value={title} onChange={(e) => setTitle(e.target.value)} required
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
            />

            <label style={{ fontWeight: 'bold' }}>Description:</label>
            <textarea placeholder="Task ki detail likhein..."
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
            />

            <label style={{ fontWeight: 'bold' }}>Task Link (YouTube/Instagram etc):</label>
            <input type="url" placeholder="https://youtube.com/channel/..."
              value={link} onChange={(e) => setLink(e.target.value)} required
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box' }}
            />

            <label style={{ fontWeight: 'bold' }}>Reward (Card Amount):</label>
            <select value={reward} onChange={(e) => setReward(e.target.value)}
              style={{ width: '100%', padding: '12px', margin: '8px 0 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em' }}>
              <option value="10">Rs. 10 Card</option>
              <option value="20">Rs. 20 Card</option>
              <option value="50">Rs. 50 Card</option>
              <option value="100">Rs. 100 Card</option>
            </select>

            <button type="submit"
              style={{ background: '#6c3fc5', color: '#fff', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '1em' }}>
              ➕ Task Add Karein
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <h3 style={{ color: '#6c3fc5', borderLeft: '4px solid #6c3fc5', paddingLeft: '10px', marginBottom: '15px' }}>
          📋 Sare Tasks
        </h3>

        {tasks.length === 0 ? (
          <div style={{ background: '#fff3cd', color: '#856404', padding: '12px', borderRadius: '8px' }}>
            Koi task nahi — upar se add karein!
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#6c3fc5', margin: '0 0 5px' }}>{task.title}</h3>
                  {task.description && <p style={{ color: '#666', fontSize: '0.9em', margin: '3px 0' }}>{task.description}</p>}
                  <a href={task.link} target="_blank" rel="noreferrer"
                    style={{ color: '#1976d2', fontSize: '0.85em', wordBreak: 'break-all' }}>
                    🔗 {task.link}
                  </a>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ background: '#6c3fc5', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8em' }}>
                      Reward: Rs. {task.reward_amount} Card
                    </span>
                    <span style={{ background: task.is_active ? '#d1e7dd' : '#f8d7da', color: task.is_active ? '#0a3622' : '#842029', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8em', marginLeft: '5px' }}>
                      {task.is_active ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(task.id)}
                  style={{ background: '#dc3545', color: '#fff', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}