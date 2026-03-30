import { supabaseServer as supabase } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const body = await req.json()
  const token = body?.token

  if (!token || typeof token !== 'string') {
    return Response.json({ error: 'Invalid token' }, { status: 400 })
  }

  const { error } = await supabase
    .from('invoices')
    .update({ status: 'paid' })
    .eq('public_token', token)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
