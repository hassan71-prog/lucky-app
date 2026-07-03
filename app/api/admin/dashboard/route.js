import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;

    if (!adminId) {
      return Response.json({ 
        success: false, 
        message: 'Admin login karein!' 
      });
    }

    // Stats
    const total_users = await sql`SELECT COUNT(*) as count FROM users`;
    const pending = await sql`SELECT COUNT(*) as count FROM deposits WHERE status='pending'`;
    const approved = await sql`SELECT COUNT(*) as count FROM deposits WHERE status='approved'`;
    const total_draws = await sql`SELECT COUNT(*) as count FROM draws`;
    const winners = await sql`SELECT COUNT(*) as count FROM prizes WHERE winner_deposit_id IS NOT NULL`;

    // Latest 5 deposits
    const latest_deposits = await sql`
      SELECT d.*, u.name, u.phone 
      FROM deposits d 
      JOIN users u ON d.user_id = u.id 
      ORDER BY d.created_at DESC 
      LIMIT 5
    `;

    return Response.json({
      success: true,
      stats: {
        total_users: total_users[0].count,
        pending: pending[0].count,
        approved: approved[0].count,
        total_draws: total_draws[0].count,
        winners: winners[0].count,
      },
      latest_deposits
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}