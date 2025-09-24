> He aplicado la estandarización de nombres y rutas, y dejé SQLite listo como fallback para pruebas locales  
  sin MySQL.                                                                                                 
                                                                                                             
  Qué cambié                                                                                                 
                                                                                                             
  - Convenciones de nombres:                                                                                 
      - Backend /server en camelCase:                                                                        
      - `server/lib/auth-routes.ts` → `server/lib/authRoutes.ts` (y ajusté imports).                         
  - Frontend /client en snake_case:                                                                          
      - Componentes: `login_form.tsx`, `register_form.tsx`, `profile_form.tsx`, `password_reset_form.tsx`,   
  `password_update_form.tsx`.                                                                                
      - Hook: `hooks/auth/use_auth.ts`.                                                                      
      - Validaciones: `lib/auth/auth_validations.ts`.                                                        
      - Pages: `pages/auth/password_reset.tsx`, `pages/auth/password_update.tsx`.                            
      - Actualicé todos los imports y rutas internas.                                                        
                                                                                                             
  - Rutas URL en kebab-case:                                                                                 
      - Servidor:                                                                                            
      - `server/lib/authRoutes.ts`: `/auth/password-reset`, `/auth/password-update` y redirects a `/auth/    
  login`.                                                                                                    
      - `server/lib/routes.ts`: `/password-reset`, `/password-update`.                                       
      - `server/route.ts`: ahora importa desde `./lib/authRoutes`.                                           
  - Cliente:                                                                                                 
      - Enlace en login → `/auth/password-reset`.                                                            
      - Enlaces de “volver al login” → `/auth/login`.                                                        
      - Acción “Cambiar contraseña” en perfil → `/auth/password-update`.                                     
                                                                                                             
  - Rewrites en Next para conciliar snake_case en archivos con rutas kebab-case:                             
      - client/next.config.js                                                                                
      - Reescribe:                                                                                           
        - `/auth/password-reset` → `/auth/password_reset`                                                    
        - `/auth/password-update` → `/auth/password_update`                                                  
                                                                                                             
  - Fallback a SQLite para pruebas sin DB:                                                                   
      - server/lib/db.ts:                                                                                    
      - Nuevo `DB_CLIENT=sqlite` activa un adaptador SQLite (vía `better-sqlite3` con require dinámico).     
      - Crea automáticamente tablas mínimas si no existen:                                                   
        - `cat_users (usr_id, usr_name, usr_email, usr_passwd)`                                              
        - `rec_audit (...)`                                                                                  
      - Mantiene compatibilidad: `execute(...)` devuelve estructuras tipo `mysql2`.                          
  - SQL de esquema: server/sql/schema.sql.                                                                   
  - Script de init: server/scripts/init-sqlite.js.                                                           
  - env.template: añadí DB_CLIENT y SQLITE_DB_PATH.                                                          
  - package.json: script init:sqlite.                                                                        
                                                                                                             
  Impacto en el módulo auth                                                                                  
                                                                                                             
  - Las URLs expuestas por servidor y utilizadas en el cliente están alineadas con kebab-case.               
  - El AuthProvider y el hook use_auth siguen funcionando (se ajustaron imports).                            
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