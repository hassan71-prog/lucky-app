import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Login karein!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sare active tasks
    const tasks = await sql`
      SELECT t.*, 
        CASE WHEN ut.id IS NOT NULL THEN ut.status ELSE 'not_started' END as user_status
      FROM tasks t
      LEFT JOIN user_tasks ut ON t.id = ut.task_id AND ut.user_id = ${userId}
      WHERE t.is_active = true
      ORDER BY t.created_at DESC
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      tasks 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Login karein!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { task_id } = await request.json();

    // Check already done
    const existing = await sql`
      SELECT id FROM user_tasks 
      WHERE user_id = ${userId} AND task_id = ${task_id}
    `;

    if (existing.length > 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Yeh task pehle se complete hai!' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Task complete mark karo
    await sql`
      INSERT INTO user_tasks (user_id, task_id, status)
      VALUES (${userId}, ${task_id}, 'pending')
    `;

    // Task ka reward amount lo
    const task = await sql`
      SELECT reward_amount FROM tasks WHERE id = ${task_id}
    `;

    // Free card add karo
    await sql`
      INSERT INTO deposits (user_id, amount, payment_method, transaction_id, status)
      VALUES (${userId}, ${task[0].reward_amount}, 'task', 'TASK_REWARD_${task_id}', 'pending')
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Task complete! Admin verify karega aur card approve karega.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}