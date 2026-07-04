import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Phone aur password zaroori hain!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const users = await sql`
      SELECT * FROM users WHERE phone = ${phone}
    `;

    if (users.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Phone ya password galat hai!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Phone ya password galat hai!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cookieStore = await cookies();
    cookieStore.set('user_id', String(user.id), { 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax'
    });
    cookieStore.set('user_name', user.name, { 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax'
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}