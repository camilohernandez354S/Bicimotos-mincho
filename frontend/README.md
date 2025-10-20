# Bicimotos Mincho - Frontend

Frontend de la tienda online de componentes de bicicletas Bicimotos Mincho, desarrollado con React y Tailwind CSS.

## 🚀 Características

- **Framework**: React 18 con hooks modernos
- **Estilos**: Tailwind CSS con tema personalizado
- **Estado**: Context API para autenticación y carrito
- **HTTP**: Axios para comunicación con la API
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide React
- **Formularios**: React Hook Form
- **Responsive**: Diseño completamente responsive

## 📋 Requisitos

- Node.js (v16 o superior)
- npm o yarn
- Backend API funcionando

## 🛠️ Instalación

1. **Instalar dependencias**
```bash
cd frontend
npm install
```

2. **Configurar variables de entorno**
Crear archivo `.env` en la raíz del frontend:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MERCADOPAGO_PUBLIC_KEY=tu_mercadopago_public_key
REACT_APP_PAYPAL_CLIENT_ID=tu_paypal_client_id
```

3. **Ejecutar la aplicación**
```bash
# Desarrollo
npm start

# Producción
npm run build
```

## 🎨 Tema y Colores

El proyecto utiliza un tema personalizado con los siguientes colores:

- **Negro**: `#000000` - Fondo principal
- **Rojo**: `#FF0000` - Acentos y botones principales
- **Amarillo**: `#FFF200` - Texto principal y elementos destacados

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Hero.jsx        # Sección principal
│   ├── ProductCard.jsx # Tarjeta de producto
│   ├── CartSidebar.jsx # Sidebar del carrito
│   └── ...
├── contexts/           # Contextos de React
│   ├── AuthContext.js  # Contexto de autenticación
│   └── CartContext.js  # Contexto del carrito
├── services/           # Servicios de API
│   └── api.js         # Configuración de Axios
├── config/            # Configuración de la app
│   └── index.js       # Constantes y utilidades
├── pages/             # Páginas de la aplicación
├── App.jsx           # Componente principal
└── index.js          # Punto de entrada
```

## 🔧 Componentes Principales

### ProductCard
Componente para mostrar productos con:
- Imagen del producto
- Información básica (nombre, precio, descripción)
- Botón de agregar al carrito
- Indicador de stock
- Rating de productos

### CartSidebar
Sidebar deslizable para el carrito de compras:
- Lista de productos
- Controles de cantidad
- Resumen de precios
- Botón de checkout

### Header
Header principal con:
- Logo y navegación
- Icono del carrito con contador
- Botón de usuario/login
- Menú móvil responsive

## 🔐 Autenticación

El sistema de autenticación incluye:

- **Registro** de nuevos usuarios
- **Login** con email y contraseña
- **Gestión de sesión** con JWT
- **Protección de rutas** privadas
- **Actualización de perfil**

## 🛒 Carrito de Compras

Funcionalidades del carrito:

- **Agregar productos** con validación de stock
- **Actualizar cantidades** en tiempo real
- **Remover productos** individualmente
- **Calcular totales** automáticamente
- **Persistencia** en el servidor

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎯 Funcionalidades

### Para Usuarios No Autenticados
- Ver catálogo de productos
- Ver detalles de productos
- Navegar por categorías
- Ver información de contacto

### Para Usuarios Autenticados
- Todas las funcionalidades anteriores +
- Agregar productos al carrito
- Gestionar carrito de compras
- Realizar pedidos
- Ver historial de pedidos
- Actualizar perfil

## 🔌 Integración con API

El frontend se comunica con el backend a través de:

- **Autenticación**: `/api/auth/*`
- **Productos**: `/api/products/*`
- **Categorías**: `/api/categories/*`
- **Carrito**: `/api/cart/*`
- **Órdenes**: `/api/orders/*`

## 🚀 Despliegue

### Variables de entorno para producción:
```env
REACT_APP_API_URL=https://api.bicimotosmincho.com/api
REACT_APP_MERCADOPAGO_PUBLIC_KEY=tu_mercadopago_public_key_prod
REACT_APP_PAYPAL_CLIENT_ID=tu_paypal_client_id_prod
```

### Build para producción:
```bash
npm run build
```

Los archivos estáticos se generan en la carpeta `build/`.

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts Disponibles

- `npm start` - Ejecutar en desarrollo
- `npm run build` - Build para producción
- `npm test` - Ejecutar tests
- `npm run eject` - Ejectar configuración (no recomendado)

## 🐛 Debugging

Para debuggear la aplicación:

1. **React Developer Tools** - Extensión del navegador
2. **Redux DevTools** - Si se implementa Redux en el futuro
3. **Network Tab** - Para verificar llamadas a la API
4. **Console** - Para logs y errores

## 📞 Soporte

Para soporte técnico o preguntas sobre el frontend, contacta al equipo de desarrollo.

---

**Bicimotos Mincho** - Tu tienda de confianza para componentes Shimano 🚴‍♂️
