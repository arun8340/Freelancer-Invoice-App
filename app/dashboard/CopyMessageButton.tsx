'use client'

import { useState } from 'react'

type Props = {
  clientName: string
  amount: number
  description: string | null
  dueDate: string | null
  token: string
}

export default function CopyMessageButton({ clientName, amount, description, dueDate, token }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const url = `${window.location.origin}/invoice/${token}`
    const due = dueDate
      ? new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
      : null

    const message = [
      `Hi ${clientName}! 👋`,
      ``,
      `This is a friendly reminder for your pending invoice:`,
      description ? `📋 ${description}` : null,
      `💰 Amount: ₹${Number(amount).toLocaleString('en-IN')}`,
      due ? `📅 Due: ${due}` : null,
      ``,
      `You can view and pay here:`,
      url,
      ``,
      `Thank you! 🙏`,
    ]
      .filter((line) => line !== null)
      .join('\n')

    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-green-600 hover:text-green-700 underline"
    >
      {copied ? '✓ Copied!' : 'WhatsApp msg'}
    </button>
  )
}
