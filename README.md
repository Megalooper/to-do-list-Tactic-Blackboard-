# 🛡️ WHITEMASK // OPERATIVE SYSTEM v4.0

Sistema de gestión táctica de tareas diseñado para entornos de alto rendimiento. Whitemask separa la planificación estratégica del despliegue visual mediante una arquitectura de doble vista: **Pizarra Táctica** y **Mando Central**.

## 🚀 Características Principales
* **Mando Central (Dashboard):** Panel analítico con gráficas de rendimiento (Chart.js), calendario de hitos y monitoreo de plazos críticos [cite: 2026-03-28].
* **Pizarra Táctica (Canvas):** Entorno visual interactivo con tecnología Drag & Drop para la organización espacial de nodos [cite: 2026-03-25, 2026-03-28].
* **Inteligencia Operativa:** Sugerencia dinámica de fases internas basada en el análisis del nombre de la misión [cite: 2026-03-28].
* **Sincronización Cloud:** Persistencia total de datos mediante MongoDB Atlas [cite: 2026-03-25].

## 🛠️ Stack Tecnológico
* **Backend:** Node.js & Express [cite: 2026-03-25].
* **Base de Datos:** MongoDB Atlas (Mongoose ODM) [cite: 2026-03-25, 2026-03-28].
* **Frontend:** JavaScript Vanilla, CSS Grid (Cyber-Tech UI), Chart.js [cite: 2026-01-31, 2026-03-28].
* **Seguridad:** Autenticación por sesiones y cifrado de claves con BcryptJS [cite: 2026-03-25].

## 🔧 Instalación y Despliegue
1. Clonar el repositorio.
2. Instalar dependencias: `npm install` [cite: 2026-03-25].
3. Configurar variables de entorno en un archivo `.env`:
   ```env
   PORT=3000
   MONGO_URI=tu_cadena_de_conexion_atlas