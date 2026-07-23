# Crossfit Gaymes Backend

API REST construida con NestJS, PostgreSQL y Prisma para el sitio público y el panel React Admin de Crossfit Gaymes.

## Tecnologías

- NestJS y TypeScript
- PostgreSQL con Prisma ORM
- JWT para autenticación administrativa
- Swagger/OpenAPI
- Docker y Docker Compose
- Logging de solicitudes y operaciones

## Requisitos

- Node.js 22 o superior
- npm 10 o superior
- PostgreSQL 15 o superior

## Configuración local

```bash
cp .env.example .env
npm install
```

Configura una conexión con el esquema `crossfit_gaymes`:

```env
DATABASE_URL="postgresql://crossfit_app:contraseña@localhost:5432/postgres?schema=crossfit_gaymes"
JWT_SECRET="una-clave-segura"
JWT_EXPIRES_IN="5m"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

No debes versionar `.env`.

## Base de datos

Generar Prisma Client, aplicar migraciones y cargar datos iniciales:

```bash
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
```

El seed es repetible y crea:

- el administrador configurado mediante `ADMIN_USERNAME` y `ADMIN_PASSWORD`;
- cinco participantes;
- cuatro WODs con sus actividades;
- resultados iniciales para los leaderboards.

La contraseña del administrador se almacena cifrada con bcrypt.

## Ejecución

```bash
npm run start:dev
```

- API: `http://localhost:8080/api`
- Swagger: `http://localhost:8080/api/docs`

Autenticación inicial, si no cambiaste las variables del seed:

```text
Usuario: admin
Contraseña: admin123
```

La sesión JWT dura 5 minutos. Los endpoints administrativos requieren:

```http
Authorization: Bearer <token>
```

## Endpoints

### Salud y autenticación

```http
GET  /api/health
POST /api/auth/login
POST /api/auth/logout
```

### Participantes

```http
GET    /api/participants
GET    /api/participants/:id
POST   /api/participants
PUT    /api/participants/:id
DELETE /api/participants/:id
```

### WODs y asignaciones

```http
GET    /api/wods
GET    /api/wods/:id
POST   /api/wods
PUT    /api/wods/:id
DELETE /api/wods/:id

GET    /api/wods/:wodId/participants
POST   /api/wods/:wodId/participants
DELETE /api/wods/:wodId/participants/:participantId
```

Asignar un participante crea un resultado `pending`, sin puntaje.

### Resultados

```http
GET    /api/results
GET    /api/results/:id
POST   /api/results
PUT    /api/results/:id
DELETE /api/results/:id
```

Estados soportados:

| Valor | Descripción |
|---|---|
| `pending` | Pendiente |
| `finished` | Finalizado |
| `dnf` | Comenzó, pero no terminó |

### Información pública

```http
GET /api/wods/:wodId/leaderboard
GET /api/leaderboards/general
GET /api/leaderboards/general/:participantId
GET /api/competitions/featured
GET /api/public/home
```

## React Admin

Las listas aceptan `sort`, `range` y `filter` en formato JSON y exponen las cabeceras requeridas:

```http
Content-Range: participants 0-4/5
X-Total-Count: 5
```

## Docker

La API necesita una `DATABASE_URL` accesible desde el contenedor. Para una base PostgreSQL externa o instalada en el host:

```bash
DATABASE_URL="postgresql://usuario:contraseña@host:5432/base?schema=crossfit_gaymes" docker compose up --build api
```

Para usar el PostgreSQL incluido en Compose:

```bash
docker compose --profile database up -d postgres
DATABASE_URL="postgresql://crossfit:crossfit@localhost:5432/crossfit_gaymes?schema=crossfit_gaymes" npm run prisma:deploy
DATABASE_URL="postgresql://crossfit:crossfit@localhost:5432/crossfit_gaymes?schema=crossfit_gaymes" npm run prisma:seed
docker compose --profile database up --build
```

Detener contenedores:

```bash
docker compose down
```

## Logging

La API registra conexión a PostgreSQL, solicitudes HTTP, duración, código de respuesta, operaciones CRUD e intentos fallidos de autenticación. No registra contraseñas ni tokens.
