import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return Response.json({ 
        success: false, 
        message: 'Login karein!' 
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const prizes = await sql`
      SELECT p.*, d.title as draw_title, d.draw_date
      FROM prizes p
      JOIN draws d ON p.draw_id = d.id
      WHERE p.id = ${id}
    `;

    if (prizes.length === 0) {
      return Response.json({ 
        success: false, 
        message: 'Prize nahi mila!' 
      });
    }

    return Response.json({ success: true, prize: prizes[0] });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}