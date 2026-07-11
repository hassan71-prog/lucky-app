'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [completing, setCompleting] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    if (!data.success) { router.push('/'); return; }
    setTasks(data.tasks);
    setLoading(false);
  };

  const handleComplete = async (taskId, taskLink) => {
    // Pehle link kholo
    window.open(taskLink, '_blank');
    
    // 3 second baad complete mark karo
    setCompleting(taskId);
    setTimeout(async () => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('🎉 ' + data.message);
        fetchTasks();
      } else {
        setMsg('❌ ' + data.message);
      }
      setCompleting(null);
    }, 3000);
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

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ margin: '20px 0' }}>📋 Tasks Complete Karein — Free Cards Pao!</h2>

        {msg && (
          <div style={{ background: msg.includes('❌') ? '#f8d7da' : '#d1e7dd', color: msg.includes('❌') ? '#842029' : '#0a3622', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
            {msg}
          </div>
        )}

        {/* Info Box */}
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ffc107' }}>
          <p style={{ margin: 0, color: '#856404' }}>
            💡 Task complete karo — <strong>Free Card</strong> pao aur Lucky Draw mein participate karo!
          </p>
        </div>

        {tasks.length === 0 ? (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', color: '#666' }}>
            Abhi koi task nahi hai — baad mein check karein!
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '15px', boxShadow: '0 2px 10px rgba(108,63,197,0.12)', border: '2px solid #e8d5ff' }}>
              <h3 style={{ color: '#6c3fc5', margin: '0 0 8px' }}>{task.title}</h3>
              {task.description && (
                <p style={{ color: '#666', fontSize: '0.9em', margin: '0 0 10px' }}>{task.description}</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ background: '#6c3fc5', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold' }}>
                  🎁 Reward: Rs. {task.reward_amount} Free Card
                </span>
                {task.user_status === 'pending' || task.user_status === 'completed' ? (
                  <span style={{ background: '#d1e7dd', color: '#0a3622', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9em', fontWeight: 'bold' }}>
                    ✅ Complete Ho Gaya!
                  </span>
                ) : (
                  <button
                    onClick={() => handleComplete(task.id, task.link)}
                    disabled={completing === task.id}
                    style={{ background: completing === task.id ? '#999' : '#6c3fc5', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: completing === task.id ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9em' }}>
                    {completing === task.id ? '⏳ Processing...' : '▶️ Task Karein & Card Pao'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}