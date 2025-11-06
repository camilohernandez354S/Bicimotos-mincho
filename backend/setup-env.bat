@echo off
echo ========================================
echo Configuracion de variables de entorno
echo ========================================
echo.

if exist .env (
    echo El archivo .env ya existe.
    echo.
    choice /C SN /M "Deseas sobrescribirlo"
    if errorlevel 2 goto :end
    if errorlevel 1 goto :create
) else (
    goto :create
)

:create
echo.
echo Creando archivo .env...
echo.

(
echo # Configuracion del servidor
echo NODE_ENV=development
echo PORT=5000
echo.
echo # Base de datos PostgreSQL
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=bicimotos_mincho
echo DB_USER=postgres
echo DB_PASSWORD=20051322
echo.
echo # JWT Configuration
echo JWT_SECRET=bicimotos_mincho_jwt_secret_2024_cambiar_en_produccion
echo JWT_EXPIRES_IN=8h
echo.
echo # Frontend URL ^(para CORS^)
echo FRONTEND_URL=http://localhost:3000
) > .env

echo.
echo ========================================
echo Archivo .env creado exitosamente!
echo ========================================
echo.
echo IMPORTANTE: Edita el archivo .env y cambia:
echo   - DB_PASSWORD: Coloca tu contraseña de PostgreSQL
echo   - JWT_SECRET: Cambia por una clave secreta mas segura
echo.
echo El archivo .env esta en: %CD%\.env
echo.
pause

:end
