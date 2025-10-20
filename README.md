# 🚴‍♂️ Bicimotos Mincho

**Tu tienda online de confianza para componentes Shimano**

Una plataforma completa de e-commerce especializada en componentes de bicicletas, especialmente productos Shimano originales. Desarrollada con tecnologías modernas para ofrecer la mejor experiencia de compra online.

## 🌟 Características Principales

- **🛒 Catálogo Completo**: Productos Shimano originales con información detallada
- **🛍️ Carrito Inteligente**: Gestión de compras en tiempo real
- **👤 Sistema de Usuarios**: Registro, login y gestión de perfiles
- **📱 Responsive Design**: Optimizado para todos los dispositivos
- **🔒 Seguridad**: Autenticación JWT y validación de datos
- **💳 Sistema de Pagos**: Integración con MercadoPago y PayPal
- **📦 Gestión de Órdenes**: Seguimiento completo del proceso de compra
- **🚀 Despliegue Fácil**: Docker y scripts automatizados

## 🏗️ Arquitectura del Proyecto

```
bicimotos-mincho/
├── backend/                 # API REST con Node.js y Express
│   ├── src/
│   │   ├── models/         # Modelos de Sequelize (PostgreSQL)
│   │   ├── routes/          # Rutas de la API
│   │   ├── controllers/     # Controladores de lógica
│   │   └── config/          # Configuración de BD
│   └── Dockerfile
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── contexts/        # Contextos de React
│   │   ├── services/        # Servicios de API
│   │   └── config/          # Configuración de la app
│   └── Dockerfile
├── nginx/                   # Configuración de Nginx
├── docker-compose.yml       # Orquestación de servicios
└── deploy.ps1              # Script de despliegue
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** (v16 o superior)
- **Docker** y **Docker Compose**
- **PostgreSQL** (si ejecutas localmente)

### Instalación con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd bicimotos-mincho
```

2. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp backend/env.example backend/.env

# Editar variables según tu entorno
# DB_PASSWORD, JWT_SECRET, etc.
```

3. **Desplegar con Docker**
```bash
# Windows PowerShell
.\deploy.ps1 development

# Linux/Mac
./deploy.sh development
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Base de datos: localhost:5432

### Instalación Manual

#### Backend
```bash
cd backend
npm install
cp env.example .env
# Configurar variables en .env
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express.js** - Servidor web
- **PostgreSQL** + **Sequelize** - Base de datos y ORM
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Express Validator** - Validación de datos
- **Helmet** - Seguridad HTTP
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - Framework de UI
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos
- **Context API** - Manejo de estado

### DevOps
- **Docker** + **Docker Compose** - Contenedores
- **Nginx** - Proxy reverso y servidor web
- **PostgreSQL** - Base de datos

## 📚 API Documentation

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Perfil del usuario

### Productos
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Obtener producto específico
- `GET /api/products/featured/list` - Productos destacados

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart/add` - Agregar producto
- `PUT /api/cart/update` - Actualizar cantidad
- `DELETE /api/cart/remove` - Remover producto

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `PUT /api/orders/:id/cancel` - Cancelar orden

## 🎨 Tema y Diseño

El proyecto utiliza un esquema de colores distintivo:

- **Negro** (`#000000`) - Fondo principal
- **Rojo** (`#FF0000`) - Acentos y botones
- **Amarillo** (`#FFF200`) - Texto principal

Diseño completamente responsive optimizado para:
- 📱 Mobile (320px - 767px)
- 📱 Tablet (768px - 1199px)
- 💻 Desktop (1200px+)

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bicimotos_mincho
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_seguro
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MERCADOPAGO_PUBLIC_KEY=tu_mercadopago_key
REACT_APP_PAYPAL_CLIENT_ID=tu_paypal_client_id
```

## 🚀 Despliegue en Producción

### Con Docker (Recomendado)

1. **Configurar variables de producción**
```bash
$env:PROD_DB_PASSWORD = "password_super_seguro"
$env:PROD_JWT_SECRET = "jwt_secret_muy_seguro"
```

2. **Desplegar**
```bash
.\deploy.ps1 production
```

### Manual

1. **Build del frontend**
```bash
cd frontend
npm run build
```

2. **Configurar servidor web** (Nginx/Apache)
3. **Configurar base de datos** PostgreSQL
4. **Ejecutar backend** con PM2 o similar

## 📊 Monitoreo y Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: info@bicimotosmincho.com
- **Teléfono**: +57 300 123 4567
- **WhatsApp**: [Enlace directo](https://wa.me/573001234567)

## 🙏 Agradecimientos

- **Shimano** por los productos de calidad
- **React** y **Node.js** communities
- **Tailwind CSS** por el framework de estilos
- Todos los contribuidores del proyecto

---

**Bicimotos Mincho** - Tu tienda de confianza para componentes Shimano 🚴‍♂️

*Desarrollado con ❤️ para la comunidad ciclista*