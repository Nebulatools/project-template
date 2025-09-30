export const authRoutes = {
  login: '/auth/login',
  register: '/auth/register',
  passwordReset: '/auth/password-reset',
  passwordUpdate: '/auth/password-update',
  profile: '/auth/profile',
  logout: '/auth/logout'
} as const

export const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings'
]

export const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/password-reset',
  '/auth/password-update'
]

export const authRedirects = {
  afterLogin: '/dashboard',
  afterLogout: '/auth/login',
  afterRegister: '/auth/login',
  afterPasswordReset: '/auth/login',
  requireAuth: '/auth/login'
} as const

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname)
}

export function isAuthRoute(pathname: string): boolean {
  return ['/auth/login', '/auth/register', '/auth/password-reset', '/auth/password-update'].includes(pathname)
}

export function getRedirectUrl(key: keyof typeof authRedirects): string {
  return authRedirects[key]
}
