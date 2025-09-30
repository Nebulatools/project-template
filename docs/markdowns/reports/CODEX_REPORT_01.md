# CODEX REPORT 01 — Reorganización inicial y módulo de autenticación

## Resumen de cambios

- Estandarización de estructura por módulos con carpetas `client` (frontend) y `server` (backend).
- Reubicación del código de autenticación del frontend a `client/lib` y `client/hooks`.
- Tipos compartidos del módulo `auth` movidos a `client/types/auth`.
- API de registro (signup) movida a Next API Route: `client/pages/api/auth/register.ts`.
- Ajuste de rutas frontend a prefijo `/auth/*` (`/auth/login`, `/auth/register`, etc.).
- Corrección de imports relativos en páginas y componentes de `client/pages/auth/*`.
- Actualización de scripts de `package.json` para ejecutar Next desde `client`.
- Configuración de Next.js en `client/next.config.js` con `experimental.externalDir: true` para importar utilidades desde `server`.
- Configuración de Tailwind/PostCSS movida a `client/` y content globs ajustados.
- Actualización de `env.template` con variables de entorno para backend (`DB_*`).

## Estructura final relevante

- `client/`
  - `pages/`
    - `index.tsx` (redirige a `/auth/login`)
    - `auth/`
      - `login.tsx`
      - `register.tsx`
      - `passwdReset.tsx`
      - `passwdupdate.tsx`
      - `profile.tsx`
    - `api/auth/register.ts` (API de registro)
  - `components/auth/`
    - `AuthProvider.tsx`
    - `login-form.tsx`
    - `register-form.tsx`
    - `passwdReset-form.tsx`
    - `passwdUpdate-form.tsx`
    - `profile-form.tsx`
  - `hooks/auth/useAuth.ts`
  - `lib/auth/auth.ts` (AuthService y helpers)
  - `lib/auth/auth-validations.ts`
  - `types/auth/auth.ts`
  - `assets/styles/{globals.css,styles.css}`
  - `next.config.js`, `tailwind.config.ts`, `postcss.config.js`

- `server/`
  - `lib/`
    - `db.ts` (conexión MySQL con `DB_*`)
    - `utils.ts` (hash/verify y timestamps)
    - `auth-routes.ts` (rutas ajustadas a `/auth/*`)
    - `routes.ts` (no usado por el cliente actualmente)
  - `src/` (sin APIs Next; reservado para scripts/configs backend)

- raíz
  - `package.json` (scripts apuntan a `client`)
  - `env.template` (incluye `DB_*` y `NEXT_PUBLIC_*`)
  - `test_db_connection.js` (script de prueba con `NEXT_PUBLIC_*`)

## Detalles de implementación

- Mover a frontend:
  - `server/lib/auth/{auth.ts,auth-validations.ts,useAuth.ts}` →
    `client/lib/auth/{auth.ts,auth-validations.ts}` y `client/hooks/auth/useAuth.ts`.
  - `server/src/auth/auth.ts` (tipos) → `client/types/auth/auth.ts`.

- API de registro:
  - `server/src/auth/register.ts` → `client/pages/api/auth/register.ts`.
  - Imports actualizados para usar utilidades del backend: `server/lib/db` y `server/lib/utils`.
  - Se habilita `externalDir` en `client/next.config.js` para permitir imports fuera de `client`.

- Rutas frontend y enlaces:
  - Páginas en `client/pages/auth/*` corrigen imports relativos a `../../components/...` y `../../hooks/...`.
  - Enlaces y redirects actualizados a `/auth/*`.
  - `register-form.tsx` ahora consume `/api/auth/register` y redirige a `/auth/login` al éxito.

- Configuración y scripts:
  - `package.json`: `dev/build/start/lint` apuntan a `client`.
  - `client/next.config.js`: `reactStrictMode` y `experimental.externalDir`.
  - Tailwind: `client/tailwind.config.ts` con globs `./pages`, `./components`, `./app`.
  - PostCSS: `client/postcss.config.js`.
  - `_app.tsx`: importa estilos desde `../assets/styles/*`.
  - `env.template`: añade `DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT`.

## Cómo correr el proyecto

- Prerrequisitos: Node.js 18+, MySQL accesible, variables en `.env`.
- Variables de entorno (ejemplo):
  - Backend (API Next): `DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT`.
  - Frontend opcional (script de prueba): `NEXT_PUBLIC_*`.
- Scripts:
  - Desarrollo: `npm run dev` (sirve Next desde `client/`).
  - Build: `npm run build`.
  - Producción: `npm run start`.
  - Lint: `npm run lint`.

## Flujo del módulo Auth (estado actual)

- Frontend:
  - Vistas en `/auth/*`.
  - `AuthProvider` expone contexto y helpers; `AuthService` orquesta llamadas a `/api/auth/*`.
  - Validaciones reusables en `client/lib/auth/auth-validations.ts`.

- Backend (Next API Routes):
  - Registro: `POST /api/auth/register` — inserta en `cat_users` y registra auditoría en `rec_audit` usando `server/lib/db` y `server/lib/utils`.

- Pendientes/futuros (no implementados):
  - `POST /api/auth/login`, `POST /api/auth/password-reset`, `POST /api/auth/password-update`, `PUT /api/auth/profile`, `GET /api/auth/me`, `POST /api/auth/refresh`.
  - Middleware/guardas para rutas protegidas.

## Notas y consideraciones

- Se mantuvo `server/lib/routes.ts`; no es consumido por el frontend actual y puede consolidarse o eliminarse si no se usa.
- `test_db_connection.js` usa `NEXT_PUBLIC_*`; mantenerlo sólo para pruebas locales.
- Asegúrate de poblar `.env` con `DB_*` para que `POST /api/auth/register` funcione.
- Si prefieres aislar el backend de Next, se puede introducir un servidor Node/Express en `server/` y consumirlo vía `fetch` con proxy/rewrite; hoy se usa Next API por simplicidad.

