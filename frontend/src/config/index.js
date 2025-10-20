// Configuración de la aplicación
export const config = {
  // URLs de la API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Configuración de la aplicación
  APP_NAME: 'Bicimotos Mincho',
  APP_VERSION: '1.0.0',
  
  // Configuración de pagos (para futuras integraciones)
  PAYMENT_CONFIG: {
    MERCADOPAGO_PUBLIC_KEY: process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY,
    PAYPAL_CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID,
  },
  
  // Configuración de imágenes
  IMAGE_CONFIG: {
    PLACEHOLDER_URL: 'https://via.placeholder.com/400x300',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
  
  // Configuración de carrito
  CART_CONFIG: {
    FREE_SHIPPING_THRESHOLD: 500000, // $500k COP
    SHIPPING_COST: 25000, // $25k COP
    TAX_RATE: 0.19, // 19% IVA
  },
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 100,
  },
  
  // Configuración de notificaciones
  NOTIFICATIONS: {
    TOAST_DURATION: 4000,
    POSITION: 'top-right',
  },
  
  // Configuración de validación
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 1000,
  },
  
  // Configuración de moneda
  CURRENCY: {
    CODE: 'COP',
    SYMBOL: '$',
    LOCALE: 'es-CO',
  },
  
  // Configuración de redes sociales
  SOCIAL_MEDIA: {
    FACEBOOK: 'https://facebook.com/bicimotosmincho',
    INSTAGRAM: 'https://instagram.com/bicimotosmincho',
    WHATSAPP: 'https://wa.me/573001234567',
  },
  
  // Configuración de contacto
  CONTACT: {
    EMAIL: 'info@bicimotosmincho.com',
    PHONE: '+57 300 123 4567',
    ADDRESS: 'Calle 123 #45-67, Bogotá, Colombia',
  },
};

// Función para formatear precios
export const formatPrice = (price) => {
  return new Intl.NumberFormat(config.CURRENCY.LOCALE, {
    style: 'currency',
    currency: config.CURRENCY.CODE,
    minimumFractionDigits: 0,
  }).format(price);
};

// Función para formatear fechas
export const formatDate = (date) => {
  return new Intl.DateTimeFormat(config.CURRENCY.LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Función para validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar teléfono colombiano
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+57|57)?[3][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Función para generar slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Función para truncar texto
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Función para calcular descuento
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Función para calcular envío
export const calculateShipping = (subtotal) => {
  return subtotal >= config.CART_CONFIG.FREE_SHIPPING_THRESHOLD 
    ? 0 
    : config.CART_CONFIG.SHIPPING_COST;
};

// Función para calcular total con impuestos
export const calculateTotal = (subtotal, shipping = 0, discount = 0) => {
  const taxAmount = (subtotal - discount) * config.CART_CONFIG.TAX_RATE;
  return subtotal + shipping + taxAmount - discount;
};

export default config;
