import { 
  User, 
  LoginData, 
  RegisterData, 
  PasswordResetData, 
  PasswordUpdateData, 
  ProfileData,
  AuthResponse,
  AuthError
} from '../../types/auth/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
const AUTH_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'

export class AuthService {
  private static instance: AuthService
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = this.getToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error: AuthError = await response.json()
        throw new Error(error.message || 'Error en la peticiÃƒÆ’Ã‚Â³n')
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Error de red')
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    this.setAuthData(response)
    return response
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    return response
  }

  async resetPassword(data: PasswordResetData): Promise<{ message: string }> {
    return await this.makeRequest('/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePassword(data: PasswordUpdateData): Promise<{ message: string }> {
    const endpoint = data.token ? '/auth/password-reset/confirm' : '/auth/password-update'
    
    return await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProfile(data: ProfileData): Promise<User> {
    return await this.makeRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser(): Promise<User> {
    return await this.makeRequest<User>('/auth/me')
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await this.makeRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
    
    this.setAuthData(response)
    return response
  }

  async logout(options: { audit?: boolean } = {}): Promise<void> {
    const { audit = true } = options
    const storedUser = this.getStoredUser()

    try {
      if (audit && storedUser?.email) {
        await this.makeRequest('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ email: storedUser.email })
        })
      }
    } catch (error) {
      console.error('Error registrando logout:', error)
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }
    return null
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    }
    return null
  }

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  private setAuthData(authResponse: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token)
      localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user))
      
      if (authResponse.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken)
      }
    }
  }
}

export const authService = AuthService.getInstance()

export function formatAuthError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Ha ocurrido un error inesperado'
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}





