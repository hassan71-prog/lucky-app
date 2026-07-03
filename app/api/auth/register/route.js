import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.POSTGRES_URL);

export async function POST(request) {
  try {
    const { name, phone, password } = await request.json();

    // Check duplicate phone
    const existing = await sql`
      SELECT id FROM users WHERE phone = ${phone}
    `;

    if (existing.length > 0) {
      return Response.json({ 
        success: false, 
        message: 'Yeh phone number pehle se registered hai!' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, phone, password)
      VALUES (${name}, ${phone}, ${hashedPassword})
    `;

    return Response.json({ 
      success: true, 
      message: 'Account ban gaya! Ab login karein.' 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}