import { supabaseServer } from '@/lib/supabase-server'
import CopyLinkButton from './CopyLinkButton'
import CopyMessageButton from './CopyMessageButton'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — BillPing',
}

type Invoice = {
  id: string
  client_name: string
  client_email: string
  description: string | null
  amount: number
  due_date: string | null
  status: 'pending' | 'paid'
  public_token: string
  created_at: string
}

function isOverdue(invoice: Invoice): boolean {
  if (invoice.status === 'paid') return false
  if (!invoice.due_date) return false
  return new Date(invoice.due_date) < new Date(new Date().toDateString())
}

export default async function DashboardPage() {
  const { data: invoices } = await supabaseServer
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  const all: Invoice[] = invoices ?? []

  const totalPending = all
    .filter((i) => i.status === 'pending')
    .reduce((sum, i) => sum + Number(i.amount), 0)

  const overdueCount = all.filter(isOverdue).length
  const paidCount = all.filter((i) => i.status === 'paid').length
  const pendingCount = all.filter((i) => i.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          Bill<span className="text-blue-500">Ping</span>
        </Link>
        <Link
          href="/create"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          + New Invoice
        </Link>
      </nav>

      <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalPending.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400 mt-1">{pendingCount} invoice{pendingCount !== 1 ? 's' : ''}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Overdue</p>
            <p className={`text-2xl font-bold ${overdueCount > 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {overdueCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">past due date</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Paid</p>
            <p className="text-2xl font-bold text-green-600">{paidCount}</p>
            <p className="text-xs text-gray-400 mt-1">invoice{paidCount !== 1 ? 's' : ''} collected</p>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {all.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No invoices yet.{' '}
              <Link href="/" className="text-blue-500 underline">Create one</Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Client</th>
                  <th className="text-left p-4 font-medium text-gray-500">Description</th>
                  <th className="text-right p-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left p-4 font-medium text-gray-500">Due</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {all.map((invoice) => {
                  const overdue = isOverdue(invoice)
                  return (
                    <tr key={invoice.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{invoice.client_name}</p>
                        <p className="text-xs text-gray-400">{invoice.client_email}</p>
                      </td>
                      <td className="p-4 text-gray-500 max-w-40 truncate">
                        {invoice.description ?? '—'}
                      </td>
                      <td className="p-4 text-right font-medium text-gray-900">
                        ₹{Number(invoice.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-gray-500">
                        {invoice.due_date
                          ? new Date(invoice.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                          : '—'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : overdue
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status === 'paid' ? 'Paid' : overdue ? 'Overdue' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5">
                          <CopyLinkButton token={invoice.public_token} />
                          {invoice.status !== 'paid' && (
                            <CopyMessageButton
                              clientName={invoice.client_name}
                              amount={invoice.amount}
                              description={invoice.description}
                              dueDate={invoice.due_date}
                              token={invoice.public_token}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
