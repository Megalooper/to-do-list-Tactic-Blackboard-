// Nuevo controlador para sugerencias inteligentes
exports.generarEstrategia = async (req, res) => {
    const { mision } = req.body;
    
    // 🧠 ESTRATEGIAS EXPANDIDAS - 10 CATEGORÍAS CON 10+ FASES CADA UNA
    const estrategias = {
        "mantenimiento": [
            "Respaldo de BD Atlas",
            "Limpieza física Optiplex",
            "Revisión de logs térmicos",
            "Actualización de dependencias NPM",
            "Validación de seguridad SSL",
            "Optimización de índices MongoDB",
            "Limpieza de caché Redis",
            "Verificación de discos SSD",
            "Actualización de firmware BIOS",
            "Calibración de ventiladores",
            "Revisión de fuentes de poder",
            "Limpieza de registros de eventos"
        ],
        "desarrollo": [
            "Definición de arquitectura MVC",
            "Modelado de esquemas Mongoose",
            "Implementación de rutas REST",
            "Pruebas de integración",
            "Despliegue en entorno de pruebas",
            "Configuración de Webpack",
            "Implementación de TypeScript",
            "Setup de ESLint + Prettier",
            "Configuración de Docker",
            "Implementación de CI/CD",
            "Documentación de API",
            "Optimización de queries"
        ],
        "seguridad": [
            "Escaneo de puertos abiertos",
            "Auditoría de sesiones express",
            "Rotación de claves .env",
            "Implementación de Helmet.js",
            "Reporte de vulnerabilidades crítico",
            "Configuración de CORS",
            "Implementación de rate limiting",
            "Hash de contraseñas bcrypt",
            "Validación de inputs sanitizados",
            "Configuración de HTTPS",
            "Auditoría de permisos de usuario",
            "Implementación de 2FA"
        ],
        "infraestructura": [
            "Configuración de servidores Nginx",
            "Setup de balanceadores de carga",
            "Configuración de CDN",
            "Optimización de bases de datos",
            "Implementación de monitoreo",
            "Configuración de backups automáticos",
            "Setup de alertas de sistema",
            "Optimización de recursos cloud",
            "Configuración de auto-scaling",
            "Implementación de logging centralizado"
        ],
        "calidad": [
            "Pruebas unitarias Jest",
            "Pruebas E2E Cypress",
            "Revisión de código manual",
            "Análisis estático SonarQube",
            "Pruebas de carga",
            "Pruebas de seguridad OWASP",
            "Validación de accesibilidad",
            "Pruebas de compatibilidad",
            "Documentación de casos de prueba",
            "Automatización de QA"
        ],
        "documentacion": [
            "Creación de README técnico",
            "Documentación de API Swagger",
            "Diagramas de arquitectura",
            "Guías de instalación",
            "Manual de usuario",
            "Políticas de contribución",
            "Changelog de versiones",
            "Wiki del proyecto",
            "Tutoriales de uso",
            "FAQ técnico"
        ],
        "optimizacion": [
            "Análisis de rendimiento Lighthouse",
            "Optimización de imágenes",
            "Minificación de assets",
            "Implementación de lazy loading",
            "Optimización de bundle size",
            "Configuración de caching",
            "Optimización de queries DB",
            "Implementación de CDN",
            "Compresión Gzip/Brotli",
            "Optimización de renderizado"
        ],
        "migracion": [
            "Análisis de datos existentes",
            "Backup completo pre-migración",
            "Configuración de nuevo entorno",
            "Migración de esquemas",
            "Transferencia de datos",
            "Validación de integridad",
            "Pruebas de funcionalidad",
            "Cutover planificado",
            "Rollback planificado",
            "Monitoreo post-migración"
        ],
        "monitoreo": [
            "Configuración de Prometheus",
            "Setup de Grafana dashboards",
            "Alertas de uptime",
            "Monitoreo de recursos",
            "Logs centralizados ELK",
            "Tracing distribuido",
            "Métricas de negocio",
            "Alertas de errores",
            "Reportes automáticos",
            "Integración con Slack/Teams"
        ],
        "despliegue": [
            "Configuración de entorno staging",
            "Pipeline de CI/CD",
            "Configuración de Docker",
            "Orquestación Kubernetes",
            "Deploy automatizado",
            "Rollback automático",
            "Canary deployments",
            "Blue-green deployment",
            "Validación post-deploy",
            "Monitoreo post-despliegue"
        ]
    };

    // Buscador de contexto inteligente (mejorado)
    const misionLower = mision.toLowerCase();
    const clave = Object.keys(estrategias).find(k => misionLower.includes(k));
    
    const fases = estrategias[clave] || [
        "Definir objetivos",
        "Asignar recursos",
        "Ejecución técnica",
        "Control de calidad",
        "Cierre de operación",
        "Documentación",
        "Revisión final",
        "Entrega al cliente"
    ];

    // Recomendación de fecha más inteligente
    let recomendacionFecha = 7;
    if (clave === "seguridad") recomendacionFecha = 1;
    else if (clave === "mantenimiento") recomendacionFecha = 3;
    else if (clave === "despliegue") recomendacionFecha = 5;
    else if (clave === "migracion") recomendacionFecha = 14;
    else if (clave === "desarrollo") recomendacionFecha = 10;

    res.json({ 
        fases, 
        recomendacionFecha,
        categoria: clave || "general",
        totalFases: fases.length
    });
};