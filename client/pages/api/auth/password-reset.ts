import type { NextApiRequest, NextApiResponse } from 'next'
import { getConnection } from '../../../../../server/lib/db'
import { hashPassword } from '../../../../../server/lib/utils'

function decodeResetToken(token?: string): { email?: string } {
  if (!token) return {}
  try {
    const json = Buffer.from(token, 'base64url').toString('utf8')
    const obj = JSON.parse(json)
    return { email: obj.email }
  } catch {
    return {}
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { token, newPassword, confirmPassword } = req.body as {
      token?: string
      newPassword?: string
      confirmPassword?: string
    }
    if (!token) return res.status(400).json({ message: 'Token requerido' })
    if (!newPassword || !confirmPassword) return res.status(400).json({ message: 'Datos incompletos' })
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Las contraseñas no coinciden' })

    const { email } = decodeResetToken(token)
    if (!email) return res.status(400).json({ message: 'Token inválido' })

    const conn: any = await getConnection()
    const hashed = hashPassword(newPassword)
    await conn.execute('UPDATE cat_users SET usr_passwd = ? WHERE usr_email = ?', [hashed, email])

    return res.status(200).json({ message: 'Contraseña restablecida' })
  } catch (error) {
    console.error('Error en /api/auth/password-reset/confirm:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ message: 'Error interno del servidor', error: message })
  }
}

