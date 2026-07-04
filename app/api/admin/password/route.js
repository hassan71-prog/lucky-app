import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;

    if (!adminId) {
      return Response.json({ 
        success: false, 
        message: 'Admin login karein!' 
      });
    }

    const { current, newPass } = await request.json();

    // Current password check
    const admins = await sql`
      SELECT * FROM admins WHERE id = ${adminId}
    `;

    if (admins.length === 0) {
      return Response.json({ 
        success: false, 
        message: 'Admin nahi mila!' 
      });
    }

    const admin = admins[0];
    const match = await bcrypt.compare(current, admin.password);

    if (!match) {
      return Response.json({ 
        success: false, 
        message: 'Purana password galat hai!' 
      });
    }

    const hashed = await bcrypt.hash(newPass, 10);
    await sql`
      UPDATE admins SET password = ${hashed} WHERE id = ${adminId}
    `;

    return Response.json({ 
      success: true, 
      message: 'Password change ho gaya!' 
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}