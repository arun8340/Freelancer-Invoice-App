'use client'

import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    description: '',
    amount: '',
    due_date: '',
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

      setLink(`/invoice/${data.token}`)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const field = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value })

  return (
    <div className="p-10 flex flex-col gap-4 max-w-md">
      <h1 className="text-xl font-bold">Create Invoice</h1>

      <input
        placeholder="Client Name"
        className="border p-2 rounded"
        value={form.client_name}
        onChange={field('client_name')}
      />

      <input
        placeholder="Client Email"
        type="email"
        className="border p-2 rounded"
        value={form.client_email}
        onChange={field('client_email')}
      />

      <textarea
        placeholder="Description of work"
        className="border p-2 rounded resize-none"
        rows={3}
        value={form.description}
        onChange={field('description')}
      />

      <input
        placeholder="Amount (₹)"
        type="number"
        min="0"
        className="border p-2 rounded"
        value={form.amount}
        onChange={field('amount')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500">Due Date</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={form.due_date}
          onChange={field('due_date')}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white p-2 rounded"
      >
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {link && (
        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-green-700 font-medium mb-1">Invoice Created!</p>
          <a href={link} className="text-blue-500 underline break-all text-sm">
            {typeof window !== 'undefined' ? `${window.location.origin}${link}` : link}
          </a>
        </div>
      )}
    </div>
  )
}
