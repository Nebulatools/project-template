import { 
  authRoutes, 
  protectedRoutes, 
  publicRoutes, 
  authRedirects,
  isProtectedRoute,
  isPublicRoute,
  isAuthRoute,
  getRedirectUrl
} from './lib/auth-routes'

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
    redirectTo: '/auth/login'
  },
  '/auth/login': {
    path: '/auth/login',
    isProtected: false,
    requiresAuth: false
  },
  '/auth/register': {
    path: '/auth/register',
    isProtected: false,
    requiresAuth: false
  },
  '/auth/profile': {
    path: '/auth/profile',
    isProtected: true,
    requiresAuth: true,
    redirectTo: '/auth/login'
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
  
  if (isAuthRoute(pathname) && isAuthenticated && pathname !== '/auth/profile') {
    return redirects.afterLogin
  }
  
  return null
}

export function validateRoute(pathname: string): boolean {
  return allPublicRoutes.includes(pathname) || 
         allProtectedRoutes.some(route => pathname.startsWith(route))
}

export {
  isProtectedRoute,
  isPublicRoute,
  isAuthRoute,
  getRedirectUrl
}

export type AppRoute = keyof typeof appRoutes
export type ProtectedRoute = typeof allProtectedRoutes[number]
export type PublicRoute = typeof allPublicRoutes[number]
export type RedirectKey = keyof typeof redirects