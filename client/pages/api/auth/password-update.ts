import type { NextApiRequest, NextApiResponse } from 'next'
import { getConnection } from '../../../../server/lib/db'
import { verifyPassword, hashPassword } from '../../../../server/lib/utils'

function decodeToken(authHeader?: string | null): { email?: string } {
  if (!authHeader) return {}
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return {}
  try {
    const json = Buffer.from(parts[1], 'base64url').toString('utf8')
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
    const auth = req.headers.authorization || null
    const { email } = decodeToken(auth)
    if (!email) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    const { currentPassword, newPassword, confirmPassword } = req.body as {
      currentPassword?: string
      newPassword?: string
      confirmPassword?: string
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Nueva contraseña y confirmación requeridas' })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' })
    }

    const conn: any = await getConnection()
    const [rows] = await conn.execute(
      'SELECT usr_passwd FROM cat_users WHERE usr_email = ?',
      [email]
    )
    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    if (!row) return res.status(404).json({ message: 'Usuario no encontrado' })

    if (!currentPassword || !verifyPassword(currentPassword, row.usr_passwd)) {
      return res.status(401).json({ message: 'Contraseña actual inválida' })
    }

    const hashed = hashPassword(newPassword)
    await conn.execute('UPDATE cat_users SET usr_passwd = ? WHERE usr_email = ?', [hashed, email])

    return res.status(200).json({ message: 'Contraseña actualizada' })
  } catch (error) {
    console.error('Error en /api/auth/password-update:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ message: 'Error interno del servidor', error: message })
  }
}

