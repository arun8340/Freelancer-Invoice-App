import { supabaseServer as supabase } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const { token } = await req.json()

  const { error } = await supabase
    .from('invoices')
    .update({ status: 'paid' })
    .eq('public_token', token)

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json({ success: true })
}