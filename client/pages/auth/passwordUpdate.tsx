import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/auth/useAuth'
import PasswordUpdateForm from '../../components/auth/passwordUpdateForm'

export default function PasswordUpdatePage() {
  const router = useRouter()
  const { token } = router.query
  const { updatePassword } = useAuth()
  
  return (
    <div className="auth-page auth-page-sm">
      <div className="auth-page-container">
        <h1 className="auth-page-title">{token ? 'Restablecer Contraseña' : 'Cambiar Contraseña'}</h1>
        <p className="auth-page-subtitle">
          {token ? 'Ingresa tu nueva contraseña' : 'Actualiza tu contraseña actual'}
        </p>
      </div>

      <div className="auth-form-container">
        <PasswordUpdateForm 
          token={typeof token === 'string' ? token : undefined}
          onSubmit={async (data) => {
            await updatePassword({ ...data, token: typeof token === 'string' ? token : undefined })
          }}
        />
      </div>
    </div>
  )
}
