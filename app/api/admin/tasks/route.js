import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;
    if (!adminId) return new Response(JSON.stringify({ success: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    const tasks = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;

    return new Response(JSON.stringify({ success: true, tasks }), {
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

    const { title, description, link, reward_amount } = await request.json();

    await sql`
      INSERT INTO tasks (title, description, link, reward_amount)
      VALUES (${title}, ${description}, ${link}, ${reward_amount})
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

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;
    if (!adminId) return new Response(JSON.stringify({ success: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    const { id } = await request.json();

    await sql`UPDATE tasks SET is_active = false WHERE id = ${id}`;

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