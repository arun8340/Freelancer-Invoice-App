import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const token = uuidv4()

    const { data, error } = await supabase
      .from('invoices')
      .insert([
        {
          client_name: body.client_name,
          client_email: body.client_email,
          amount: body.amount,
          due_date: body.due_date || null,
          public_token: token,
          status: 'pending'
        }
      ])
      .select()

    if (error) throw error

    return Response.json({ token, data })
  } catch (err) {
    return Response.json({ error: err }, { status: 500 })
  }
}