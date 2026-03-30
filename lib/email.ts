import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Use a verified domain in production. For testing, Resend allows onboarding@resend.dev.
const FROM = process.env.FROM_EMAIL ?? 'BillPing <onboarding@resend.dev>'

type ReminderPayload = {
  to: string
  clientName: string
  amount: number
  dueDate: string | null
  invoiceUrl: string
  reminderNumber: 1 | 2 | 3
}

const subjects: Record<number, string> = {
  1: 'Friendly reminder: invoice payment due',
  2: 'Following up on your invoice',
  3: 'Final notice: invoice payment overdue',
}

const tones: Record<number, { heading: string; body: string; cta: string; color: string }> = {
  1: {
    heading: 'Just a friendly reminder 👋',
    body: `Hope you're doing well! This is a gentle nudge about the invoice below. If you've already arranged payment, please ignore this — and thank you!`,
    cta: 'View & Pay Invoice',
    color: '#3b82f6',
  },
  2: {
    heading: 'Following up on your invoice',
    body: `We noticed the invoice below is still outstanding. Please take a moment to review and complete the payment at your earliest convenience.`,
    cta: 'Pay Invoice Now',
    color: '#f59e0b',
  },
  3: {
    heading: 'Final notice — action required',
    body: `This is a final reminder that the invoice below is overdue. Please settle the payment as soon as possible to avoid any disruption to your services.`,
    cta: 'Pay Now',
    color: '#ef4444',
  },
}

function buildHtml(payload: ReminderPayload): string {
  const { clientName, amount, dueDate, invoiceUrl, reminderNumber } = payload
  const tone = tones[reminderNumber]
  const formattedAmount = `₹${Number(amount).toLocaleString('en-IN')}`
  const formattedDue = dueDate
    ? new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'No due date set'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

        <!-- Header -->
        <tr>
          <td style="background:${tone.color};padding:24px 32px;">
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
              Bill<span style="opacity:0.85">Ping</span>
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111827;">${tone.heading}</p>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">Hi ${clientName},<br><br>${tone.body}</p>

            <!-- Invoice details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
              <tr>
                <td style="font-size:13px;color:#6b7280;padding-bottom:10px;">Amount due</td>
                <td align="right" style="font-size:22px;font-weight:700;color:#111827;padding-bottom:10px;">${formattedAmount}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:10px;">Due date</td>
                <td align="right" style="font-size:13px;color:#374151;border-top:1px solid #e5e7eb;padding-top:10px;">${formattedDue}</td>
              </tr>
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <a href="${invoiceUrl}" style="display:inline-block;background:${tone.color};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">
                    ${tone.cta} →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #f3f4f6;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">
              Sent via BillPing · If you've already paid, please ignore this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendReminder(payload: ReminderPayload) {
  const subject = subjects[payload.reminderNumber]

  const { error } = await resend.emails.send({
    from: FROM,
    to: payload.to,
    subject,
    html: buildHtml(payload),
  })

  if (error) throw new Error(`Resend error: ${error.message}`)
}
