'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  UtensilsCrossed,
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Package,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
    icon: <LayoutDashboard className="h-[18px] w-[18px]" strokeWidth={2} />,
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: <ClipboardList className="h-[18px] w-[18px]" strokeWidth={2} />,
  },
  {
    label: 'Menu',
    href: '/admin/menu',
    icon: <BookOpen className="h-[18px] w-[18px]" strokeWidth={2} />,
  },
  {
    label: 'Inventory',
    href: '/admin/inventory',
    icon: <Package className="h-[18px] w-[18px]" strokeWidth={2} />,
  },
]

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#1A1A2E] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
      {label}
    </span>
  )
}

function NavLink({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem
  pathname: string
  collapsed: boolean
}) {
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
  return (
    <div className="group relative w-full">
      <Link
        href={item.href}
        className={`flex items-center rounded-xl text-sm font-medium transition-colors ${
          collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
        } ${
          active
            ? 'bg-[#E8471E] text-white font-semibold'
            : 'text-gray-600 hover:bg-[#E8471E]/10 hover:text-[#C93D18]'
        }`}
      >
        <span className={active ? 'text-white' : 'text-gray-400 group-hover:text-[#E8471E]'}>{item.icon}</span>
        {!collapsed && item.label}
      </Link>
      {collapsed && <Tooltip label={item.label} />}
    </div>
  )
}

export default function AdminSidebar({ restaurantName }: { restaurantName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile: horizontal top bar */}
      <header className="md:hidden bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#FAFAF8]">
          <span className="text-lg font-display font-bold text-[#E8471E] tracking-tight">DineFlow</span>
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
      <aside
        className={`hidden md:flex flex-col shrink-0 min-h-screen bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-56'
        }`}
      >
        <div className={`border-b border-[#FAFAF8] ${collapsed ? 'px-3 py-4' : 'px-5 pt-6 pb-5'}`}>
          <div className={`flex items-center ${collapsed ? 'flex-col gap-3' : 'justify-between gap-2'}`}>
            {collapsed ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8471E] text-white shrink-0">
                <UtensilsCrossed className="h-5 w-5" strokeWidth={2} />
              </div>
            ) : (
              <div className="min-w-0">
                <div className="text-xl font-display font-bold text-[#E8471E] tracking-tight mb-1">DineFlow</div>
                <div className="text-xs font-medium text-gray-500 leading-snug truncate" title={restaurantName}>
                  {restaurantName}
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <nav className={`flex flex-col gap-0.5 flex-1 ${collapsed ? 'items-center p-2' : 'p-3'}`}>
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
          ))}
        </nav>

        <div className={`border-t border-[#FAFAF8] ${collapsed ? 'p-2' : 'p-3'}`}>
          <div className="group relative w-full">
            <button
              onClick={handleLogout}
              className={`flex w-full items-center rounded-xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors ${
                collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
              }`}
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
              {!collapsed && 'Logout'}
            </button>
            {collapsed && <Tooltip label="Logout" />}
          </div>
        </div>
      </aside>
    </>
  )
}
