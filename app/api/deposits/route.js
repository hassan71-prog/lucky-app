import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return Response.json({ 
        success: false, 
        message: 'Login karein!' 
      });
    }

    const { amount, payment_method, transaction_id } = await request.json();

    await sql`
      INSERT INTO deposits (user_id, amount, payment_method, transaction_id)
      VALUES (${userId}, ${amount}, ${payment_method}, ${transaction_id})
    `;

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return Response.json({ 
        success: false, 
        message: 'Login karein!' 
      });
    }

    const deposits = await sql`
      SELECT * FROM deposits 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    return Response.json({ success: true, deposits });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}