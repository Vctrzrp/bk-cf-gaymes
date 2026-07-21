# Crossfit Gaymes Backend

API REST construida con NestJS para el sitio público y el panel React Admin de Crossfit Gaymes.

## Tecnologías

- NestJS y TypeScript
- JWT para autenticación
- Swagger/OpenAPI
- Prisma preparado para PostgreSQL
- Docker y Docker Compose
- Persistencia mock en memoria durante esta etapa

> PostgreSQL y Prisma todavía no se consumen en runtime. Los datos se almacenan en memoria y se reinician cada vez que se reinicia la API. El esquema Prisma queda preparado para la siguiente etapa.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior
- Docker opcional

## Configuración local

```bash
cp .env.example .env
npm install
npm run start:dev
```

La API queda disponible en:

```text
http://localhost:8080/api
```

Swagger:

```text
http://localhost:8080/api/docs
```

## Credenciales mock

```text
Usuario: admin
Contraseña: admin123
```

Ejemplo:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'
```

Los endpoints administrativos requieren:

```http
Authorization: Bearer <token>
```

La sesión JWT expira después de 5 minutos. Este tiempo puede modificarse mediante
`JWT_EXPIRES_IN`, pero el valor recomendado para este proyecto es `5m`.

## Endpoints

### Salud

```http
GET /api/health
```

### Autenticación

```http
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

### WODs

```http
GET    /api/wods
GET    /api/wods/:id
POST   /api/wods
PUT    /api/wods/:id
DELETE /api/wods/:id
```

### Participantes por WOD

```http
GET    /api/wods/:wodId/participants
POST   /api/wods/:wodId/participants
DELETE /api/wods/:wodId/participants/:participantId
```

Asignar un participante crea un resultado en estado `pending` con cero puntos.

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

### Leaderboards públicos

```http
GET /api/wods/:wodId/leaderboard
GET /api/leaderboards/general
GET /api/leaderboards/general/:participantId
```

### Home público

Ambas rutas entregan la misma vista agregada durante esta etapa:

```http
GET /api/competitions/featured
GET /api/public/home
```

La respuesta incluye información del evento, WODs, actividades, leaderboard por WOD y leaderboard general.

## Compatibilidad con React Admin

Las listas aceptan los parámetros de `ra-data-simple-rest`:

```text
sort=["name","ASC"]
range=[0,24]
filter={"status":"active"}
```

Ejemplo:

```http
GET /api/participants?sort=["lastName","ASC"]&range=[0,24]&filter={"status":"active"}
```

La API responde los encabezados:

```http
Content-Range: participants 0-4/5
X-Total-Count: 5
```

CORS expone ambos encabezados al navegador.

## Docker

Levantar solamente la API mock:

```bash
docker compose up --build
```

Levantar también PostgreSQL, aunque la API todavía no lo consume:

```bash
docker compose --profile database up --build
```

Detener los contenedores:

```bash
docker compose down
```

## Prisma

El modelo futuro se encuentra en `prisma/schema.prisma` e incluye:

- usuarios
- participantes
- WODs
- actividades
- resultados

Cuando se active PostgreSQL:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name initial_schema
```

Antes de hacerlo será necesario reemplazar `MockStoreService` por repositorios basados en Prisma.

## Logging

La API registra:

- inicio y resultado de cada solicitud HTTP
- código de respuesta y duración
- altas, modificaciones y eliminaciones
- intentos de autenticación fallidos
- advertencia explícita cuando la persistencia mock está activa

No se registran contraseñas ni tokens.
