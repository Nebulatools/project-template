import LoginForm from '../components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="auth-page auth-page-sm">
      <div className="auth-page-container">
        <h1 className="auth-page-title">
          Iniciar Sesión
        </h1>
        <p className="auth-page-subtitle">
          Accede a tu cuenta
        </p>
      </div>

      <div className="auth-form-container">
        <LoginForm />
      </div>
    </div>
  )
}