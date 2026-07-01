import Link from 'next/link'

export default function OrdersNavIcon() {
  return (
    <Link
      href="/orders"
      aria-label="My Orders"
      className="flex items-center justify-center h-9 w-9 rounded-xl text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </Link>
  )
}
