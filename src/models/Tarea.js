const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    subtareas: [{
        texto: String,
        completada: { type: Boolean, default: false }
    }],
    fechaLimite: { type: Date },
    alertaEnviada: { type: Boolean, default: false },
    x: { type: String, default: "350px" }, // <--- Cambiado de Number a String
    y: { type: String, default: "100px" }, // <--- Cambiado de Number a String
    completada: { type: Boolean, default: false }
});

module.exports = mongoose.model('Tarea', TareaSchema);