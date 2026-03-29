import { supabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import PayButton from './PayButton'

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-105">
        <h1 className="text-2xl font-bold mb-6 text-center">Invoice</h1>

        <div className="space-y-2 text-gray-700">
          <p><strong>Client:</strong> {invoice.client_name}</p>
          <p><strong>Email:</strong> {invoice.client_email}</p>
          {invoice.description && (
            <p><strong>Description:</strong> {invoice.description}</p>
          )}
          <p><strong>Amount:</strong> ₹{invoice.amount}</p>
          {invoice.due_date && (
            <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString('en-IN')}</p>
          )}
          <p>
            <strong>Status:</strong>
            <span className={`ml-2 font-semibold ${
              invoice.status === 'paid' ? 'text-green-600' : 'text-red-500'
            }`}>
              {invoice.status}
            </span>
          </p>
        </div>

        {invoice.status !== 'paid' && <PayButton token={token} />}
      </div>
    </div>
  )
}
