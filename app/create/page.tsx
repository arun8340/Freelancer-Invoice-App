import Navbar from '@/components/Navbar'
import CreateForm from './CreateForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Invoice — BillPing',
}

export default function CreateInvoicePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <CreateForm />
    </div>
  )
}
