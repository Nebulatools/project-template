import { useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../../hooks/auth/useAuth"

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const logoutRef = useRef(logout)
  const routerRef = useRef(router)

  useEffect(() => {
    logoutRef.current = logout
  }, [logout])

  useEffect(() => {
    routerRef.current = router
  }, [router])

  useEffect(() => {
    const runLogout = async () => {
      try {
        await logoutRef.current()
      } finally {
        routerRef.current.replace("/auth/login")
      }
    }

    runLogout()
  }, [])

  return (
    <div className="auth-page auth-page-sm">
      <div className="auth-page-container">
        <h1 className="auth-page-title">Cerrando sesion...</h1>
        <p className="auth-page-subtitle">Te estamos redirigiendo a la pantalla de inicio de sesion.</p>
      </div>
    </div>
  )
}

