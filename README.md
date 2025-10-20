# Bicimotos Mincho - Sistema de Gestión

Sistema web para la gestión de componentes de bicicletas, especialmente productos Shimano. El sitio es completamente público para visitantes y tiene un panel privado exclusivo para administradores.

## 🚀 Características

### Públicas (Sin registro requerido)
- ✅ **Catálogo de productos** con filtros y búsqueda
- ✅ **Detalle de productos** con especificaciones técnicas
- ✅ **Información de contacto** y formulario de consultas
- ✅ **Diseño responsive** y moderno
- ✅ **Navegación intuitiva** con categorías

### Administración (Login requerido)
- 🔐 **Login seguro** con JWT
- 📊 **Dashboard** con estadísticas en tiempo real
- 📦 **Gestión de productos** (CRUD completo)
- 👥 **Gestión de usuarios** (CRUD completo)
- 📧 **Mensajes de contacto** con sistema de respuestas
- 📈 **Reportes y estadísticas**

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** para autenticación
- **Bcrypt** para encriptación
- **CORS** y **Helmet** para seguridad

### Frontend
- **React** + **React Router**
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Hot Toast** para notificaciones
- **Axios** para llamadas API

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd bicimotos-mincho
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```

### 4. Configurar variables de entorno

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Editar el archivo `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bicimotos-mincho
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```bash
cd frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 5. Iniciar MongoDB
Asegúrate de que MongoDB esté ejecutándose en tu sistema.

### 6. Ejecutar la aplicación

#### Terminal 1 - Backend
```bash
cd backend
npm start
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

## 🌐 Acceso a la Aplicación

### Sitio Público
- **URL**: http://localhost:3000
- **Rutas disponibles**:
  - `/` - Página de inicio
  - `/productos` - Catálogo de productos
  - `/producto/:id` - Detalle de producto
  - `/contacto` - Formulario de contacto

### Panel de Administración
- **URL**: http://localhost:3000/admin/login
- **Credenciales por defecto**:
  - **Email**: admin@bicimotosmincho.com
  - **Contraseña**: BicimotosMincho2024!

## 📁 Estructura del Proyecto

```
bicimotos-mincho/
├── backend/
│   ├── src/
│   │   ├── models/          # Modelos de MongoDB
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── middlewares/     # Middlewares (JWT, etc.)
│   │   ├── routes/          # Rutas públicas y privadas
│   │   └── app.js          # Configuración principal
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── pages/          # Páginas principales
│   │   ├── components/     # Componentes reutilizables
│   │   ├── services/       # Servicios de API
│   │   └── App.jsx         # Configuración de rutas
│   ├── package.json
│   └── public/
└── README.md
```

## 🔧 API Endpoints

### Públicos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/categories` - Listar categorías
- `POST /api/contact` - Enviar mensaje de contacto

### Privados (Admin)
- `POST /api/admin/login` - Login de administrador
- `GET /api/admin/dashboard` - Dashboard con estadísticas
- `GET /api/admin/products` - Gestión de productos
- `POST /api/admin/products` - Crear producto
- `PUT /api/admin/products/:id` - Actualizar producto
- `DELETE /api/admin/products/:id` - Eliminar producto

## 🔐 Seguridad

- **JWT** para autenticación de administradores
- **Bcrypt** para encriptación de contraseñas
- **Rate limiting** para prevenir ataques
- **CORS** configurado para el frontend
- **Helmet** para headers de seguridad
- **Validación** de datos en backend y frontend

## 🎨 Personalización

### Colores de marca
Los colores principales están definidos en `frontend/tailwind.config.js`:
- **Primary**: #DC2626 (Rojo)
- **Secondary**: #F59E0B (Amarillo)
- **Accent**: #000000 (Negro)

### Componentes
Todos los componentes están en `frontend/src/components/` y son completamente personalizables.

## 🚀 Despliegue

### Backend (Heroku, Railway, etc.)
1. Configurar variables de entorno en el servicio
2. Conectar a MongoDB Atlas
3. Desplegar el código

### Frontend (Vercel, Netlify, etc.)
1. Configurar `REACT_APP_API_URL` con la URL del backend
2. Desplegar el código

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: info@bicimotosmincho.com
- **Teléfono**: +57 300 123 4567

## 📄 Licencia

Este proyecto es privado y está destinado exclusivamente para Bicimotos Mincho.

---

**Desarrollado con ❤️ para Bicimotos Mincho**