'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CreateInvoicePage() {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    description: '',
    amount: '',
    due_date: '',
    upi_id: '',
  })

  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLink('')
    setLoading(true)

    try {
      const res = await fetch('/api/invoice/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok || !data.token) {
        setError(data.error ?? 'Failed to create invoice. Please try again.')
        return
      }

      setLink(`${window.location.origin}/invoice/${data.token}`)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const field =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value })

  const copyLink = () => {
    navigator.clipboard.writeText(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          Bill<span className="text-blue-500">Ping</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">
          Dashboard
        </Link>
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
            <p className="text-gray-500 text-sm mt-1">Fill in the details and share the link with your client.</p>
          </div>

          {!link ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5">

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Client Name</label>
                <input
                  placeholder="Rahul Sharma"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.client_name}
                  onChange={field('client_name')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Client Email</label>
                <input
                  placeholder="rahul@example.com"
                  type="email"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.client_email}
                  onChange={field('client_email')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Description of Work
                </label>
                <textarea
                  placeholder="Logo design for website, 3 revisions included"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  value={form.description}
                  onChange={field('description')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input
                    placeholder="5000"
                    type="number"
                    min="0"
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.amount}
                    onChange={field('amount')}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.due_date}
                    onChange={field('due_date')}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Your UPI ID
                  <span className="ml-1 text-xs font-normal text-gray-400">(optional — lets clients pay via UPI)</span>
                </label>
                <input
                  placeholder="yourname@upi or 9999999999@paytm"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.upi_id}
                  onChange={field('upi_id')}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm mt-1"
              >
                {loading ? 'Creating...' : 'Create Invoice →'}
              </button>

            </div>
          ) : (
            /* Success state */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-5">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Invoice Created!</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Share this link with your client.
                </p>
              </div>

              <div className="w-full bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <p className="text-sm text-gray-600 flex-1 truncate text-left">{link}</p>
                <button
                  onClick={copyLink}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg shrink-0"
                >
                  Copy
                </button>
              </div>

              <div className="flex gap-3 w-full">
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 border border-gray-200 text-gray-700 text-sm py-2.5 rounded-xl text-center hover:bg-gray-50"
                >
                  Preview invoice
                </a>
                <button
                  onClick={() => {
                    setLink('')
                    setForm({ client_name: '', client_email: '', description: '', amount: '', due_date: '', upi_id: '' })
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2.5 rounded-xl"
                >
                  New invoice
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
