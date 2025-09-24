'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface ProfileFormProps {
  onSubmit?: (profileData: ProfileData) => Promise<void>
  initialData?: Partial<ProfileData>
}

interface ProfileData {
  name: string
  email: string
  phone: string
  bio: string
}

export default function ProfileForm({ onSubmit, initialData }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    bio: initialData?.bio || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        console.log('Profile update:', formData)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit} className="auth-form-card">
        <div className="form-header">
          <h2 className="form-header-title">
            Mi Perfil
          </h2>
          <p className="form-header-subtitle">
            Actualiza tu información personal
          </p>
        </div>
        
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
          <label className="form-label" htmlFor="phone">
            Teléfono
          </label>
          <input
            className="form-input"
            id="phone"
            name="phone"
            type="tel"
            placeholder="+52 123 456 7890"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group-last">
          <label className="form-label" htmlFor="bio">
            Biografía
          </label>
          <textarea
            className="form-textarea"
            id="bio"
            name="bio"
            placeholder="Cuéntanos un poco sobre ti..."
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            ¡Perfil actualizado correctamente!
          </div>
        )}
        
        <div className="form-actions-gap">
          <button
            className="btn-primary btn-flex"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/auth/password-update')}
            className="btn-gray"
          >
            Cambiar contraseña
          </button>
        </div>
        
        <div className="form-link-center">
          <Link href="/dashboard" className="form-link">
            Volver al dashboard
          </Link>
        </div>
      </form>
    </div>
  )
}
