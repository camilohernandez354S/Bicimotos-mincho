# Bicimotos Mincho - Backend API

API REST para la tienda online de componentes de bicicletas Bicimotos Mincho.

## 🚀 Características

- **Base de datos**: PostgreSQL con Sequelize ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Validación**: Express Validator
- **Estructura**: MVC con rutas organizadas

## 📋 Requisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd bicimotos-mincho/backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bicimotos_mincho
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_cambiar_en_produccion
```

4. **Configurar PostgreSQL**
```sql
-- Crear base de datos
CREATE DATABASE bicimotos_mincho;

-- Crear usuario (opcional)
CREATE USER bicimotos_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE bicimotos_mincho TO bicimotos_user;
```

5. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Información del usuario actual
- `PUT /api/auth/profile` - Actualizar perfil
- `POST /api/auth/change-password` - Cambiar contraseña

### Productos
- `GET /api/products` - Listar productos (con filtros y paginación)
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/products/featured/list` - Productos destacados
- `GET /api/products/category/:categoryId` - Productos por categoría

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría por ID
- `GET /api/categories/slug/:slug` - Obtener categoría por slug
- `POST /api/categories` - Crear categoría (Admin)
- `PUT /api/categories/:id` - Actualizar categoría (Admin)
- `DELETE /api/categories/:id` - Eliminar categoría (Admin)

### Carrito de Compras
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/add` - Agregar producto al carrito
- `PUT /api/cart/update` - Actualizar cantidad
- `DELETE /api/cart/remove` - Remover producto
- `DELETE /api/cart/clear` - Limpiar carrito

### Órdenes
- `GET /api/orders` - Listar órdenes del usuario
- `GET /api/orders/:id` - Obtener orden específica
- `POST /api/orders` - Crear nueva orden
- `PUT /api/orders/:id/cancel` - Cancelar orden

## 🗄️ Modelos de Datos

### User
- Información del usuario, autenticación y roles

### Category
- Categorías de productos con jerarquía

### Product
- Productos con especificaciones, imágenes y stock

### Cart
- Carrito de compras del usuario

### Order
- Órdenes de compra con estados y pagos

## 🔒 Seguridad

- **JWT**: Autenticación basada en tokens
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso cross-origin
- **Rate Limiting**: Límite de requests por IP
- **Validación**: Validación de entrada con express-validator
- **Bcrypt**: Hash de contraseñas

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts Disponibles

- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `npm test` - Ejecutar tests

## 🌐 Despliegue

### Variables de entorno para producción:
```env
NODE_ENV=production
DB_HOST=tu_host_de_produccion
DB_PASSWORD=password_seguro
JWT_SECRET=jwt_secret_muy_seguro
```

### Docker (opcional)
```bash
docker build -t bicimotos-backend .
docker run -p 5000:5000 bicimotos-backend
```

## 📞 Soporte

Para soporte técnico o preguntas sobre la API, contacta al equipo de desarrollo.

---

**Bicimotos Mincho** - Tu tienda de confianza para componentes Shimano 🚴‍♂️
