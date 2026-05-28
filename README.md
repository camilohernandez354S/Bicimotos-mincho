# Bicimotos Mincho

Catálogo web de productos para la bicicletería **Bicimotos Mincho** (bicicletas, marcos, accesorios y componentes).
El cliente navega el catálogo y se contacta por **WhatsApp** para concretar la compra.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express + Prisma
- **Base de datos:** PostgreSQL (local, administrada con pgAdmin 4)
- **Imágenes:** Cloudinary
- **Auth admin:** JWT

## Estructura

```
.
├── backend/        # API REST en Express + Prisma
└── frontend/       # SPA en React + Vite (próximamente)
```

## Cómo correr el proyecto en local

### Requisitos
- Node.js 20+
- PostgreSQL 15+ con una base de datos llamada `bicimotos_mincho`

### Backend
```bash
cd backend
npm install
cp .env.example .env       # editar con credenciales de tu Postgres
npx prisma migrate dev     # crea las tablas en la DB
npm run dev                # arranca el servidor en http://localhost:4000
```

### Frontend
_(pendiente — se construye en la Fase 2)_

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor está vivo |
| GET | `/api/productos` | Lista todos los productos activos |
| GET | `/api/productos/:id` | Detalle de un producto |
| GET | `/api/categorias` | Lista de categorías |
