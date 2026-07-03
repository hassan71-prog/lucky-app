import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;
    if (!adminId) return Response.json({ success: false });

    // Prizes without winners
    const pending_prizes = await sql`
      SELECT p.*, d.title as draw_title 
      FROM prizes p 
      JOIN draws d ON p.draw_id = d.id 
      WHERE p.winner_deposit_id IS NULL
      AND d.status = 'active'
    `;

    // Already selected winners
    const winners = await sql`
      SELECT p.*, d.title as draw_title,
             u.name as winner_name, u.phone as winner_phone
      FROM prizes p 
      JOIN draws d ON p.draw_id = d.id
      JOIN deposits dep ON p.winner_deposit_id = dep.id
      JOIN users u ON dep.user_id = u.id
      WHERE p.winner_deposit_id IS NOT NULL
      ORDER BY p.id DESC
    `;

    // Participants for each prize
    const participants = await sql`
      SELECT dep.id, dep.amount, dep.user_id,
             u.name, u.phone
      FROM deposits dep
      JOIN users u ON dep.user_id = u.id
      WHERE dep.status = 'approved'
    `;

    return Response.json({ 
      success: true, 
      pending_prizes,
      winners,
      participants
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;
    if (!adminId) return Response.json({ success: false });

    const { prize_id, deposit_id } = await request.json();

    await sql`
      UPDATE prizes 
      SET winner_deposit_id = ${deposit_id} 
      WHERE id = ${prize_id}
    `;

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}