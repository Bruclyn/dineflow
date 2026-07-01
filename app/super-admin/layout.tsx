import { resolveSuperAdmin } from '@/lib/admin/resolve-super-admin'
import SuperAdminSidebar from './super-admin-sidebar'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await resolveSuperAdmin()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <SuperAdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  )
}
