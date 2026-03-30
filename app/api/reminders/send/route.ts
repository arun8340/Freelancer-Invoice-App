import { supabaseServer } from '@/lib/supabase-server'
import { sendReminder } from '@/lib/email'

// Called daily by the Vercel cron job (vercel.json) via GET.
// Also accepts POST for manual testing.
// Protected by CRON_SECRET — unauthorized requests are rejected.
async function handler(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronHeader = req.headers.get('x-cron-secret')
  const bearerSecret = authHeader?.replace('Bearer ', '')

  if (bearerSecret !== process.env.CRON_SECRET && cronHeader !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  // testMode bypasses the day check — only allowed in development
  const testMode =
    process.env.NODE_ENV === 'development' &&
    new URL(req.url).searchParams.get('test') === 'true'

  const now = new Date()

  // Fetch all pending invoices that haven't had all 3 reminders yet
  const { data: invoices, error } = await supabaseServer
    .from('invoices')
    .select('id, client_name, client_email, amount, due_date, public_token, reminders_sent, created_at')
    .eq('status', 'pending')
    .or('reminders_sent.lt.3,reminders_sent.is.null')

  if (error) {
    console.error('[reminders] fetch error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  const results = { sent: 0, skipped: 0, failed: 0 }

  for (const invoice of invoices ?? []) {
    const created = new Date(invoice.created_at)
    const daysSinceCreated = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))

    // Determine if this invoice is due for a reminder
    const nextReminder = ((invoice.reminders_sent ?? 0) + 1) as 1 | 2 | 3
    const triggerDays: Record<number, number> = { 1: 3, 2: 7, 3: 14 }
    const requiredDays = triggerDays[nextReminder]

    if (!testMode && daysSinceCreated < requiredDays) {
      results.skipped++
      continue
    }

    try {
      await sendReminder({
        to: invoice.client_email,
        clientName: invoice.client_name,
        amount: invoice.amount,
        dueDate: invoice.due_date,
        invoiceUrl: `${appUrl}/invoice/${invoice.public_token}`,
        reminderNumber: nextReminder,
      })

      // Mark reminder as sent
      await supabaseServer
        .from('invoices')
        .update({ reminders_sent: nextReminder })
        .eq('id', invoice.id)

      results.sent++
      console.log(`[reminders] sent reminder ${nextReminder} to ${invoice.client_email}`)
    } catch (err) {
      results.failed++
      console.error(`[reminders] failed for invoice ${invoice.id}:`, err)
    }
  }

  return Response.json({ ok: true, ...results })
}

export const GET = handler
export const POST = handler
