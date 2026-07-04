import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function POST(request) {
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

    const { prize_id, account_name, account_number, id_card, payment_method } = await request.json();

    // Check already claimed
    const existing = await sql`
      SELECT id FROM claims 
      WHERE user_id = ${userId} AND prize_id = ${prize_id}
    `;

    if (existing.length > 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Aap pehle se claim kar chuke hain!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await sql`
      INSERT INTO claims (user_id, prize_id, account_name, account_number, id_card, payment_method)
      VALUES (${userId}, ${prize_id}, ${account_name}, ${account_number}, ${id_card}, ${payment_method})
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Claim submit ho gaya! Admin jald payment karega.' 
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

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;

    if (!adminId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Admin login karein!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const claims = await sql`
      SELECT c.*, u.name, u.phone,
             p.prize_description, p.card_amount
      FROM claims c
      JOIN users u ON c.user_id = u.id
      JOIN prizes p ON c.prize_id = p.id
      ORDER BY c.created_at DESC
    `;

    return new Response(JSON.stringify({ success: true, claims }), {
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