@echo off
title EcovibesXpress
color 0d

echo.
echo  ====================================================
echo    EcovibesXpress — Iniciando aplicacion...
echo  ====================================================
echo.

REM ─── Check venv ───────────────────────────────────────────────────
if not exist "backend\venv\Scripts\activate.bat" (
    echo  [ERROR] Entorno virtual no encontrado.
    echo          Ejecuta install.bat primero.
    pause
    exit /b 1
)

REM ─── Start FastAPI backend ─────────────────────────────────────────
echo  [1/2] Iniciando servidor Python (puerto 322)...
start "EcovibesXpress - Backend" /min cmd /c "backend\venv\Scripts\activate.bat && uvicorn main:app --app-dir backend --host 0.0.0.0 --port 322 --reload"

REM ─── Wait for backend to be ready ─────────────────────────────────
echo  Esperando al servidor...
timeout /t 3 /nobreak >nul

REM ─── Start Vite frontend ──────────────────────────────────────────
echo  [2/2] Iniciando interfaz web...
start "EcovibesXpress - Frontend" /min cmd /c "cd frontend && npm run dev"

REM ─── Wait and open browser ────────────────────────────────────────
timeout /t 4 /nobreak >nul
echo  Abriendo navegador en http://localhost:5173
start http://localhost:5173

echo.
echo  ====================================================
echo    La aplicacion esta corriendo!
echo    Cierra esta ventana para detener todo.
echo  ====================================================
echo.
echo  Presiona cualquier tecla para apagar EcovibesXpress...
pause >nul

REM ─── Kill processes on exit ────────────────────────────────────────
echo  Cerrando servidores...
taskkill /f /fi "WINDOWTITLE eq EcovibesXpress - Backend*" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq EcovibesXpress - Frontend*" >nul 2>&1
taskkill /f /im uvicorn.exe >nul 2>&1

echo  Apagado correctamente. Hasta luego!
timeout /t 2 /nobreak >nul
