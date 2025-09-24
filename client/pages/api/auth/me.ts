import type { NextApiRequest, NextApiResponse } from 'next'
import { getConnection } from '../../../../server/lib/db'

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

function parseUser(row: any) {
  const now = new Date()
  return {
    id: String(row.usr_id),
    email: row.usr_email,
    name: row.usr_name,
    phone: row.usr_phone || '',
    bio: row.usr_bio || '',
    createdAt: now,
    updatedAt: now,
    isActive: true,
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const auth = req.headers.authorization || null
    const { email } = decodeToken(auth)
    if (!email) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    const connection = await getConnection()
    const [rows] = await (connection as any).execute(
      'SELECT usr_id, usr_name, usr_email FROM cat_users WHERE usr_email = ?',
      [email]
    )
    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    if (!row) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const user = parseUser(row)
    return res.status(200).json(user)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error en /auth/me:', error)
    return res.status(500).json({ message: 'Error interno del servidor', error: errorMessage })
  }
}

