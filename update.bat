@echo off
title EcovibesXpress — Actualizador
color 0d

echo.
echo  ====================================================
echo    EcovibesXpress — Buscando actualizaciones...
echo  ====================================================
echo.

REM ─── Check Git ───────────────────────────────────────────────────
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [AVISO] Git no detectado. Intentando descargar directamente desde GitHub...
    powershell -Command "Write-Host 'Descargando ultima version (ZIP)...' -ForegroundColor CyAn; Invoke-WebRequest -Uri 'https://github.com/isaactabals-ship-it/EcovibesXpress_dowloader-/archive/refs/heads/main.zip' -OutFile 'update.zip'; Write-Host 'Extrayendo archivos...' -ForegroundColor CyAn; Expand-Archive -Path 'update.zip' -DestinationPath 'temp_update' -Force; Copy-Item -Path 'temp_update\EcovibesXpress_dowloader--main\*' -Destination '.' -Recurse -Force; Remove-Item -Path 'update.zip', 'temp_update' -Recurse -Force"
    if errorlevel 1 (
        echo  [ERROR] No se pudo descargar la actualizacion. Reinstala el programa o instala Git.
        pause
        exit /b 1
    )
    goto DEPENDENCIES
)

REM ─── Update from GitHub (Git Mode) ───────────────────────────────
set "REPO_URL=https://github.com/isaactabals-ship-it/EcovibesXpress_dowloader-.git"

if not exist ".git" (
    echo  [!] El repositorio no esta inicializado. Descargando archivos...
    git init
    git remote add origin %REPO_URL%
    git fetch --depth 1
    git reset --hard origin/main
) else (
    echo  [1/2] Sincronizando con el repositorio remoto...
    git remote set-url origin %REPO_URL%
    git fetch --all
    git reset --hard origin/main
)

:DEPENDENCIES

echo.
echo  [2/2] Verificando y actualizando dependencias...
echo  - Actualizando backend (Python)...
if exist "backend\venv\Scripts\activate.bat" (
    call backend\venv\Scripts\activate.bat
    pip install -r backend\requirements.txt --quiet
) else (
    echo    [AVISO] No se encontro el entorno virtual del backend.
)

echo  - Actualizando frontend (Node.js)...
if exist "frontend\package.json" (
    cd frontend
    call npm install --silent
    cd ..
) else (
    echo    [AVISO] No se encontro la carpeta del frontend.
)

echo.
echo  ====================================================
echo    ¡Actualizacion completada con exito!
echo    Ya puedes usar la ultima version de EcovibesXpress.
echo    Ejecuta start_app.bat para iniciar.
echo  ====================================================
echo.
pause
