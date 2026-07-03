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

    const deposits = await sql`
      SELECT d.*, u.name, u.phone 
      FROM deposits d 
      JOIN users u ON d.user_id = u.id 
      ORDER BY d.created_at DESC
    `;

    return Response.json({ success: true, deposits });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;

    if (!adminId) {
      return Response.json({ 
        success: false, 
        message: 'Admin login karein!' 
      });
    }

    const { id, action } = await request.json();
    const status = action === 'approve' ? 'approved' : 'rejected';

    await sql`
      UPDATE deposits SET status = ${status} WHERE id = ${id}
    `;

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}