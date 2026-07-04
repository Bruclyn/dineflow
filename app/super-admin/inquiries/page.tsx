import { resolveSuperAdmin } from '@/lib/admin/resolve-super-admin'
import { createClient } from '@/lib/supabase/server'
import InquiryStatusSelect, { type InquiryStatus } from './inquiry-status-select'

type Inquiry = {
  id: string
  restaurant_name: string
  owner_name: string
  phone: string | null
  email: string | null
  city: string | null
  description: string | null
  status: InquiryStatus
  created_at: string
}

const STATUS_COLOURS: Record<InquiryStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

export default async function SuperAdminInquiriesPage() {
  await resolveSuperAdmin()
  const supabase = await createClient()

  const { data } = await supabase
    .from('partnership_inquiries')
    .select('id, restaurant_name, owner_name, phone, email, city, description, status, created_at')
    .order('created_at', { ascending: false })

  const inquiries = (data ?? []) as Inquiry[]

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Partner Inquiries</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {inquiries.length} inquir{inquiries.length !== 1 ? 'ies' : 'y'} total
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-24 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No inquiries yet</p>
          <p className="text-xs text-gray-400 mt-1">Partner applications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </main>
  )
}

function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const submittedAt = new Date(inquiry.created_at).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-4 sm:p-5">
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header row */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-900">{inquiry.restaurant_name}</h3>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOURS[inquiry.status] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {inquiry.status}
          </span>
          {inquiry.city && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <span>📍</span>
              {inquiry.city}
            </span>
          )}
          <span className="text-xs text-gray-400 sm:ml-auto">{submittedAt}</span>
        </div>

        {/* Owner + contact */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{inquiry.owner_name}</span>
          {inquiry.phone && (
            <a href={`tel:${inquiry.phone}`} className="hover:text-orange-500 transition-colors">
              📞 {inquiry.phone}
            </a>
          )}
          {inquiry.email && (
            <a href={`mailto:${inquiry.email}`} className="hover:text-orange-500 transition-colors">
              ✉️ {inquiry.email}
            </a>
          )}
        </div>

        {/* Description */}
        {inquiry.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{inquiry.description}</p>
        )}
      </div>

      {/* Status control */}
      <div className="shrink-0 w-full sm:w-36">
        <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} />
      </div>
    </div>
  )
}
