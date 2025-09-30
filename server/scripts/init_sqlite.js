// Initializes SQLite database for testing using better-sqlite3
// Requires: npm i -D better-sqlite3 (if not already installed)

const fs = require('fs')
const path = require('path')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function main() {
  try {
    const Database = require('better-sqlite3')
    const dbDir = path.resolve(process.cwd(), 'server', 'db')
    const dbPath = process.env.SQLITE_DB_PATH || path.join(dbDir, 'dev.sqlite3')
    const schemaPath = path.resolve(process.cwd(), 'server', 'sql', 'schema.sql')

    ensureDir(dbDir)

    const db = new Database(dbPath)
    const schema = fs.readFileSync(schemaPath, 'utf8')
    db.exec(schema)

    console.log('[sqlite] Initialized at', dbPath)
    db.close()
  } catch (err) {
    console.error('[sqlite] Failed to initialize:', err.message)
    console.error('Hint: Install better-sqlite3: npm i better-sqlite3')
    process.exit(1)
  }
}

main()

