import React, { useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react'
import { 
  User, 
  AuthState, 
  AuthAction, 
  AuthContextType,
  LoginData,
  RegisterData,
  PasswordResetData,
  PasswordUpdateData,
  ProfileData
} from '../../types/auth/auth'
import { authService, formatAuthError } from '../../lib/auth/auth'
import { 
  validateLoginData,
  validateRegisterData,
  validatePasswordResetData,
  validatePasswordUpdateData,
  validateProfileData
} from '../../lib/auth/authValidations'
import { AuthContext } from '../../hooks/auth/useAuth'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = authService.getStoredUser()
      const token = authService.getToken()
      
      if (storedUser && token) {
        try {
          const currentUser = await authService.getCurrentUser()
          dispatch({ type: 'AUTH_SUCCESS', payload: currentUser })
        } catch (error) {
          await authService.logout({ audit: false })
          dispatch({ type: 'AUTH_LOGOUT' })
        }
      }
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginData): Promise<void> => {
    const validation = validateLoginData(data)
    if (!validation.isValid) {
      const errorMessage = validation.errors.map(e => e.message).join(', ')
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      return
    }

    dispatch({ type: 'AUTH_START' })
    try {
      const response = await authService.login(data)
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user })
    } catch (error) {
      const errorMessage = formatAuthError(error)
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const register = async (data: RegisterData): Promise<void> => {
    const validation = validateRegisterData(data)
    if (!validation.isValid) {
      const errorMessage = validation.errors.map(e => e.message).join(', ')
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      return
    }

    dispatch({ type: 'AUTH_START' })
    try {
      await authService.register(data)
    } catch (error) {
      const errorMessage = formatAuthError(error)
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    await authService.logout()
    dispatch({ type: 'AUTH_LOGOUT' })
  }

  const resetPassword = async (data: PasswordResetData): Promise<void> => {
    const validation = validatePasswordResetData(data)
    if (!validation.isValid) {
      const errorMessage = validation.errors.map(e => e.message).join(', ')
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      return
    }

    dispatch({ type: 'AUTH_START' })
    try {
      await authService.resetPassword(data)
      dispatch({ type: 'CLEAR_ERROR' })
    } catch (error) {
      const errorMessage = formatAuthError(error)
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const updatePassword = async (data: PasswordUpdateData): Promise<void> => {
    const validation = validatePasswordUpdateData(data)
    if (!validation.isValid) {
      const errorMessage = validation.errors.map(e => e.message).join(', ')
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      return
    }

    dispatch({ type: 'AUTH_START' })
    try {
      await authService.updatePassword(data)
      dispatch({ type: 'CLEAR_ERROR' })
    } catch (error) {
      const errorMessage = formatAuthError(error)
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const updateProfile = async (data: ProfileData): Promise<void> => {
    const validation = validateProfileData(data)
    if (!validation.isValid) {
      const errorMessage = validation.errors.map(e => e.message).join(', ')
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      return
    }

    dispatch({ type: 'AUTH_START' })
    try {
      const updatedUser = await authService.updateProfile(data)
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser })
    } catch (error) {
      const errorMessage = formatAuthError(error)
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}





