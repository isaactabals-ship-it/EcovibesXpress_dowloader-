# Roadmap Técnico y Requisitos: Video Downloader - EcovibesXpress

Este documento define la arquitectura técnica, las herramientas necesarias y el plan de desarrollo paso a paso para construir la aplicación de descarga de YouTube.

## 1. Stack Tecnológico Recomendado

Para lograr una aplicación moderna, fluida y multiplataforma (Windows), se propone:

- **Backend (Servidor Local):** Python con **FastAPI** o **Flask** (ideal para integrar `yt-dlp` de forma nativa).
- **Frontend (Interfaz):** React + Vite + Tailwind CSS (servido localmente para una experiencia fluida).
- **Lanzador:** Un archivo `.bat` que automatiza el arranque del servidor y abre el navegador en `localhost`.
- **Motor de Descarga:** `yt-dlp` (librería de Python).
- **Procesamiento:** FFmpeg (binario local para el procesado de medios).

---

## 2. Requisitos Previos

El desarrollador y el usuario final necesitarán tener instalados los siguientes componentes:

### Requisitos de Desarrollo
- **Node.js (v18+):** Motor para ejecutar Electron y gestionar paquetes npm.
- **Python (3.9+):** Requerido para ejecutar `yt-dlp` en segundo plano.
- **Git:** Para control de versiones.

### Dependencias Críticas (Runtime)
1. **yt-dlp:** Se puede incluir como un binario dentro de la aplicación para que el usuario no tenga que instalarlo manualmente.
2. **FFmpeg:** Crucial para combinar flujos de audio y video en resoluciones superiores a 720p.

---

## 3. Arquitectura del Sistema

La aplicación se dividirá en tres capas:

1. **Interfaz Web (Browser):**
   - Corre en el navegador del usuario en `http://localhost:0322`.
   - Envía peticiones (POST/GET) al servidor local.
2. **Servidor Local (Python):**
   - Recibe las URLs y parámetros de descarga.
   - Ejecuta `yt-dlp` y gestiona los archivos en el disco local del equipo.
3. **Lanzador (.bat):**
   - Orquestador que inicia el entorno virtual de Python y el servidor con un solo clic.

---

## 4. Roadmap de Desarrollo (Fases)

### Fase 1: Entorno y Servidor Base (MVP)
- [ ] Creación del entorno virtual de Python (`venv`).
- [ ] Configuración del servidor **FastAPI/Flask** básico.
- [ ] Punto de control (Endpoint) para recibir una URL y descargar un video de prueba.
- [ ] Creación del archivo `start_app.bat` para automatizar el arranque.

### Fase 2: Interfaz React y Comunicación
- [ ] Configuración de **Vite + React** para el frontend.
- [ ] Conexión vía `fetch/axios` entre el navegador y el servidor local.
- [ ] Implementación de WebSockets o Server-Sent Events (SSE) para ver el progreso de descarga en tiempo real en la UI.

### Fase 3: Lógica Avanzada (Playlists y Formatos)
- [ ] Soporte para descarga de audios (MP3) y selección de resoluciones.
- [ ] Lógica de carpetas inteligentes para playlists.
- [ ] Integración de un binario local de FFmpeg para procesamiento.

### Fase 4: Pulido y UX Premium
- [ ] Interfaz estética con Tailwind CSS (Modo Oscuro, Glassmorphism).
- [ ] Drag & Drop para URLs.
- [ ] Sistema de logs visuales en la web.

### Fase 5: Portabilidad Local
- [ ] Script de instalación único (`install.bat`) que instale todas las dependencias (Python libs, FFmpeg).
- [ ] Optimización del lanzador `.bat` para cerrar procesos al salir.

---

## 5. Estimación de Tiempos (Referencia)

| Tarea | Esfuerzo Estimado |
| :--- | :--- |
| Configuración y MVP | 3-5 días |
| Lógica de Formatos y FFmpeg | 4-6 días |
| Gestión de Playlists | 3-4 días |
| Diseño UI/UX y Pulido | 5-7 días |
| Empaquetado y Pruebas | 2-3 días |

---

## 6. Próximos Pasos Sugeridos

1. **Instalar dependencias base:** Ejecutar `npm init` y configurar Electron.
2. **Probar yt-dlp por consola:** Asegurarse de que los comandos de descarga funcionan fuera del entorno de código primero.
3. **Diseñar el Wireframe:** Definir dónde irá el input de URL y cómo se mostrarán las opciones de calidad.
