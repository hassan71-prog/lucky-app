import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS deposits (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id),
      amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(20) NOT NULL,
      transaction_id VARCHAR(100),
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS draws (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      draw_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'upcoming',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS prizes (
      id SERIAL PRIMARY KEY,
      draw_id INT NOT NULL REFERENCES draws(id),
      card_amount DECIMAL(10,2) NOT NULL,
      prize_description VARCHAR(255) NOT NULL,
      prize_image VARCHAR(255),
      winner_deposit_id INT REFERENCES deposits(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;
}

export default sql;