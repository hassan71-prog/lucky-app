import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Login karein!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sare winners
    const winners = await sql`
      SELECT p.*, d.title as draw_title,
             u.name as winner_name,
             dep.amount as card_amount
      FROM prizes p 
      JOIN draws d ON p.draw_id = d.id
      JOIN deposits dep ON p.winner_deposit_id = dep.id
      JOIN users u ON dep.user_id = u.id
      WHERE p.winner_deposit_id IS NOT NULL
      ORDER BY p.id DESC
    `;

    // Meri jeetein
    const my_wins = await sql`
      SELECT p.*, d.title as draw_title,
             dep.amount as card_amount
      FROM prizes p 
      JOIN draws d ON p.draw_id = d.id
      JOIN deposits dep ON p.winner_deposit_id = dep.id
      WHERE dep.user_id = ${userId}
      ORDER BY p.id DESC
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      winners,
      my_wins
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}