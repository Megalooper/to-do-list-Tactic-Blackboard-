# 🛡️ WHITEMASK // OPERATIVE SYSTEM v4.0

Sistema de gestión táctica de tareas diseñado para entornos de alto rendimiento. Whitemask separa la planificación estratégica del despliegue visual mediante una arquitectura de doble vista: **Pizarra Táctica** y **Mando Central**.

## 🚀 Características Principales
* **Mando Central (Dashboard):** Panel analítico con gráficas de rendimiento (Chart.js), calendario de hitos y monitoreo de plazos críticos.
* **Pizarra Táctica (Canvas):** Entorno visual interactivo con tecnología Drag & Drop para la organización espacial de nodos.
* **Inteligencia Operativa:** Sugerencia dinámica de fases internas basada en el análisis del nombre de la misión.
* **Sincronización Cloud:** Persistencia total de datos mediante MongoDB Atlas.

## 🛠️ Stack Tecnológico
* **Backend:** Node.js & Express.
* **Base de Datos:** MongoDB Atlas (Mongoose ODM).
* **Frontend:** JavaScript Vanilla, CSS Grid (Cyber-Tech UI), Chart.js.
* **Seguridad:** Autenticación por sesiones y cifrado de claves con BcryptJS.

## 🔧 Instalación y Despliegue
1. Clonar el repositorio.
2. Instalar dependencias: `npm install`.
3. Configurar variables de entorno en un archivo `.env`:
   ```env
   PORT=3000
   MONGO_URI=tu_cadena_de_conexion_atlas
