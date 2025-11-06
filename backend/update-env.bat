@echo off
echo ========================================
echo Actualizando archivo .env con PostgreSQL
echo ========================================
echo.

if not exist .env (
    echo ERROR: El archivo .env no existe.
    echo Ejecuta: copy env.example .env
    pause
    exit /b 1
)

echo Verificando variables de PostgreSQL en .env...
echo.

findstr /C:"DB_HOST" .env >nul
if %errorlevel% neq 0 (
    echo Agregando variables de PostgreSQL...
    (
        echo.
        echo # Base de datos PostgreSQL
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_NAME=bicimotos_mincho
        echo DB_USER=postgres
        echo DB_PASSWORD=20051322
    ) >> .env
    echo Variables de PostgreSQL agregadas exitosamente.
) else (
    echo Las variables de PostgreSQL ya existen.
    echo.
    echo IMPORTANTE: Verifica que DB_PASSWORD=20051322 en el archivo .env
    echo.
    echo Si la contraseña es diferente, edita manualmente el archivo .env
)

echo.
echo ========================================
echo Configuracion completada!
echo ========================================
echo.
echo Verifica el archivo .env y asegurate de que:
echo   - DB_PASSWORD=20051322
echo   - DB_NAME=bicimotos_mincho
echo   - DB_USER=postgres
echo.
pause
