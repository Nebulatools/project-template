"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useAuth } from "../../hooks/auth/useAuth"

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localLoading, setLocalLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { isLoading: authLoading, error: authError, clearError } = useAuth()

  const combinedLoading = localLoading || authLoading
  const combinedError = error || authError || ""

  const resetErrors = () => {
    if (error) setError("")
    if (authError) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    resetErrors()

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setError("Correo y contrasena son requeridos")
      return
    }

    try {
      if (onSubmit) {
        await onSubmit(trimmedEmail, trimmedPassword)
      } else {
        setLocalLoading(true)
        const dashboard = "/dashboard"
        const fallback = "/account/my-profile"
        try {
          const res = await fetch(dashboard, { method: "HEAD" })
          router.push(res.ok ? dashboard : fallback)
        } catch {
          router.push(fallback)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesion")
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit} className="auth-form-card">
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Correo electronico
          </label>
          <input
            className="form-input"
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => {
              resetErrors()
              setEmail(e.target.value)
            }}
            required
          />
        </div>
        <div className="form-group-last">
          <label className="form-label" htmlFor="password">
            Contrasena
          </label>
          <input
            className="form-input-error"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => {
              resetErrors()
              setPassword(e.target.value)
            }}
            required
          />
        </div>
        
        {combinedError && (
          <div className="error-message">
            {combinedError}
          </div>
        )}
        
        <div className="form-actions">
          <button
            className="btn-primary"
            type="submit"
            disabled={combinedLoading}
          >
            {combinedLoading ? "Ingresando..." : "Iniciar Sesion"}
          </button>
          <Link href="/auth/password-reset" className="form-link">
            ?Olvidaste tu contrasena?
          </Link>
        </div>
        
        <div className="form-link-center">
          <Link href="/auth/register" className="form-link">
            ?No tienes cuenta? Registrate
          </Link>
        </div>
      </form>
    </div>
  )
}
