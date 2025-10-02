import type { NextApiRequest, NextApiResponse } from "next"
import { getConnection } from "../../../../server/lib/db"

const AUDIT_EVENT = "Logout"
const AUDIT_ELEMENT = "/auth/logout"

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
    const { email = "" } = req.body as { email?: string }
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      return res.status(400).json({ message: "Correo requerido" })
    }

    const connection = await getConnection()
    const [rows] = await (connection as any).execute(
      "SELECT usr_id, usr_email FROM cat_users WHERE usr_email = ?",
      [trimmedEmail]
    )

    const userRow = Array.isArray(rows) && rows.length > 0 ? rows[0] : null

    if (!userRow) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const auditValues1 = `\'usr_email\':\'${sanitizeAuditValue(trimmedEmail)}\';`
    const auditDescription = `Cierre de sesión del usuario ${trimmedEmail}.`

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

    return res.status(200).json({ message: "Logout registrado" })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error en logout:", error)
    return res.status(500).json({ message: "Error interno del servidor", error: errorMessage })
  }
}
