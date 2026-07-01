import { resolveAdmin } from '@/lib/admin/resolve-admin'
import AdminSidebar from './admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { restaurantName } = await resolveAdmin()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar restaurantName={restaurantName} />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  )
}
