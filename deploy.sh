#!/bin/bash

# Script de despliegue para Bicimotos Mincho
# Uso: ./deploy.sh [environment]
# environment: development, staging, production

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar argumentos
ENVIRONMENT=${1:-development}

if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    print_error "Entorno inválido. Usa: development, staging, o production"
    exit 1
fi

print_message "Iniciando despliegue en entorno: $ENVIRONMENT"

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado"
    exit 1
fi

# Crear directorios necesarios
print_message "Creando directorios necesarios..."
mkdir -p backend/uploads
mkdir -p nginx/ssl
mkdir -p logs

# Configurar variables de entorno según el ambiente
print_message "Configurando variables de entorno para $ENVIRONMENT..."

case $ENVIRONMENT in
    development)
        export NODE_ENV=development
        export DB_PASSWORD=password123
        export JWT_SECRET=dev_jwt_secret_change_in_production
        ;;
    staging)
        export NODE_ENV=staging
        export DB_PASSWORD=${STAGING_DB_PASSWORD:-staging_password}
        export JWT_SECRET=${STAGING_JWT_SECRET:-staging_jwt_secret}
        ;;
    production)
        export NODE_ENV=production
        export DB_PASSWORD=${PROD_DB_PASSWORD}
        export JWT_SECRET=${PROD_JWT_SECRET}
        
        if [[ -z "$PROD_DB_PASSWORD" || -z "$PROD_JWT_SECRET" ]]; then
            print_error "Variables de entorno de producción no configuradas"
            print_warning "Configura PROD_DB_PASSWORD y PROD_JWT_SECRET"
            exit 1
        fi
        ;;
esac

# Detener contenedores existentes
print_message "Deteniendo contenedores existentes..."
docker-compose down --remove-orphans

# Limpiar imágenes antiguas (solo en producción)
if [[ "$ENVIRONMENT" == "production" ]]; then
    print_message "Limpiando imágenes Docker antiguas..."
    docker system prune -f
fi

# Construir y levantar servicios
print_message "Construyendo y levantando servicios..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
print_message "Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado de los servicios
print_message "Verificando estado de los servicios..."

# Verificar PostgreSQL
if docker-compose exec -T postgres pg_isready -U postgres; then
    print_success "PostgreSQL está funcionando"
else
    print_error "PostgreSQL no está funcionando"
    exit 1
fi

# Verificar Backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "Backend API está funcionando"
else
    print_error "Backend API no está funcionando"
    exit 1
fi

# Verificar Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend está funcionando"
else
    print_error "Frontend no está funcionando"
    exit 1
fi

# Ejecutar migraciones de base de datos
print_message "Ejecutando migraciones de base de datos..."
docker-compose exec -T backend npm run migrate || print_warning "No se encontró script de migración"

# Mostrar información de acceso
print_success "Despliegue completado exitosamente!"
echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   Base de datos: localhost:5432"
echo ""
echo "📊 Comandos útiles:"
echo "   Ver logs: docker-compose logs -f"
echo "   Detener: docker-compose down"
echo "   Reiniciar: docker-compose restart"
echo ""

# Mostrar logs en tiempo real por 10 segundos
print_message "Mostrando logs iniciales..."
timeout 10 docker-compose logs -f || true

print_success "¡Bicimotos Mincho está listo para usar!"
