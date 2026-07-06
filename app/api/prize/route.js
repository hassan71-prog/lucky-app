import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Prize ID nahi mila!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const prizes = await sql`
      SELECT p.*, d.title as draw_title, d.draw_date
      FROM prizes p
      JOIN draws d ON p.draw_id = d.id
      WHERE p.id = ${id}
    `;

    if (prizes.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Prize nahi mila!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      prize: prizes[0] 
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