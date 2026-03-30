import { supabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PayButton from './PayButton'
import UpiButton from './UpiButton'

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const { data: invoice, error } = await supabaseServer
    .from('invoices')
    .select('*')
    .eq('public_token', token)
    .single()

  if (error || !invoice) notFound()

  const isPaid = invoice.status === 'paid'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          Bill<span className="text-blue-500">Ping</span>
        </Link>
      </nav>

      {/* Invoice card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

          {/* Status banner */}
          <div className={`rounded-xl px-4 py-3 mb-6 text-sm font-medium text-center ${
            isPaid
              ? 'bg-green-50 text-green-700'
              : 'bg-yellow-50 text-yellow-700'
          }`}>
            {isPaid ? '✅ This invoice has been paid' : '⏳ Payment pending'}
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-6">Invoice</h1>

          <div className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-500">Client</span>
              <span className="font-medium text-gray-900">{invoice.client_name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-700">{invoice.client_email}</span>
            </div>
            {invoice.description && (
              <div className="flex justify-between py-3 border-b border-gray-50 gap-4">
                <span className="text-gray-500 shrink-0">Work done</span>
                <span className="text-gray-700 text-right">{invoice.description}</span>
              </div>
            )}
            {invoice.due_date && (
              <div className="flex justify-between py-3 border-b border-gray-50">
                <span className="text-gray-500">Due date</span>
                <span className="text-gray-700">
                  {new Date(invoice.due_date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3">
              <span className="text-gray-500">Amount</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{Number(invoice.amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {!isPaid && invoice.upi_id && (
            <UpiButton
              upiId={invoice.upi_id}
              amount={invoice.amount}
              description={invoice.description}
            />
          )}
          {!isPaid && <PayButton token={token} />}

        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 py-4">
        Powered by{' '}
        <Link href="/" className="text-blue-400 hover:text-blue-500">BillPing</Link>
      </footer>

    </div>
  )
}
