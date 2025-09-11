import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return (
    <div className="auth-page auth-page-sm">
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    </div>
  )
}