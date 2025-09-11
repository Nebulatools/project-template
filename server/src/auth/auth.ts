export interface User {
  id: string
  email: string
  name: string
  phone?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface PasswordResetData {
  email: string
}

export interface PasswordUpdateData {
  currentPassword?: string
  newPassword: string
  confirmPassword: string
  token?: string
}

export interface ProfileData {
  name: string
  email: string
  phone: string
  bio: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface AuthError {
  message: string
  code?: string
  field?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (data: PasswordResetData) => Promise<void>
  updatePassword: (data: PasswordUpdateData) => Promise<void>
  updateProfile: (data: ProfileData) => Promise<void>
  clearError: () => void
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }