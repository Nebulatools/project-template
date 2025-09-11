export const authRoutes = {
  login: '/login',
  register: '/register',
  passwordReset: '/passwdReset',
  passwordUpdate: '/passwdupdate',
  profile: '/profile',
  logout: '/logout'
} as const

export const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings'
]

export const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/passwdReset',
  '/passwdupdate'
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
  return ['/login', '/register', '/passwdReset', '/passwdupdate'].includes(pathname)
}

export function getRedirectUrl(key: keyof typeof authRedirects): string {
  return authRedirects[key]
}