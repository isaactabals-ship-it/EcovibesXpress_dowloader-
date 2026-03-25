@echo off
title EcovibesXpress — Instalador
color 0d

echo.
echo  ====================================================
echo    EcovibesXpress — Instalacion inicial
echo  ====================================================
echo.

REM ─── Check Python ───────────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python no encontrado. Instala Python 3.9+ desde https://python.org
    pause
    exit /b 1
)
echo  [OK] Python detectado.

REM ─── Check Node ─────────────────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js no encontrado. Instala Node.js 18+ desde https://nodejs.org
    pause
    exit /b 1
)
echo  [OK] Node.js detectado.

REM ─── Python virtual environment ──────────────────────────────────
echo.
echo  [1/4] Creando entorno virtual de Python...
python -m venv backend\venv
call backend\venv\Scripts\activate.bat

echo  [2/4] Instalando dependencias Python (yt-dlp, FastAPI, uvicorn)...
pip install -r backend\requirements.txt --quiet

REM ─── Node dependencies ───────────────────────────────────────────
echo  [3/4] Instalando dependencias del frontend (npm)...
cd frontend
call npm install --silent
cd ..

REM ─── FFmpeg download ─────────────────────────────────────────────
echo  [4/4] Descargando FFmpeg (~120 MB)...
if not exist "ffmpeg" mkdir ffmpeg

REM Check if ffmpeg already exists
if exist "ffmpeg\ffmpeg.exe" (
    echo  [OK] FFmpeg ya esta instalado, saltando descarga.
) else (
    REM Download ffmpeg using PowerShell
    powershell -Command "& { $url = 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip'; $dest = 'ffmpeg\ffmpeg.zip'; Write-Host '  Descargando FFmpeg zip (~120 MB)...'; Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing; Write-Host '  Extrayendo binaries...'; Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead($dest); foreach ($entry in $zip.Entries) { if ($entry.Name -eq 'ffmpeg.exe' -or $entry.Name -eq 'ffprobe.exe') { [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, \"ffmpeg\$($entry.Name)\", $true) } }; $zip.Dispose(); Remove-Item $dest; Write-Host '  FFmpeg instalado correctamente.' }"
)

REM ─── Create downloads folder ─────────────────────────────────────
if not exist "downloads" mkdir downloads

echo.
echo  ====================================================
echo    Instalacion completada con exito!
echo    Ejecuta start_app.bat para iniciar la aplicacion.
echo  ====================================================
echo.
pause
