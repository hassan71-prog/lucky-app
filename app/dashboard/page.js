'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [draw, setDraw] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    if (!data.success) {
      router.push('/');
      return;
    }

    setUser(data.user);
    setCards(data.cards);
    setDraw(data.draw);
    setPrizes(data.prizes);
    setLoading(false);
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

      {/* Header */}
      <div style={{
        background: '#6c3fc5',
        color: '#fff',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>🍀 Lucky Draw</h2>
        <div>
          <span>Salam, {user?.name}! </span>
          <Link href="/api/auth/logout" style={{ color: '#ffd700' }}>
            Logout
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>

        {/* Draw Banner */}
        {draw ? (
          <div style={{
            background: '#ffd700',
            padding: '12px 20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            🎯 Active Draw: <strong>{draw.title}</strong> — Date: <strong>{draw.draw_date}</strong>
          </div>
        ) : (
          <div style={{
            background: '#ffd700',
            padding: '12px 20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            ⏳ Abhi koi active draw nahi hai!
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#6c3fc5' }}>
              {cards.filter(c => c.status === 'approved').length}
            </h2>
            <p>Approved Cards</p>
          </div>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h2>🎟️</h2>
            <p>Draw Mein Shamil</p>
          </div>
        </div>

        {/* Deposit Button */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link href="/deposit" style={{
            background: '#6c3fc5',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            display: 'inline-block',
            margin: '5px'
          }}>
            + Naya Card Deposit
          </Link>
          <Link href="/winners" style={{
            background: '#ffd700',
            color: '#333',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            display: 'inline-block',
            margin: '5px'
          }}>
            🏆 Winners
          </Link>
        </div>

        {/* Prizes */}
        {prizes.length > 0 && (
          <>
            <h3 style={{
              color: '#6c3fc5',
              borderLeft: '4px solid #6c3fc5',
              paddingLeft: '10px',
              marginBottom: '15px'
            }}>
              🎁 Is Hafte Ke Prizes
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              {prizes.map(prize => (
                <Link key={prize.id}
                  href={`/quick-deposit?amount=${prize.card_amount}&prize=${encodeURIComponent(prize.prize_description)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                    boxShadow: '0 2px 10px rgba(108,63,197,0.12)',
                    border: '2px solid #e8d5ff',
                    cursor: 'pointer'
                  }}>
                    {prize.prize_image ? (
                      <img
                        src={prize.prize_image}
                        alt={prize.prize_description}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '8px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '120px',
                        background: '#f0eaff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2em',
                        marginBottom: '8px'
                      }}>🎁</div>
                    )}
                    <div style={{
                      background: '#6c3fc5',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8em',
                      marginBottom: '6px',
                      display: 'inline-block'
                    }}>
                      Rs. {prize.card_amount} Card
                    </div>
                    <div style={{
                      fontSize: '0.9em',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      {prize.prize_description}
                    </div>
                    <div style={{
                      color: '#6c3fc5',
                      fontSize: '0.8em',
                      marginTop: '5px'
                    }}>
                      👆 Click karein
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Cards List */}
        <h3 style={{
          color: '#6c3fc5',
          borderLeft: '4px solid #6c3fc5',
          paddingLeft: '10px',
          marginBottom: '15px'
        }}>
          📋 Aapke Cards
        </h3>
        {cards.length === 0 ? (
          <div style={{
            background: '#f8d7da',
            color: '#842029',
            padding: '12px',
            borderRadius: '8px'
          }}>
            Abhi koi card nahi — deposit karein!
          </div>
        ) : (
          cards.map(card => (
            <div key={card.id} style={{
              background: '#fff',
              padding: '14px',
              borderRadius: '10px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
            }}>
              <strong>Rs. {card.amount}</strong>
              <span>{card.payment_method}</span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.8em',
                fontWeight: 'bold',
                background: card.status === 'approved' ? '#d1e7dd' :
                  card.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                color: card.status === 'approved' ? '#0a3622' :
                  card.status === 'rejected' ? '#842029' : '#856404'
              }}>
                {card.status}
              </span>
              <small>{new Date(card.created_at).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}