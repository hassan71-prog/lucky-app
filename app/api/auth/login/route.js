import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function POST(request) {
  try {
    const { phone, password } = await request.json();

    const users = await sql`
      SELECT * FROM users WHERE phone = ${phone}
    `;

    if (users.length === 0) {
      return Response.json({ 
        success: false, 
        message: 'Phone ya password galat hai!' 
      });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json({ 
        success: false, 
        message: 'Phone ya password galat hai!' 
      });
    }

    const cookieStore = await cookies();
    cookieStore.set('user_id', String(user.id), { 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 7 
    });
    cookieStore.set('user_name', user.name, { 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 7 
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}