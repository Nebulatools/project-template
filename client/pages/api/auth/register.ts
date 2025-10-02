import type { NextApiRequest, NextApiResponse } from 'next'
import { getConnection } from '../../../../server/lib/db'

interface RegisterData {
  name: string
  email: string
  password: string
}

interface InsertResult {
  insertId?: number
}

const MAX_TEXT_LENGTH = 30
const REGISTRATION_ELEMENT = '/auth/register/'
const REGISTRATION_EVENT = 'Nuevo'
const DEFAULT_ROLE_ID = 5
const DEFAULT_STATUS_ID = 1

function sanitizeAuditValue(value: string | number | null | undefined) {
  if (value === null || typeof value === 'undefined') {
    return ''
  }
  return String(value).replace(/'/g, "\\'")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name = '', email = '', password = '' }: RegisterData = req.body

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' })
    }

    if (trimmedPassword.length < 6) {
      return res.status(400).json({ message: 'La contrasena debe tener al menos 6 caracteres' })
    }

    if (trimmedPassword.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ message: `La contrasena no puede superar ${MAX_TEXT_LENGTH} caracteres` })
    }

    if (trimmedName.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ message: `El nombre no puede superar ${MAX_TEXT_LENGTH} caracteres` })
    }

    if (trimmedEmail.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ message: `El correo no puede superar ${MAX_TEXT_LENGTH} caracteres` })
    }

    const connection = await getConnection()

    const [existingUsers] = await connection.execute(
      'SELECT usr_id FROM cat_users WHERE usr_email = ?',
      [trimmedEmail]
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' })
    }

    const [insertResult] = await connection.execute(
      `INSERT INTO cat_users (
         usr_name,
         usr_email,
         usr_passwd,
         usr_dt_ini,
         usr_rol,
         usr_sts
       ) VALUES (?, ?, ?, NOW(), ?, ?)`,
      [trimmedName, trimmedEmail, trimmedPassword, DEFAULT_ROLE_ID, DEFAULT_STATUS_ID]
    )

    const insertId = (insertResult as InsertResult).insertId ?? 0

    if (!insertId) {
      throw new Error('No se pudo determinar el ID del usuario insertado')
    }

    const [userRows] = await connection.execute(
      'SELECT usr_dt_ini FROM cat_users WHERE usr_id = ? LIMIT 1',
      [insertId]
    )

    let usrDtIni: string | null = null

    if (Array.isArray(userRows) && userRows.length > 0) {
      const row = userRows[0] as { usr_dt_ini?: string | Date | null }
      if (row?.usr_dt_ini instanceof Date) {
        usrDtIni = row.usr_dt_ini.toISOString().replace('T', ' ').slice(0, 19)
      } else if (typeof row?.usr_dt_ini === 'string') {
        usrDtIni = row.usr_dt_ini.slice(0, 19)
      }
    }

    const auditPairs = [
      `'usr_id':'${sanitizeAuditValue(insertId)}'`,
      `'usr_name':'${sanitizeAuditValue(trimmedName)}'`,
      `'usr_email':'${sanitizeAuditValue(trimmedEmail)}'`,
      `'usr_passwd':'${sanitizeAuditValue(trimmedPassword)}'`,
      `'usr_dt_ini':'${sanitizeAuditValue(usrDtIni)}'`,
      `'usr_rol':'${DEFAULT_ROLE_ID}'`,
      `'usr_sts':'${DEFAULT_STATUS_ID}'`
    ]

    const auditValues1 = `${auditPairs.join(', ')};`

    await connection.execute(
      `INSERT INTO rec_audit (
         aud_date,
         aud_usr,
         aud_event,
         aud_element,
         aud_values1,
         aud_values2,
         aud_description
       ) VALUES (CURRENT_TIMESTAMP(6), ?, ?, ?, ?, ?, ?)`,
      [
        insertId,
        REGISTRATION_EVENT,
        REGISTRATION_ELEMENT,
        auditValues1,
        null,
        'Registro de usuario desde formulario publico'
      ]
    )

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: insertId
    })

  } catch (error) {
    console.error('Error al registrar usuario:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    })
  }
}
