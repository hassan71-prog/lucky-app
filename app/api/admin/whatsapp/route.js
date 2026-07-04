import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    const settings = await sql`
      SELECT * FROM settings WHERE key = 'whatsapp_link'
    `;
    const link = settings.length > 0 ? settings[0].value : '';
    return new Response(JSON.stringify({ success: true, link }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;
    if (!adminId) return new Response(JSON.stringify({ success: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    const { link } = await request.json();

    await sql`
      INSERT INTO settings (key, value)
      VALUES ('whatsapp_link', ${link})
      ON CONFLICT (key) DO UPDATE SET value = ${link}
    `;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}