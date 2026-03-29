'use client'

export default function PayButton({ token }: { token: string }) {
  const handleClick = async () => {
    const res = await fetch('/api/invoice/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    if (res.ok) {
      window.location.reload()
    } else {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
    >
      Mark as Paid
    </button>
  )
}
