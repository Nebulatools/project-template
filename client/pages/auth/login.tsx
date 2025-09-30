import LoginForm from '../../components/auth/loginForm'
import { useAuth } from '../../hooks/auth/useAuth'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (email: string, password: string) => {
    await login({ email, password })
    const dashboard = '/dashboard'
    const fallback = '/account/my-profile'
    try {
      const res = await fetch(dashboard, { method: 'HEAD' })
      router.push(res.ok ? dashboard : fallback)
    } catch {
      router.push(fallback)
    }
  }

  return (
    <div className="auth-page auth-page-sm">
      <div className="auth-page-container">
        <h1 className="auth-page-title">Iniciar Sesión</h1>
        <p className="auth-page-subtitle">
          Accede a tu cuenta
        </p>
      </div>

      <div className="auth-form-container">
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
