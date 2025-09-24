export const authRoutes = {
  login: '/login',
  register: '/register',
  passwordReset: '/password-reset',
  passwordUpdate: '/password-update',
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
  '/password-reset',
  '/password-update'
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
  return ['/login', '/register', '/password-reset', '/password-update'].includes(pathname)
}

export function getRedirectUrl(key: keyof typeof authRedirects): string {
  return authRedirects[key]
}

export const appRoutes = {
  home: '/',
  dashboard: '/dashboard',
  settings: '/settings',
  ...authRoutes
} as const

export const allProtectedRoutes = [
  ...protectedRoutes
]

export const allPublicRoutes = [
  ...publicRoutes
]

export const redirects = {
  ...authRedirects,
  default: '/',
  notFound: '/404',
  serverError: '/500'
} as const

export interface RouteConfig {
  path: string
  isProtected: boolean
  requiresAuth: boolean
  redirectTo?: string
}

export const routeConfig: Record<string, RouteConfig> = {
  '/': {
    path: '/',
    isProtected: false,
    requiresAuth: false
  },
  '/dashboard': {
    path: '/dashboard',
    isProtected: true,
    requiresAuth: true,
    redirectTo: '/login'
  },
  '/login': {
    path: '/login',
    isProtected: false,
    requiresAuth: false
  },
  '/register': {
    path: '/register',
    isProtected: false,
    requiresAuth: false
  },
  '/profile': {
    path: '/profile',
    isProtected: true,
    requiresAuth: true,
    redirectTo: '/login'
  }
}

export function getRouteConfig(pathname: string): RouteConfig | null {
  return routeConfig[pathname] || null
}

export function shouldRedirect(
  pathname: string, 
  isAuthenticated: boolean
): string | null {
  const config = getRouteConfig(pathname)
  
  if (!config) {
    return null
  }
  
  if (config.requiresAuth && !isAuthenticated && config.redirectTo) {
    return config.redirectTo
  }
  
  if (isAuthRoute(pathname) && isAuthenticated && pathname !== '/profile') {
    return redirects.afterLogin
  }
  
  return null
}

export function validateRoute(pathname: string): boolean {
  return allPublicRoutes.includes(pathname) || 
         allProtectedRoutes.some(route => pathname.startsWith(route))
}

export type AppRoute = keyof typeof appRoutes
export type ProtectedRoute = typeof allProtectedRoutes[number]
export type PublicRoute = typeof allPublicRoutes[number]
export type RedirectKey = keyof typeof redirects
