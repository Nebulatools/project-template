'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (onSubmit) {
        await onSubmit(email, password)
      } else {
        console.log('Login attempt:', { email, password })
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit} className="auth-form-card">
        <div className="form-group">
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
        <div className="form-group-last">
          <label className="form-label" htmlFor="password">
            Contraseña
          </label>
          <input
            className="form-input-error"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            className="btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
          <Link href="/passwdReset" className="form-link">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        
        <div className="form-link-center">
          <Link href="/register" className="form-link">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </form>
    </div>
  )
}