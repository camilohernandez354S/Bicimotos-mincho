@echo off
echo Limpiando repositorio para reducir tamaño...

echo.
echo 1. Eliminando node_modules del historial de Git...
git rm -r --cached frontend/node_modules/ 2>nul
git rm -r --cached backend/node_modules/ 2>nul

echo.
echo 2. Eliminando archivos de build...
git rm -r --cached frontend/build/ 2>nul
git rm -r --cached backend/build/ 2>nul
git rm -r --cached frontend/dist/ 2>nul
git rm -r --cached backend/dist/ 2>nul

echo.
echo 3. Eliminando archivos de log...
git rm --cached *.log 2>nul
git rm --cached frontend/*.log 2>nul
git rm --cached backend/*.log 2>nul

echo.
echo 4. Eliminando archivos temporales...
git rm --cached .DS_Store 2>nul
git rm --cached Thumbs.db 2>nul
git rm --cached *.tmp 2>nul

echo.
echo 5. Agregando archivos al staging...
git add .gitignore
git add .

echo.
echo 6. Verificando tamaño del repositorio...
git count-objects -vH

echo.
echo Limpieza completada. Ahora puedes hacer commit y push:
echo git commit -m "Clean repository: remove large files and add .gitignore"
echo git push origin develop

pause
