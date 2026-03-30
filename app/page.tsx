import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
          Built for freelancers
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight max-w-2xl mb-5">
          Get paid faster —{' '}
          <span className="text-blue-500">without chasing clients</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-xl mb-10">
          Create a professional invoice in seconds. Share a link. BillPing automatically
          reminds your client so you never have to send that awkward follow-up again.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/create"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-sm"
          >
            Create your first invoice →
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2"
          >
            View dashboard
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create invoice',
                desc: 'Fill in client name, work description, amount, and due date. Takes 30 seconds.',
              },
              {
                step: '02',
                title: 'Share the link',
                desc: 'Send the unique payment link to your client via WhatsApp, email, or any way you like.',
              },
              {
                step: '03',
                title: 'Get paid',
                desc: 'BillPing sends automatic reminders at Day 3, 7, and 14 — so you never have to follow up.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-3">
                <span className="text-3xl font-black text-blue-100">{step}</span>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Everything a freelancer needs
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                icon: '🔔',
                title: 'Auto reminders',
                desc: 'Friendly follow-ups sent automatically on Day 3, 7, and 14. You do nothing.',
              },
              {
                icon: '📊',
                title: 'Dashboard',
                desc: 'See all pending, overdue, and paid invoices at a glance. Know exactly where your money is.',
              },
              {
                icon: '🔗',
                title: 'Shareable links',
                desc: 'Every invoice gets a unique link. Send it anywhere — WhatsApp, email, Instagram DM.',
              },
              {
                icon: '✅',
                title: 'Payment confirmation',
                desc: "Client marks the invoice as paid. You get the confirmation. No awkward 'did you pay?' messages.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-6 flex flex-col gap-2">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-500 px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Stop chasing. Start earning.
        </h2>
        <p className="text-blue-100 mb-8 text-sm">
          Create your first invoice in 30 seconds — free.
        </p>
        <Link
          href="/create"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-blue-50"
        >
          Create Invoice →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} BillPing · Built for freelancers
      </footer>

    </div>
  )
}
