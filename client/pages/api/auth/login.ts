import type { NextApiRequest, NextApiResponse } from "next"
import { getConnection } from "../../../../server/lib/db"
import { verifyPassword } from "../../../../server/lib/utils"

const MAX_TEXT_LENGTH = 30
const AUDIT_EVENT = "Login"
const AUDIT_ELEMENT = "/auth/login"

function makeToken(payload: object): string {
  const json = JSON.stringify(payload)
  return Buffer.from(json).toString("base64url")
}

function parseUser(row: any) {
  const now = new Date()
  return {
    id: String(row.usr_id),
    email: row.usr_email,
    name: row.usr_name,
    phone: row.usr_phone || "",
    bio: row.usr_bio || "",
    createdAt: now,
    updatedAt: now,
    isActive: true
  }
}

function passwordsMatch(inputPassword: string, storedPassword: string | null | undefined) {
  if (!storedPassword) return false
  if (storedPassword.includes(":")) {
    try {
      return verifyPassword(inputPassword, storedPassword)
    } catch {
      return false
    }
  }
  return storedPassword === inputPassword
}

function sanitizeAuditValue(value: string | number | null | undefined) {
  if (value === null || typeof value === "undefined") {
    return ""
  }
  return String(value).replace(/'/g, "\\'")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { email = "", password = "" } = req.body as { email?: string; password?: string }

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ message: "Correo y contrasena son requeridos" })
    }

    if (trimmedEmail.length > MAX_TEXT_LENGTH || trimmedPassword.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ message: "Credenciales invalidas" })
    }

    const connection = await getConnection()
    const [rows] = await (connection as any).execute(
      "SELECT usr_id, usr_name, usr_email, usr_passwd FROM cat_users WHERE usr_email = ?",
      [trimmedEmail]
    )

    const userRow = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    if (!userRow) {
      return res.status(401).json({ message: "Credenciales invalidas" })
    }

    const passwordOk = passwordsMatch(trimmedPassword, userRow.usr_passwd)
    if (!passwordOk) {
      return res.status(401).json({ message: "Credenciales invalidas" })
    }

    const user = parseUser(userRow)
    const token = makeToken({ email: user.email, exp: Date.now() + 1000 * 60 * 60 })

    const auditValues1 = `\'usr_email\':\'${sanitizeAuditValue(trimmedEmail)}\';`
    const auditDescription = `Inicio de sesión del usuario ${trimmedEmail}.`

    await (connection as any).execute(
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
        userRow.usr_id,
        AUDIT_EVENT,
        AUDIT_ELEMENT,
        auditValues1,
        null,
        auditDescription
      ]
    )

    return res.status(200).json({ user, token })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error en login:", error)
    return res.status(500).json({ message: "Error interno del servidor", error: errorMessage })
  }
}
