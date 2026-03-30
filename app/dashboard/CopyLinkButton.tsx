'use client'

import { useState } from 'react'

export default function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invoice/${token}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-blue-500 hover:text-blue-700 underline"
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}
