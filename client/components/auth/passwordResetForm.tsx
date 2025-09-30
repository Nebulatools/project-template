'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface PasswordResetFormProps {
  onSubmit?: (email: string) => Promise<void>
}

export default function PasswordResetForm({ onSubmit }: PasswordResetFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (onSubmit) {
        await onSubmit(email)
      } else {
        console.log('Password reset request for:', email)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo de recuperación')
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
              Correo enviado
            </h2>
            <p className="success-message-text">
              Se ha enviado un enlace de recuperación a tu correo electrónico. 
              Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="btn-primary"
            >
              Volver al login
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
            Recuperar contraseña
          </h2>
          <p className="form-header-subtitle">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>
        
        <div className="form-group-last">
          <label className="form-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            className="form-input"
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="btn-warning btn-full-width"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </div>
        
        <div className="form-link-center">
          <Link href="/auth/login" className="form-link">
            Volver al login
          </Link>
        </div>
      </form>
    </div>
  )
}
