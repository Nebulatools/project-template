'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface RegisterFormProps {
  onSubmit?: (userData: RegisterData) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Error al registrar usuario')
        }

        console.log('Usuario registrado exitosamente:', data)
        router.push('/auth/login?message=Usuario registrado exitosamente')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit} className="auth-form-card">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Nombre completo
          </label>
          <input
            className="form-input"
            id="name"
            name="name"
            type="text"
            placeholder="Tu nombre completo"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            className="form-input"
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Contraseña
          </label>
          <input
            className="form-input"
            id="password"
            name="password"
            type="password"
            placeholder="******************"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group-last">
          <label className="form-label" htmlFor="confirmPassword">
            Confirmar contraseña
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
            className="btn-secondary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
        
        <div className="form-link-center">
          <Link href="/auth/login" className="form-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  )
}
