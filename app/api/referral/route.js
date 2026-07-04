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

    // User ka referral code
    const users = await sql`
      SELECT referral_code FROM users WHERE id = ${userId}
    `;

    let referralCode = users[0]?.referral_code;

    // Agar referral code nahi hai to banao
    if (!referralCode) {
      referralCode = 'REF' + userId + Math.random().toString(36).substring(2, 6).toUpperCase();
      await sql`
        UPDATE users SET referral_code = ${referralCode} WHERE id = ${userId}
      `;
    }

    // Kitne referrals hain
    const referrals = await sql`
      SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ${userId}
    `;

    const referralCount = parseInt(referrals[0].count);

    // Agar 5 referrals ho gayi to auto Rs.10 card add karo
    if (referralCount >= 5) {
      // Check karo pehle se card add hua hai ya nahi
      const existing = await sql`
        SELECT id FROM deposits 
        WHERE user_id = ${userId} 
        AND transaction_id = 'REFERRAL_BONUS'
        AND amount = 10
      `;

      if (existing.length === 0) {
        await sql`
          INSERT INTO deposits (user_id, amount, payment_method, transaction_id, status)
          VALUES (${userId}, 10, 'referral', 'REFERRAL_BONUS', 'approved')
        `;
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      referral_code: referralCode,
      referral_count: referralCount,
      referral_link: `https://lucky-app-five.vercel.app/register?ref=${referralCode}`
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