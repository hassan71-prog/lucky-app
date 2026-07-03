import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;
    if (!adminId) return Response.json({ success: false });

    const draws = await sql`SELECT * FROM draws ORDER BY created_at DESC`;
    const prizes = await sql`
      SELECT p.*, d.title as draw_title 
      FROM prizes p 
      JOIN draws d ON p.draw_id = d.id 
      ORDER BY p.id DESC
    `;

    return Response.json({ success: true, draws, prizes });

  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;
    if (!adminId) return Response.json({ success: false });

    const { type, title, draw_date, draw_id, card_amount, prize_description } = await request.json();

    if (type === 'draw') {
      await sql`
        INSERT INTO draws (title, draw_date, status)
        VALUES (${title}, ${draw_date}, 'active')
      `;
    } else if (type === 'prize') {
      await sql`
        INSERT INTO prizes (draw_id, card_amount, prize_description)
        VALUES (${draw_id}, ${card_amount}, ${prize_description})
      `;
    }

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;
    if (!adminId) return Response.json({ success: false });

    const { id, status } = await request.json();
    await sql`UPDATE draws SET status = ${status} WHERE id = ${id}`;

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}