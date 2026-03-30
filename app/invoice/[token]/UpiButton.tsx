'use client'

import { useState } from 'react'

type Props = {
  upiId: string
  amount: number
  description: string | null
}

const UPI_APPS = [
  {
    name: 'GPay',
    url: (upiId: string, amount: number, note: string) =>
      `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=BillPing&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: 'PhonePe',
    url: (upiId: string, amount: number, note: string) =>
      `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=BillPing&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: 'Paytm',
    url: (upiId: string, amount: number, note: string) =>
      `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=BillPing&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
]

export default function UpiButton({ upiId, amount, description }: Props) {
  const [copied, setCopied] = useState(false)

  const note = description ?? 'Invoice Payment'

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-6 flex flex-col gap-3">

      {/* UPI ID copy — works on all devices */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex flex-col gap-3">
        <p className="text-xs font-medium text-green-700 text-center">Pay via UPI</p>

        <div className="flex items-center justify-between bg-white border border-green-200 rounded-lg px-3 py-2.5">
          <span className="text-sm font-mono text-gray-800 truncate">{upiId}</span>
          <button
            onClick={copyUpiId}
            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg ml-3 shrink-0"
          >
            {copied ? '✓ Copied!' : 'Copy ID'}
          </button>
        </div>

        {/* Direct app links — only useful on mobile */}
        <div className="flex gap-2">
          {UPI_APPS.map((app) => (
            <a
              key={app.name}
              href={app.url(upiId, amount, note)}
              className="flex-1 text-center text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-lg"
            >
              {app.name}
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center">
          Copy UPI ID · or tap an app to open directly on mobile
        </p>
      </div>

    </div>
  )
}
