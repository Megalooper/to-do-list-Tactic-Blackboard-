const Tarea = require('../models/Tarea');

// 1. OBTENER TAREAS (Sincronización de Usuario)
exports.obtenerTareas = async (req, res) => {
    try {
        // Solo traemos lo que pertenece al agente en sesión
        const tareas = await Tarea.find({ userId: req.session.userId }).sort({ fechaLimite: 1 });
        res.json(tareas);
    } catch (error) {
        console.error("❌ ERROR_FETCH:", error.message);
        res.status(500).json({ msg: "Error en el núcleo de datos" });
    }
};

// 2. CREAR TAREA (Con Lógica de Prioridad IA)
exports.crearTarea = async (req, res) => {
    try {
        const { nombre, fechaLimite } = req.body;
        // --- MOTOR DE IA PREDICTIVO (Lógica de Servidor) ---
        const esCritico = /seguridad|mantenimiento|urgente|fallo/i.test(nombre);

        // LOG: Mostrar valor recibido y cómo lo interpreta JS
        console.log('[DEBUG] fechaLimite recibido:', fechaLimite);
        const fechaInterpretada = fechaLimite ? new Date(fechaLimite) : null;
        console.log('[DEBUG] fechaLimite interpretada:', fechaInterpretada, 'isValid:', fechaInterpretada instanceof Date && !isNaN(fechaInterpretada));

        if (fechaLimite && (fechaInterpretada === null || isNaN(fechaInterpretada))) {
            return res.status(400).json({ msg: 'Fecha límite inválida', fechaLimiteRecibida: fechaLimite });
        }

        const nuevaTarea = new Tarea({
            ...req.body,
            userId: req.session.userId,
            fechaLimite: (!fechaInterpretada && esCritico)
                ? new Date(Date.now() + 86400000)
                : fechaInterpretada
        });

        const guardada = await nuevaTarea.save();
        // LOG: Mostrar cómo se guardó la fecha
        console.log('[DEBUG] fechaLimite guardada:', guardada.fechaLimite);
        res.status(201).json(guardada);
    } catch (error) {
        console.error("❌ ERROR_CREATE:", error.message);
        res.status(400).json({ msg: "Fallo en despliegue de nodo", error: error.message });
    }
};

// 3. ACTUALIZAR (Silenciando Advertencias de Consola)
exports.actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Usamos returnDocument: 'after' para eliminar los avisos de [MONGOOSE]
        const actualizada = await Tarea.findOneAndUpdate(
            { _id: id, userId: req.session.userId }, 
            { $set: req.body }, 
            { returnDocument: 'after' } 
        );

        if (!actualizada) return res.status(404).json({ msg: "NODO_INEXISTENTE" });
        
        res.status(200).json(actualizada);
    } catch (error) {
        console.error("❌ ERROR_PATCH:", error.message);
        res.status(400).json({ msg: "Error de sincronización con Atlas" });
    }
};

// 4. ELIMINAR (Protección de Integridad)
exports.eliminarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Tarea.findOneAndDelete({ 
            _id: id, 
            userId: req.session.userId 
        });

        if (!resultado) return res.status(404).json({ msg: "ELIMINACIÓN_FALLIDA: NO_ENCONTRADO" });
        
        res.status(200).json({ msg: "NODO_BORRADO_EXITOSAMENTE" });
    } catch (error) {
        res.status(400).json({ msg: "Error en protocolo de borrado" });
    }
};