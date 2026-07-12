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
    href: '/super-admin',
    exact: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: 'Restaurants',
    href: '/super-admin/restaurants',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    label: 'Inquiries',
    href: '/super-admin/inquiries',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
          ? 'bg-[#E8471E]/10 text-[#C93D18] font-semibold'
          : 'text-gray-600 hover:bg-[#FAFAF8] hover:text-[#1A1A2E]'
      }`}
    >
      <span className={active ? 'text-[#E8471E]' : 'text-gray-400'}>{item.icon}</span>
      {item.label}
    </Link>
  )
}

export default function SuperAdminSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile: horizontal top bar */}
      <header className="md:hidden bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#FAFAF8]">
          <span className="text-lg font-display font-bold text-[#E8471E] tracking-tight">DineFlow</span>
          <span className="text-xs font-medium text-gray-500">Platform Admin</span>
        </div>
        <nav className="flex gap-1 px-3 py-2 overflow-x-auto">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  active ? 'bg-[#E8471E] text-white' : 'text-gray-500 hover:bg-gray-100'
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
        <div className="px-5 pt-6 pb-5 border-b border-[#FAFAF8]">
          <div className="text-xl font-display font-bold text-[#E8471E] tracking-tight mb-1">DineFlow</div>
          <div className="text-xs font-medium text-gray-500 leading-snug">Platform Admin</div>
        </div>

        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="p-4 border-t border-[#FAFAF8]">
          <span className="text-xs text-gray-400">Super Admin</span>
        </div>
      </aside>
    </>
  )
}
