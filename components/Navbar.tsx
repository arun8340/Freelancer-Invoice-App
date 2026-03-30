import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
        Bill<span className="text-blue-500">Ping</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/create"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
            >
              + New Invoice
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800">
              Log in
            </Link>
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
