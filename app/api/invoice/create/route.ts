import { supabaseServer } from '@/lib/supabase-server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const token = uuidv4()

    const { data, error } = await supabaseServer
      .from('invoices')
      .insert([
        {
          client_name: body.client_name,
          client_email: body.client_email,
          description: body.description || null,
          amount: body.amount,
          due_date: body.due_date || null,
          public_token: token,
          status: 'pending',
        }
      ])
      .select()

    if (error) {
      console.error('[invoice/create] supabase error:', error)
      return Response.json({ error: error.message, details: error }, { status: 500 })
    }

    return Response.json({ token, data })
  } catch (err) {
    console.error('[invoice/create] unexpected error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}