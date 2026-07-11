import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export async function GET() {
  try {
    // Tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        link VARCHAR(500),
        reward_amount DECIMAL(10,2) DEFAULT 10,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // User tasks completion
    await sql`
      CREATE TABLE IF NOT EXISTS user_tasks (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id),
        task_id INT NOT NULL REFERENCES tasks(id),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, task_id)
      )
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Tasks tables ban gayi!' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}