-- Minimal schema for SQLite testing

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
