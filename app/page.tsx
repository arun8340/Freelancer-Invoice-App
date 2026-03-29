'use client'

import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    amount: ''
  })

  const [link, setLink] = useState('')

  const handleSubmit = async () => {
    const res = await fetch('/api/invoice/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    setLink(`/invoice/${data.token}`)
  }

  return (
    <div className="p-10 flex flex-col gap-4 max-w-md">
      <h1 className="text-xl font-bold">Create Invoice</h1>

      <input
        placeholder="Client Name"
        className="border p-2"
        onChange={(e) =>
          setForm({ ...form, client_name: e.target.value })
        }
      />

      <input
        placeholder="Client Email"
        className="border p-2"
        onChange={(e) =>
          setForm({ ...form, client_email: e.target.value })
        }
      />

      <input
        placeholder="Amount"
        className="border p-2"
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Create Invoice
      </button>

      {link && (
        <div className="mt-4">
          <p className="text-green-600">Invoice Created!</p>
          <a href={link} className="text-blue-500 underline">
            {link}
          </a>
        </div>
      )}
    </div>
  )
}