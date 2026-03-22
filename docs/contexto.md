# Especificaciones del Proyecto: Video Downloader - EcovibesXpress

Este documento detalla los requerimientos y el funcionamiento esperado para la aplicación de descarga de contenido desde YouTube, optimizando la experiencia de usuario y la calidad de los archivos obtenidos.

## 1. Propósito de la Aplicación
El objetivo principal es proporcionar una herramienta eficiente que permita descargar vídeos individuales y listas de reproducción completas de YouTube mediante la simple introducción de un enlace (URL).

## 2. Funcionalidades Principales

### 2.1 Descargas por Enlace
- **Entrada de Datos:** El usuario podrá pegar el enlace directo del vídeo o de la lista de reproducción.
- **Automatización:** Una vez validado el enlace, la descarga puede iniciarse automáticamente o tras confirmar las preferencias del usuario.

### 2.2 Selección de Formato
Antes de procesar la descarga, el sistema debe preguntar al usuario el formato de salida deseado:
- **Formato Video:** Descarga del archivo con imagen y sonido (MP4 o MKV preferiblemente).
- **Formato Audio:** Extracción exclusiva del sonido (MP3 o WAV), ideal para podcasts o música.

### 2.3 Gestión de Listas de Reproducción
Para las listas de reproducción (`playlists`), la aplicación ofrecerá un tratamiento organizado:
- **Estructura de Carpetas:** Todos los vídeos pertenecientes a una lista se descargarán de forma individual dentro de una carpeta específica con el nombre de la playlist para facilitar su gestión.

### 2.4 Control de Calidad
- **Ajuste Manual:** El usuario podrá elegir entre diferentes resoluciones (360p, 720p, 1080p, 4K, etc.).
- **Configuración por Defecto:** Si el usuario no especifica una calidad, la aplicación seleccionará automáticamente la **mejor calidad disponible** para asegurar la máxima fidelidad.

## 3. Flujo de Experiencia de Usuario (UX)

1. **Introducción del Link:** El usuario pega la URL de YouTube.
2. **Detección de Tipo:** La app identifica si es un vídeo único o una playlist.
3. **Configuración Rápida:**
   - Selección de Tipo: ¿Audio o Vídeo?
   - Selección de Calidad: (Listado desplegable o "Máxima Calidad").
   - Confirmación de carpeta (en caso de playlists).
4. **Ejecución y Progreso:** Visualización del estado de la descarga en tiempo real.
5. **Finalización:** Notificación de que los archivos están listos en el directorio local.

## 4. Consideraciones Técnicas (Recomendaciones)
- **Motor de Descarga:** Se recomienda el uso de librerías como `yt-dlp` por su estabilidad y constantes actualizaciones frente a cambios en la API de YouTube.
- **Interfaz:** Una interfaz limpia y minimalista que priorice la rapidez de acción.
- **Compatibilidad:** Soporte para los codecs de vídeo y audio más comunes para asegurar que los archivos funcionen en cualquier dispositivo.
