import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireApiAdmin } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const authResult = await requireApiAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const result = await query(`
      SELECT 
        t.id,
        t.user_id,
        t.recipient_id,
        t.type,
        t.amount,
        t.description,
        t.reference,
        t.status,
        t.reported,
        t.risk_score,
        t.created_at,
        u.name as user_name,
        r.name as recipient_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN users r ON t.recipient_id = r.id
      ORDER BY t.created_at DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions. Please try again.' },
      { status: 500 }
    )
  }
} 