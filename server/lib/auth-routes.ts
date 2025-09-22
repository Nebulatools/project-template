export const authRoutes = {
  login: '/auth/login',
  register: '/auth/register',
  passwordReset: '/auth/passwdReset',
  passwordUpdate: '/auth/passwdupdate',
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
  '/auth/passwdReset',
  '/auth/passwdupdate'
]

export const authRedirects = {
  afterLogin: '/dashboard',
  afterLogout: '/login',
  afterRegister: '/login',
  afterPasswordReset: '/login',
  requireAuth: '/login'
} as const

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname)
}

export function isAuthRoute(pathname: string): boolean {
  return ['/auth/login', '/auth/register', '/auth/passwdReset', '/auth/passwdupdate'].includes(pathname)
}

export function getRedirectUrl(key: keyof typeof authRedirects): string {
  return authRedirects[key]
}
