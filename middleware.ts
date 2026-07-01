import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

type Role = 'super_admin' | 'restaurant_admin' | 'rider' | 'customer'

const ADMIN_ROLES: Role[] = ['super_admin', 'restaurant_admin']

const ROLE_REDIRECTS: Record<Role, string> = {
  super_admin: '/super-admin',
  restaurant_admin: '/admin',
  rider: '/rider',
  customer: '/dashboard',
}

function redirectTo(
  request: NextRequest,
  pathname: string,
  sessionResponse?: NextResponse,
) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  const redirectResponse = NextResponse.redirect(url)
  // Carry session cookies onto the redirect so the destination page
  // can reconstruct the Supabase session from cookies() in next/headers.
  if (sessionResponse) {
    for (const cookie of sessionResponse.cookies.getAll()) {
      redirectResponse.cookies.set(cookie)
    }
  }
  return redirectResponse
}

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isSuperAdminRoute = pathname.startsWith('/super-admin')
  const isRiderRoute = pathname.startsWith('/rider')
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isAuthRedirect = pathname === '/auth/redirect'

  if (!isAdminRoute && !isSuperAdminRoute && !isRiderRoute && !isDashboardRoute && !isAuthRedirect) {
    return response
  }

  // Unauthenticated — redirect to login (no session cookies needed)
  if (!user) {
    return redirectTo(request, '/login')
  }

  // Fetch role from the profiles table (one query, shared across all route checks)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: Role }>()

  const role = profile?.role

  // /auth/redirect: resolve the correct home page for this role
  if (isAuthRedirect) {
    return redirectTo(
      request,
      ROLE_REDIRECTS[role ?? 'customer'] ?? '/dashboard',
      response,
    )
  }

  if (isAdminRoute && !ADMIN_ROLES.includes(role!)) {
    return redirectTo(request, '/unauthorized', response)
  }

  if (isSuperAdminRoute && role !== 'super_admin') {
    return redirectTo(request, '/dashboard', response)
  }

  if (isRiderRoute && role !== 'rider') {
    return redirectTo(request, '/unauthorized', response)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public image files
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
