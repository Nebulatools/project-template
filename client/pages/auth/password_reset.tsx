import PasswordResetForm from '../../components/auth/password_reset_form'

export default function PasswordResetPage() {
  return (
    <div className="auth-page auth-page-sm">
      <div className="auth-page-container">
        <h1 className="auth-page-title">Recuperar Contraseña</h1>
        <p className="auth-page-subtitle">
          ¿Olvidaste tu contraseña? No te preocupes
        </p>
      </div>

      <div className="auth-form-container">
        <PasswordResetForm />
      </div>
    </div>
  )
}
