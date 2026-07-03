import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const userName = cookieStore.get('user_name')?.value;

    if (!userId) {
      return Response.json({ success: false, message: 'Login karein!' });
    }

    // User ke cards
    const cards = await sql`
      SELECT * FROM deposits 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    // Active draw
    const draws = await sql`
      SELECT * FROM draws 
      WHERE status = 'active' 
      LIMIT 1
    `;
    const draw = draws[0] || null;

    // Prizes
    let prizes = [];
    if (draw) {
      prizes = await sql`
        SELECT * FROM prizes 
        WHERE draw_id = ${draw.id} 
        ORDER BY card_amount ASC
      `;
    }

    return Response.json({
      success: true,
      user: { id: userId, name: userName },
      cards,
      draw,
      prizes
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}