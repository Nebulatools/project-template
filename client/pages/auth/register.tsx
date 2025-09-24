import RegisterForm from '../../components/auth/register_form'

export default function RegisterPage() {
  return (
    <div className="auth-page auth-page-sm">
      <div className="auth-page-container">
        <h1 className="auth-page-title">
          Crear Cuenta
        </h1>
        <p className="auth-page-subtitle">Regístrate para comenzar</p>
      </div>

      <div className="auth-form-container">
        <RegisterForm />
      </div>
    </div>
  )
}
