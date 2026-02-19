# Code Review — PlayLog (Project Lead level)

**Alcance:** App como producto funcional lista para uso real.  
**Excluido de esta revisión:** roles, permisos, migración a DB centralizada, grupos de juego.

---

## 1. Resumen ejecutivo

La aplicación está **casi lista para uso en producción** en su alcance actual. La arquitectura es clara, las APIs están protegidas y el flujo de datos es coherente. Hay **un fallo importante** (middleware de rutas no activo) y varias mejoras recomendadas que no bloquean el “go live” pero sí mejoran robustez y operación.

**Veredicto:** Funcional para un MVP con un único usuario/grupo que use Google Sheets; corregir el middleware y, si es posible, validación de env y un mínimo de tests antes de considerar el release “cerrado”.

---

## 2. Fortalezas

### 2.1 Arquitectura y estructura

- **Vertical slicing** bien aplicado: features con tipos, repositorios, use cases y UI separados. Fácil de extender (ej. detalle de play, stats por juego/jugador).
- **Separación Container/Presentation** en formularios y listas; lógica en use cases, no en componentes.
- **BFF consistente:** todas las rutas bajo `app/api/` hacen auth y delegan en use cases; respuestas JSON y códigos HTTP coherentes (401, 404, 500).

### 2.2 Seguridad (capa API)

- **Todas las rutas de API** comprueban sesión (`auth()`) y devuelven 401 si no hay usuario.
- **POST /api/plays** usa `session.user.email` como `createdBy`; no se confía en el body para identidad.
- **Proxy** (protección de rutas) está bien definido en `src/proxy.ts` y documentado; el problema es solo que no está conectado al middleware de Next.js (ver más abajo).

### 2.3 Datos y negocio

- **Validación en createPlayUseCase:** mínimo 2 jugadores con nombre, juego y fecha; jugadores con nombre vacío filtrados antes de persistir.
- **Caché en memoria** (sheetsCache) con TTL e invalidación en escrituras; reduce llamadas a Sheets y evita cuellos de botella.
- **Manejo de BGG opcional:** la app funciona sin `BGG_API_TOKEN`; bgg.ts usa el token solo si está definido.

### 2.4 UX y flujos

- **Login:** redirección a `/plays` si ya hay sesión; botón de sign-in en `/login`.
- **Crear play:** formulario con My Games, BGG search, fecha por defecto hoy, jugadores dinámicos, feedback de errores y estado de envío.
- **Listado y detalle:** lista de plays, enlace a detalle por play, vista de detalle con juego, fecha y jugadores.
- **Estadísticas:** overview, por juego, por jugador; enlaces “Volver” coherentes.
- **My Games:** listado, búsqueda BGG, añadir juego, sync con BGG; errores mostrados al usuario.

### 2.5 Operación y documentación

- **README** con stack, env, scripts, arquitectura y deploy en Vercel.
- **ARCHITECTURE.md** con diagrama de flujo, modelo de datos en Sheets y patrón BFF.
- **.env.example** con todas las variables necesarias y comentarios útiles (incl. BGG).
- **Scripts:** `lint`, `lint:fix`, `format` con Biome; build/start listos para producción.

---

## 3. Problemas críticos (arreglar antes de release)

### 3.1 Middleware de protección de rutas no activo

- **Qué pasa:** En Next.js el middleware debe vivir en un archivo llamado `middleware.ts` (en la raíz o en `src/`). En el proyecto existe `src/proxy.ts` con la lógica de protección (`auth((req) => ...)`) pero **no hay `middleware.ts`** que lo use.
- **Consecuencia:** Cualquiera puede abrir `/plays` y `/games` sin estar logueado. La UI cargará y las llamadas a la API devolverán 401, por lo que el usuario verá errores o listas vacías, pero las páginas no redirigen a login.
- **Acción:** En Next.js 16 el middleware se configura en **`proxy.ts` en la raíz del proyecto** (no en `src/`). Se ha creado `proxy.ts` en la raíz que reexporta `proxy` desde `src/proxy.ts` para que Next.js ejecute la protección de rutas.

- **Verificación:** Con sesión cerrada, abrir `/plays` o `/games` y confirmar redirección a `/login`.

---

## 4. Mejoras recomendadas (no bloqueantes)

### 4.1 Validación de variables de entorno

- **Situación:** `getSheetsClient()` y `SHEET_ID` usan `process.env.*` sin comprobar que existan. Si falta `GOOGLE_SHEET_ID` o las credenciales, el fallo aparece en la primera petición a Sheets (error 500 genérico).
- **Recomendación:** En un módulo de bootstrap o en el primer uso del cliente (por ejemplo en `lib/sheetsClient.ts`), validar en runtime las variables obligatorias y lanzar un error claro al arrancar o en la primera llamada. Opcional: usar un esquema (p. ej. Zod) con `safeParse` y mensajes tipo “GOOGLE_SHEET_ID is required”.

### 4.2 POST /api/plays — body no JSON

- **Situación:** Si el cliente envía `Content-Type: application/json` pero body inválido o no JSON, `request.json()` puede lanzar. El `catch` actual devuelve 500 con “Failed to create play”, lo cual es aceptable pero poco específico.
- **Recomendación:** Envolver `request.json()` en try/catch y devolver 400 con mensaje tipo “Invalid JSON body” cuando falle el parse. Mantener 500 para errores del use case o de persistencia.

