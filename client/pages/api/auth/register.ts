import type { NextApiRequest, NextApiResponse } from 'next'
import { getConnection } from '../../../../server/lib/db'
import { hashPassword, getCurrentTimestamp } from '../../../../server/lib/utils'

interface RegisterData {
  name: string
  email: string
  password: string
}

interface AuditData {
  aud_date: string
  aud_usr: number | null
  aud_view: string
  aud_event: string
  aud_element: string
  aud_values1: string | null
  aud_values2: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, password }: RegisterData = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const connection = await getConnection()

    // Verificar si el usuario ya existe
    const [existingUsers] = await connection.execute(
      'SELECT usr_id FROM cat_users WHERE usr_email = ?',
      [email]
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' })
    }

    // Encriptar contraseña
    const hashedPassword = hashPassword(password)
    const currentTimestamp = getCurrentTimestamp()

    // Insertar usuario en cat_users (solo las 4 columnas que existen)
    const [insertResult] = await connection.execute(
      `INSERT INTO cat_users (usr_name, usr_email, usr_passwd) 
       VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    )

    const insertId = (insertResult as any).insertId

    // Preparar datos para auditoría
    const userData = {
      usr_id: insertId,
      usr_name: name,
      usr_email: email,
      usr_passwd: '[ENCRYPTED]'
    }

    const auditData: AuditData = {
      aud_date: currentTimestamp,
      aud_usr: null, // No hay usuario logueado durante registro
      aud_view: '/auth/register',
      aud_event: 'insert',
      aud_element: 'register-form-submit',
      aud_values1: null, // No hay valores previos en un insert
      aud_values2: JSON.stringify(userData)
    }

    // Insertar evento de auditoría
    await connection.execute(
      `INSERT INTO rec_audit (aud_date, aud_usr, aud_view, aud_event, aud_element, aud_values1, aud_values2) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        auditData.aud_date,
        auditData.aud_usr,
        auditData.aud_view,
        auditData.aud_event,
        auditData.aud_element,
        auditData.aud_values1,
        auditData.aud_values2
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

