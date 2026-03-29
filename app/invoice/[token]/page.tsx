'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function InvoicePage() {
  const { token } = useParams()
  const [invoice, setInvoice] = useState<any>(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('public_token', token)
        .single()

      setInvoice(data)
    }

    fetchInvoice()
  }, [token])

  const markPaid = async () => {
    await fetch('/api/invoice/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })

    alert('Marked as paid')
    window.location.reload()
  }

  if (!invoice) return <div className="p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[420px]">
        
        <h1 className="text-2xl font-bold mb-6 text-center">
          Invoice
        </h1>

        <div className="space-y-2 text-gray-700">
          <p><strong>Client:</strong> {invoice.client_name}</p>
          <p><strong>Email:</strong> {invoice.client_email}</p>
          <p><strong>Amount:</strong> ₹{invoice.amount}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 font-semibold ${
              invoice.status === 'paid' ? 'text-green-600' : 'text-red-500'
            }`}>
              {invoice.status}
            </span>
          </p>
        </div>

        {invoice.status !== 'paid' && (
          <button
            onClick={markPaid}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          >
            Mark as Paid
          </button>
        )}

      </div>
    </div>
  )
}