### 4.3 Validación de fecha en create play

- **Situación:** El use case comprueba que `date` exista pero no que sea una fecha válida (formato YYYY-MM-DD o que sea una fecha real). Valores raros podrían guardarse en Sheets.
- **Recomendación:** Validar formato y que la fecha sea válida (p. ej. `!Number.isNaN(Date.parse(input.date))` y/o regex) y lanzar error claro (“Invalid date format”) antes de llamar al repositorio.

### 4.4 Documentación de ARCHITECTURE.md desactualizada

- **Situación:** El doc menciona `createPlay/` y `listPlays/` como carpetas; en el código actual la estructura es `features/plays/` con `views/create`, `views/list`, `views/detail` y `shared`.
- **Recomendación:** Actualizar ARCHITECTURE.md (y rutas en el diagrama) para que reflejen la estructura real (plays con vistas create/list/detail y shared). Incluir la ruta `GET /api/plays/[id]` y la vista de detalle.

### 4.5 Tests

- **Situación:** No hay tests automatizados (no hay Jest/Vitest ni carpetas `__tests__`/`*.test.ts`).
- **Recomendación (mínimo para “completamente funcional”):**
  - Tests unitarios de **reglas de negocio**: `createPlayUseCase` (validaciones: 2 jugadores, nombres vacíos, juego vacío, fecha); `computeStats` / `computeGameStats` / `computePlayerStats` con plays de fixture.
  - Opcional: un test de integración de una ruta API (p. ej. GET /api/plays con mock de auth y de repository) para asegurar que el BFF responde 401 sin sesión y 200 con datos mockeados.
- No es estrictamente obligatorio para un MVP personal, pero da confianza al cambiar código y al añadir después roles/permisos/DB.

### 4.6 Accesibilidad y semántica

- **Situación:** Formularios y listas son usables; no se ha revisado a fondo a11y.
- **Recomendación:** Revisar al menos: asociación label/input (ya usas `htmlFor`/`id`), contraste de errores (rojo sobre fondo claro/oscuro), y que los enlaces “Volver” y acciones principales sean claros para lectores de pantalla. PlayCard como `<Link>` está bien para teclado y a11y.

### 4.7 Manejo de errores en cliente (SWR)

- **Situación:** Varias páginas usan SWR con `error` y muestran un mensaje genérico; en algunos casos no hay retry explícito.
- **Recomendación:** Valorar `errorRetryCount` y `onError` en SWR donde sea crítico (p. ej. listado de plays), y mensajes algo más específicos cuando `error.response?.status === 401` (p. ej. “Sesión expirada”) para poder redirigir a login si se desea.

---

## 5. Comentarios menores

- **next.config.ts:** Solo `images.remotePatterns` para Google (avatares). Si en el futuro se sirven más dominios (p. ej. BGG), añadirlos ahí.
- **Cache TTL (sheetsCache):** 60 minutos está bien para reducir carga; si se prioriza consistencia fuerte tras “crear play” o “sync”, la invalidación actual ya fuerza refresco en la siguiente lectura.
- **Idioma:** Mezcla de inglés (código, algunos labels) y español (mensajes de error y varios textos de UI). Para un único equipo está bien; si se abre a más usuarios, conviene un criterio (i18n o todo en un idioma).
- **CreatePlayPage myGames:** El fallback a array vacío en `plays/new/page.tsx` cuando `getAllMyGames()` falla es correcto; el formulario sigue usable con BGG search.

---

## 6. Checklist rápido “listo para producción” (MVP)

| Área              | Estado | Notas                                              |
|-------------------|--------|----------------------------------------------------|
| Auth (login/logout)| OK     | Google OAuth; sesión en cookie                     |
| Protección API    | OK     | Todas las rutas exigen sesión                     |
| Protección rutas  | FALTA  | Activar middleware (ver 3.1)                      |
| Crear play        | OK     | Validación, My Games + BGG, feedback de errores   |
| Listar plays      | OK     | Lista + detalle por play                          |
| Estadísticas      | OK     | Overview, por juego, por jugador                 |
| My Games          | OK     | Listar, añadir, sync BGG                          |
| Env y deploy      | OK     | .env.example y README con Vercel                  |
| Validación env    | Mejora | Evitar 500 genéricos por env faltante (4.1)      |
| Tests             | Mejora | Al menos lógica de negocio (4.5)                 |

---

## 7. Conclusión

La app es **funcional de punta a punta** para registrar partidas, ver listado y detalle, estadísticas y colección de juegos, con APIs protegidas y buena separación de responsabilidades. El único punto **crítico** es activar el **middleware** para proteger las rutas `/plays` y `/games` y redirigir a login cuando no haya sesión. El resto son mejoras de robustez (env, validación de body/fecha, tests, documentación y opcionalmente a11y y manejo de errores en cliente). Con el middleware corregido y, en la medida de lo posible, validación de env y algún test de lógica de negocio, se puede considerar el MVP “completamente funcional” para uso real (sin roles, permisos, DB centralizada ni grupos).
