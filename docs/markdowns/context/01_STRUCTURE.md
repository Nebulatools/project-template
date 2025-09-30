# ESTRUCTURA BASE DEL PROYECTO

## Raíz /

### Folders principales

`/client`         Contiene todos los archivos de frontend.
`/docs`           Contiene toda la documentación y archivos de contexto o seguimiento.
`/server`         Contiene todos los archivos de backend.

### Folders secundarios

`/.next`          Se genera cuando se compila el proyecto.
`/node_modules`   Se genera cuando se instalan las dependencias iniciales.

### Archivos principales

- `.env` - Contiene los parámetros core del proyecto.

- `.eslintrc.json` - Configura ESLint extendiendo next/core-web-vitals; es opcional pero recomendable. Normalmente va en raíz para que next lint lo detecte sin parámetros.

- `.gitignore` - Define qué archivos no se deben versionar (node_modules, builds, .env, etc.); es esencial mantenerlo en raíz del repositorio Git.

- `package-lock.json` - Congela versiones exactas de dependencias; recomendable mantenerlo en raíz junto a package.json, aunque podría regenerarse si se elimina.

- `package.json` - Contiene la metadata del proyecto y scripts de npm/Next; imprescindible que esté en la raíz porque npm/Next lo buscan ahí.

## Frontend /client

`/assets`         Contiene todos los archivos que carga el frontend.
`/components`     Contiene los componentes que se pueden reutilizar en el proyecto.
`/hooks`
`/lib`
`/pages`
`/types`

- `next-env.d.ts` - Archivo generado por Next para habilitar tipos de TypeScript; no debe editarse ni moverse, Next lo espera en la raíz del frontend y lo regenera si falta.

- `next.config.js` - Define distDir: '../.next' (fuerza que .next/ viva en la raíz).

- `tsconfig.json` - Archivo de configuración de TypeScript (paths, strict mode, plugins); imprescindible para compilación y tooling, debe permanecer en raíz del frontend.

## Backend /server

`/bin`
`/db`
`/lib`
`/scripts`
`/sql`
`/src`

- `tsconfig.json` - Archivo de configuración de TypeScript (paths, strict mode, plugins); imprescindible para compilación y tooling, debe permanecer en raíz del backend.

## Documentación /docs

`/config`     Contiene todos los archivos adicionales de configuración del proyecto.
`/markdowns`  Contiene todos los archivos *.md que guardan información del proyecto.

### /config

- `env.template` - Contiene la estructura de variables de entorno del .env.

### /markdowns

`/context`    Contiene los *.md que le dan contexto, reglas y documentación a la IA.
`/reports`    Contiene los *.md output que la IA escribe cuando hace cambios al proyecto.
`/tickets`    Contiene los *.md bitácora de change request de bugs y fixes al proyecto.