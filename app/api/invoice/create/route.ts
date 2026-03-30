import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const { client_name, client_email, amount, description, due_date, upi_id } = body

    // Basic input validation
    if (!client_name?.trim()) {
      return Response.json({ error: 'Client name is required' }, { status: 400 })
    }
    if (!client_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client_email)) {
      return Response.json({ error: 'A valid client email is required' }, { status: 400 })
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return Response.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    const token = uuidv4()

    const { data, error } = await supabase
      .from('invoices')
      .insert([
        {
          user_id: user.id,
          client_name: client_name.trim(),
          client_email: client_email.trim().toLowerCase(),
          description: description?.trim() || null,
          amount: Number(amount),
          due_date: due_date || null,
          upi_id: upi_id?.trim() || null,
          public_token: token,
          status: 'pending',
        }
      ])
      .select()

    if (error) {
      console.error('[invoice/create] supabase error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ token, data })
  } catch (err) {
    console.error('[invoice/create] unexpected error:', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
