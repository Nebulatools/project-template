import type { NextApiRequest, NextApiResponse } from 'next'
import { getConnection } from '../../../../server/lib/db'
import { verifyPassword } from '../../../../server/lib/utils'

function makeToken(payload: object): string {
  const json = JSON.stringify(payload)
  return Buffer.from(json).toString('base64url')
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' })
    }

    const connection = await getConnection()
    const [rows] = await (connection as any).execute(
      'SELECT usr_id, usr_name, usr_email, usr_passwd FROM cat_users WHERE usr_email = ?',
      [email]
    )

    const userRow = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    if (!userRow) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const passwordOk = verifyPassword(password, userRow.usr_passwd)
    if (!passwordOk) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const user = parseUser(userRow)
    const token = makeToken({ email: user.email, exp: Date.now() + 1000 * 60 * 60 })

    return res.status(200).json({ user, token })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error en login:', error)
    return res.status(500).json({ message: 'Error interno del servidor', error: errorMessage })
  }
}

