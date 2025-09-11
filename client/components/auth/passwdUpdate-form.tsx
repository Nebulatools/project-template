'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface PasswordUpdateFormProps {
  onSubmit?: (passwordData: PasswordUpdateData) => Promise<void>
  token?: string
}

interface PasswordUpdateData {
  currentPassword?: string
  newPassword: string
  confirmPassword: string
}

export default function PasswordUpdateForm({ onSubmit, token }: PasswordUpdateFormProps) {
  const [formData, setFormData] = useState<PasswordUpdateData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  
  const isResetMode = !!token

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        console.log('Password update:', { ...formData, token })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-form">
        <div className="auth-form-card">
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2 className="success-title">
              Contraseña actualizada
            </h2>
            <p className="success-message-text">
              Tu contraseña ha sido actualizada correctamente.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="btn-primary"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit} className="auth-form-card">
        <div className="form-header">
          <h2 className="form-header-title">
            {isResetMode ? 'Restablecer contraseña' : 'Cambiar contraseña'}
          </h2>
          <p className="form-header-subtitle">
            {isResetMode 
              ? 'Ingresa tu nueva contraseña' 
              : 'Ingresa tu contraseña actual y la nueva contraseña'
            }
          </p>
        </div>
        
        {!isResetMode && (
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">
              Contraseña actual
            </label>
            <input
              className="form-input"
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="******************"
              value={formData.currentPassword}
              onChange={handleChange}
              required={!isResetMode}
            />
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label" htmlFor="newPassword">
            Nueva contraseña
          </label>
          <input
            className="form-input"
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="******************"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group-last">
          <label className="form-label" htmlFor="confirmPassword">
            Confirmar nueva contraseña
          </label>
          <input
            className="form-input-error"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="******************"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="form-actions">
          <button
            className="btn-purple btn-full-width"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </div>
        
        <div className="form-link-center">
          <Link href="/login" className="form-link">
            Volver al login
          </Link>
        </div>
      </form>
    </div>
  )
}