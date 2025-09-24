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

async function getExistingUserColumns(): Promise<Set<string>> {
  const conn: any = await getConnection()
  const client = (process.env.DB_CLIENT || '').toLowerCase()
  if (client === 'sqlite') {
    const [rows] = await conn.execute('PRAGMA table_info(cat_users)')
    const set = new Set<string>()
    for (const r of rows as any[]) set.add(r.name)
    return set
  } else {
    const [rows] = await conn.execute(
      `SELECT COLUMN_NAME as name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cat_users'`
    )
    const set = new Set<string>()
    for (const r of rows as any[]) set.add(r.name || r.COLUMN_NAME)
    return set
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const auth = req.headers.authorization || null
    const { email } = decodeToken(auth)
    if (!email) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    const { name, phone, bio } = req.body as { name?: string; phone?: string; bio?: string }
    if (!name && !phone && !bio) {
      return res.status(400).json({ message: 'No hay datos para actualizar' })
    }

    const conn: any = await getConnection()
    const cols = await getExistingUserColumns()

    const updates: string[] = []
    const params: any[] = []

    if (typeof name === 'string') {
      updates.push('usr_name = ?')
      params.push(name)
    }
    if (typeof phone === 'string' && cols.has('usr_phone')) {
      updates.push('usr_phone = ?')
      params.push(phone)
    }
    if (typeof bio === 'string' && cols.has('usr_bio')) {
      updates.push('usr_bio = ?')
      params.push(bio)
    }

    if (updates.length === 0) {
      return res.status(200).json({ message: 'Sin cambios aplicables' })
    }

    params.push(email)
    const sql = `UPDATE cat_users SET ${updates.join(', ')} WHERE usr_email = ?`
    await conn.execute(sql, params)

    // Devuelve el objeto actualizado (mínimo)
    const [rows] = await conn.execute(
      'SELECT usr_id, usr_name, usr_email, usr_phone, usr_bio FROM cat_users WHERE usr_email = ?',
      [email]
    )
    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    if (!row) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    const now = new Date()
    const user = {
      id: String(row.usr_id),
      email: row.usr_email,
      name: row.usr_name,
      phone: row.usr_phone || '',
      bio: row.usr_bio || '',
      createdAt: now,
      updatedAt: now,
      isActive: true,
    }
    return res.status(200).json(user)
  } catch (error) {
    console.error('Error en /api/auth/profile:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ message: 'Error interno del servidor', error: message })
  }
}

