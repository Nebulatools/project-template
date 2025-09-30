> He aplicado la estandarización de nombres y rutas, y dejé SQLite listo como fallback para pruebas locales  
  sin MySQL.                                                                                                 
                                                                                                             
  Qué cambié                                                                                                 
                                                                                                             
  - Convenciones de nombres:                                                                                 
      - Backend /server en snake_case:                                                                        
      - `server/lib/authRoutes.ts` → `server/lib/auth_routes.ts` (y ajusté imports).                         
  - Frontend /client en camelCase:                                                                          
      - Componentes: `loginForm.tsx`, `registerForm.tsx`, `profileForm.tsx`, `passwordResetForm.tsx`,   
  `passwordUpdateForm.tsx`.                                                                                
      - Hook: `hooks/auth/useAuth.ts`.                                                                      
      - Validaciones: `lib/auth/authValidations.ts`.                                                        
      - Pages: `pages/auth/passwordReset.tsx`, `pages/auth/passwordUpdate.tsx`.                            
      - Actualicé todos los imports y rutas internas.                                                        
                                                                                                             
  - Rutas URL en kebab-case:                                                                                 
      - Servidor:                                                                                            
      - `server/lib/auth_routes.ts`: `/auth/password-reset`, `/auth/password-update` y redirects a `/auth/    
  login`.                                                                                                    
      - `server/lib/routes.ts`: `/password-reset`, `/password-update`.                                       
      - `server/src/routes/route.ts`: ahora importa desde `./lib/auth_routes`.                                           
  - Cliente:                                                                                                 
      - Enlace en login → `/auth/password-reset`.                                                            
      - Enlaces de “volver al login” → `/auth/login`.                                                        
      - Acción “Cambiar contraseña” en perfil → `/auth/password-update`.                                     
                                                                                                             
  - Rewrites en Next para conciliar camelCase en archivos con rutas kebab-case:                             
      - client/next.config.js                                                                                
      - Reescribe:                                                                                           
        - `/auth/password-reset` → `/auth/passwordReset`                                                    
        - `/auth/password-update` → `/auth/passwordUpdate`                                                  
                                                                                                             
  - Fallback a SQLite para pruebas sin DB:                                                                   
      - server/lib/db.ts:                                                                                    
      - Nuevo `DB_CLIENT=sqlite` activa un adaptador SQLite (vía `better-sqlite3` con require dinámico).     
      - Crea automáticamente tablas mínimas si no existen:                                                   
        - `cat_users (usr_id, usr_name, usr_email, usr_passwd)`                                              
        - `rec_audit (...)`                                                                                  
      - Mantiene compatibilidad: `execute(...)` devuelve estructuras tipo `mysql2`.                          
  - SQL de esquema: server/sql/schema.sql.                                                                   
  - Script de init: server/scripts/init_sqlite.js.                                                           
  - env.template: añadí DB_CLIENT y SQLITE_DB_PATH.                                                          
  - package.json: script init:sqlite.                                                                        
                                                                                                             
  Impacto en el módulo auth                                                                                  
                                                                                                             
  - Las URLs expuestas por servidor y utilizadas en el cliente están alineadas con kebab-case.               
  - El AuthProvider y el hook useAuth siguen funcionando (se ajustaron imports).                            
  - El flujo de registro (/api/auth/register) se mantiene; ahora puede usar SQLite si configuras             
  DB_CLIENT=sqlite.                                                                                          
                                                                                                             
  Cómo probar rápido                                                                                         
                                                                                                             
  - Configurar SQLite (sin MySQL):                                                                           
      - Copia .env.template a .env y define:                                                                 
      - `DB_CLIENT=sqlite`                                                                                   
      - `SQLITE_DB_PATH=server/db/dev.sqlite3` (o deja el valor por defecto)                                 
  - Instala better-sqlite3 si no lo tienes y quieres inicializar por script:                                 
      - npm i better-sqlite3                                                                                 
      - npm run init:sqlite                                                                                  
  - Alternativamente, el adapter crea tablas automáticamente al primer uso.                                  
  - Ejecutar cliente:                                                                                        
      - npm run dev                                                                                          
      - Navega a:                                                                                            
      - `/auth/register` (registra) → redirige a `/auth/login?message=...`                                   
      - `/auth/login`                                                                                        
      - `/auth/password-reset` y `/auth/password-update` (UI de formularios)                                 
      - `/auth/profile` (redirige a `/auth/login` si no autenticado)