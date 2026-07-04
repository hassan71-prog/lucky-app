import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    await sql`ALTER TABLE prizes ADD COLUMN IF NOT EXISTS description TEXT`;
    await sql`ALTER TABLE prizes ADD COLUMN IF NOT EXISTS prize_image VARCHAR(255)`;

    return Response.json({ 
      success: true, 
      message: 'Database update ho gaya!' 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}