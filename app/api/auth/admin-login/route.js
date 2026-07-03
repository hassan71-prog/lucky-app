import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const admins = await sql`
      SELECT * FROM admins WHERE username = ${username}
    `;

    if (admins.length === 0) {
      return Response.json({ 
        success: false, 
        message: 'Galat username ya password!' 
      });
    }

    const admin = admins[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return Response.json({ 
        success: false, 
        message: 'Galat username ya password!' 
      });
    }

    const cookieStore = await cookies();
    cookieStore.set('admin_id', String(admin.id), { 
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