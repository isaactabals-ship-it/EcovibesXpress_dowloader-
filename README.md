# <img src="resources/logo-ecovibesxpress.png" width="36" align="center"> EcovibesXpress — YouTube Downloader

<p align="center">
  <img src="resources/logo-ecovibesxpress.png" alt="App Logo" width="120">
</p>

Una aplicación local moderna y potente para descargar vídeos y listas de reproducción de YouTube en formato MP4 o extraer audio en MP3 de alta calidad. 

🚀 **Repositorio oficial:** [https://github.com/isaactabals-ship-it/EcovibesXpress_dowloader-](https://github.com/isaactabals-ship-it/EcovibesXpress_dowloader-)

---

## ✨ Características principales

- 🎬 **Formatos múltiples:** Descarga vídeos en MP4/MKV o extrae audio en MP3 (192kbps).
- 📋 **Soporte de Playlists:** Descarga listas completas automáticamente organizadas en carpetas con el nombre de la playlist.
- 🔷 **Calidad de vídeo:** Selecciona desde 360p hasta 4K (2160p) — si no se especifica, se descarga la mejor calidad disponible.
- ⚡ **Progreso en tiempo real:** Visualiza el % de descarga, velocidad (MB/s) y tiempo estimado (ETA).
- ✨ **Interfaz Premium:** Diseño *glassmorphism* oscuro con acentos violetas, animaciones suaves y previsualización de vídeo antes de descargar.
- 🖱️ **Drag & Drop:** Arrastra los enlaces directamente a la aplicación.
- 📂 **Historial Local:** Consulta tus descargas anteriores directamente desde la interfaz.

---

## 🛠️ Requisitos previos

Para poder ejecutar la aplicación localmente, necesitas tener instalados:

1. **Python (3.9+)** — Asegúrate de marcar "Add Python to PATH" durante la instalación.
2. **Node.js (18+)**

---

## 🚀 Instalación y Uso

Sigue estos dos sencillos pasos para configurar y arrancar la aplicación:

### 1️⃣ Configuración inicial (Solo la primera vez)
Haz doble clic en el archivo:
```powershell
install.bat
```
*Este script creará el entorno virtual de Python, instalará todas las dependencias y descargará automáticamente el binario de **FFmpeg** necesario para procesar vídeo de alta calidad.*

### 2️⃣ Iniciar la aplicación
Cada vez que desees usar el descargador, haz doble clic en:
```powershell
start_app.bat
```
*Se abrirá automáticamente tu navegador en **http://localhost:5173** con la aplicación lista para usar.*

### 🔄 3️⃣ Mantenerse actualizado
Si deseas descargar las últimas mejoras y correcciones del programa, haz doble clic en:
```powershell
update.bat
```
*Este script descargará automáticamente los cambios más recientes desde GitHub y actualizará las dependencias necesarias.*

---

## 📂 Estructura del Proyecto

```
video_downloader-ecovibesxpress/
├── backend/            # Lógica en Python (FastAPI + yt-dlp)
├── frontend/           # Interfaz en React + Vite + Tailwind
├── docs/               # Documentación y especificaciones iniciales
├── downloads/          # Carpeta de salida por defecto (ignorado en git)
├── ffmpeg/             # Binarios de FFmpeg (ignorado en git)
├── resources/          # Logos e iconos del programa
├── .gitignore          # Configuración de archivos ignorados
├── install.bat         # Script de instalación automática
├── update.bat          # Script de actualización del programa
├── start_app.bat       # Script de arranque de la aplicación
├── generate_shortcut.bat # Generador de acceso directo con icono
└── README.md           # Este archivo
```

### 4️⃣ Generar un acceso directo (Opcional)
Si deseas tener un acceso directo con el icono oficial de la aplicación, ejecuta:
```powershell
generate_shortcut.bat
```
*Esto creará un archivo **EcovibesXpress.lnk** en la carpeta principal que podrás mover al escritorio o anclar al inicio.*

---

## ⚙️ Créditos y Tecnología

Este proyecto utiliza potentes herramientas bajo el capó:
- **[yt-dlp](https://github.com/yt-dlp/yt-dlp):** El motor principal de descarga.
- **[FastAPI](https://fastapi.tiangolo.com/):** Backend ultrarrápido con Python.
- **[React](https://reactjs.org/):** Moderno frontend SPA.
- **[Tailwind CSS](https://tailwindcss.com/):** Estilización moderna y responsiva.
- **[FFmpeg](https://ffmpeg.org/):** Procesamiento de streams de audio y vídeo.

---

Desarrollado con ❤️ para facilitarte el acceso a tu contenido favorito de forma local y privada.
