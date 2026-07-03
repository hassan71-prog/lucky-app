import { createTables } from '@/lib/db';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await createTables();
    
    // Default admin banana
    const sql = neon(process.env.POSTGRES_URL);
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await sql`
      INSERT INTO admins (username, password)
      VALUES ('admin', ${hashedPassword})
      ON CONFLICT DO NOTHING
    `;

    return Response.json({ 
      success: true, 
      message: 'Tables ban gayi aur admin create ho gaya!' 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}