# Script de despliegue para Bicimotos Mincho (PowerShell)
# Uso: .\deploy.ps1 [environment]
# environment: development, staging, production

param(
    [Parameter(Position=0)]
    [ValidateSet("development", "staging", "production")]
    [string]$Environment = "development"
)

# Función para imprimir mensajes
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Info "Iniciando despliegue en entorno: $Environment"

# Verificar que Docker esté instalado
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
} catch {
    Write-Error "Docker o Docker Compose no están instalados"
    exit 1
}

# Crear directorios necesarios
Write-Info "Creando directorios necesarios..."
New-Item -ItemType Directory -Force -Path "backend\uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "nginx\ssl" | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

# Configurar variables de entorno según el ambiente
Write-Info "Configurando variables de entorno para $Environment..."

switch ($Environment) {
    "development" {
        $env:NODE_ENV = "development"
        $env:DB_PASSWORD = "password123"
        $env:JWT_SECRET = "dev_jwt_secret_change_in_production"
    }
    "staging" {
        $env:NODE_ENV = "staging"
        $env:DB_PASSWORD = if ($env:STAGING_DB_PASSWORD) { $env:STAGING_DB_PASSWORD } else { "staging_password" }
        $env:JWT_SECRET = if ($env:STAGING_JWT_SECRET) { $env:STAGING_JWT_SECRET } else { "staging_jwt_secret" }
    }
    "production" {
        $env:NODE_ENV = "production"
        if (-not $env:PROD_DB_PASSWORD -or -not $env:PROD_JWT_SECRET) {
            Write-Error "Variables de entorno de producción no configuradas"
            Write-Warning "Configura PROD_DB_PASSWORD y PROD_JWT_SECRET"
            exit 1
        }
        $env:DB_PASSWORD = $env:PROD_DB_PASSWORD
        $env:JWT_SECRET = $env:PROD_JWT_SECRET
    }
}

# Detener contenedores existentes
Write-Info "Deteniendo contenedores existentes..."
docker-compose down --remove-orphans

# Limpiar imágenes antiguas (solo en producción)
if ($Environment -eq "production") {
    Write-Info "Limpiando imágenes Docker antiguas..."
    docker system prune -f
}

# Construir y levantar servicios
Write-Info "Construyendo y levantando servicios..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
Write-Info "Esperando a que los servicios estén listos..."
Start-Sleep -Seconds 30

# Verificar estado de los servicios
Write-Info "Verificando estado de los servicios..."

# Verificar PostgreSQL
try {
    docker-compose exec -T postgres pg_isready -U postgres | Out-Null
    Write-Success "PostgreSQL está funcionando"
} catch {
    Write-Error "PostgreSQL no está funcionando"
    exit 1
}

# Verificar Backend
try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing | Out-Null
    Write-Success "Backend API está funcionando"
} catch {
    Write-Error "Backend API no está funcionando"
    exit 1
}

# Verificar Frontend
try {
    Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing | Out-Null
    Write-Success "Frontend está funcionando"
} catch {
    Write-Error "Frontend no está funcionando"
    exit 1
}

# Mostrar información de acceso
Write-Success "Despliegue completado exitosamente!"
Write-Host ""
Write-Host "🌐 URLs de acceso:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "   Base de datos: localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "📊 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   Detener: docker-compose down" -ForegroundColor White
Write-Host "   Reiniciar: docker-compose restart" -ForegroundColor White
Write-Host ""

Write-Success "¡Bicimotos Mincho está listo para usar!"
