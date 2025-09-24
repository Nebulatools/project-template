import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Ensure env vars are loaded even when Next.js runs from /client directory
if (!process.env.DB_CLIENT) {
  // Try root .env
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
  // Also try client/.env if still missing
  if (!process.env.DB_CLIENT) {
    dotenv.config({ path: path.resolve(process.cwd(), 'client', '.env') })
  }
}

type MySqlConn = mysql.Connection
type SqliteAdapter = {
  execute: (sql: string, params?: any[]) => Promise<any>
  end?: () => Promise<void>
}

let connection: MySqlConn | SqliteAdapter | null = null

async function getSqliteConnection(): Promise<SqliteAdapter> {
  // Carga perezosa para evitar requerir la dependencia si no se usa
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const BetterSqlite3 = require('better-sqlite3') as any

  const dbDir = path.resolve(process.cwd(), 'server', 'db')
  const dbPath = process.env.SQLITE_DB_PATH || path.join(dbDir, 'dev.sqlite3')

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const db = new BetterSqlite3(dbPath)

  // Crear tablas mínimas si no existen
  db.exec(`
    CREATE TABLE IF NOT EXISTS cat_users (
      usr_id INTEGER PRIMARY KEY AUTOINCREMENT,
      usr_name TEXT NOT NULL,
      usr_email TEXT NOT NULL UNIQUE,
      usr_passwd TEXT NOT NULL,
      usr_phone TEXT NULL,
      usr_bio TEXT NULL
    );

    CREATE TABLE IF NOT EXISTS rec_audit (
      aud_id INTEGER PRIMARY KEY AUTOINCREMENT,
      aud_date TEXT NOT NULL,
      aud_usr INTEGER NULL,
      aud_view TEXT NOT NULL,
      aud_event TEXT NOT NULL,
      aud_element TEXT NOT NULL,
      aud_values1 TEXT NULL,
      aud_values2 TEXT NOT NULL
    );
  `)

  const adapter: SqliteAdapter = {
    async execute(sql: string, params: any[] = []) {
      const trimmed = sql.trim().toUpperCase()
      if (trimmed.startsWith('SELECT')) {
        const stmt = db.prepare(sql)
        const rows = stmt.all(...params)
        return [rows]
      } else if (trimmed.startsWith('INSERT')) {
        const stmt = db.prepare(sql)
        const info = stmt.run(...params)
        return [{ insertId: info.lastInsertRowid }]
      } else {
        const stmt = db.prepare(sql)
        const info = stmt.run(...params)
        return [info]
      }
    },
    async end() {
      db.close()
    }
  }

  return adapter
}

export async function getConnection() {
  if (connection) return connection

  const client = (process.env.DB_CLIENT || '').toLowerCase()
  if (client === 'sqlite') {
    console.log('Using SQLite adapter for database (testing)')
    connection = await getSqliteConnection()
    return connection
  }

  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test_project_db',
    port: parseInt(process.env.DB_PORT || '3306')
  }

  console.log('Database config (MySQL):', {
    ...config,
    password: '***'
  })

  connection = await mysql.createConnection(config)
  return connection
}

export async function closeConnection() {
  if (connection && 'end' in connection && typeof connection.end === 'function') {
    await connection.end()
  }
  connection = null
}
