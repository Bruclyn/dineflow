'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
  label: string
  href: string
  exact?: boolean
  icon: React.ReactNode
}

const NAV: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    exact: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: 'Menu',
    href: '/admin/menu',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: 'Inventory',
    href: '/admin/inventory',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
]

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-orange-50 text-orange-600 font-semibold'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className={active ? 'text-orange-500' : 'text-gray-400'}>{item.icon}</span>
      {item.label}
    </Link>
  )
}

export default function AdminSidebar({ restaurantName }: { restaurantName: string }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile: horizontal top bar */}
      <header className="md:hidden bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <span className="text-lg font-bold text-orange-500 tracking-tight">DineFlow</span>
          <span className="text-xs font-medium text-gray-500 truncate max-w-[180px]">{restaurantName}</span>
        </div>
        <nav className="flex gap-1 px-3 py-2 overflow-x-auto">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  active ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Desktop: left sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 min-h-screen bg-white border-r border-gray-100">
        <div className="px-5 pt-6 pb-5 border-b border-gray-50">
          <div className="text-xl font-bold text-orange-500 tracking-tight mb-1">DineFlow</div>
          <div className="text-xs font-medium text-gray-500 leading-snug truncate" title={restaurantName}>
            {restaurantName}
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <span className="text-xs text-gray-400">Restaurant Admin</span>
        </div>
      </aside>
    </>
  )
}
