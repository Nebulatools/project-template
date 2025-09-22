import { useRouter } from 'next/router'
import PasswordUpdateForm from '../../components/auth/passwdUpdate-form'

export default function PasswordUpdatePage() {
  const router = useRouter()
  const { token } = router.query
  
  return (
    <div className="auth-page auth-page-sm">
      <div className="auth-page-container">
        <h1 className="auth-page-title">{token ? 'Restablecer Contraseña' : 'Cambiar Contraseña'}</h1>
        <p className="auth-page-subtitle">
          {token ? 'Ingresa tu nueva contraseña' : 'Actualiza tu contraseña actual'}
        </p>
      </div>

      <div className="auth-form-container">
        <PasswordUpdateForm token={typeof token === 'string' ? token : undefined} />
      </div>
    </div>
  )
}
