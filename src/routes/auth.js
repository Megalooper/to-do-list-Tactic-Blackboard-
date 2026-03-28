const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Verificar si el agente ya existe
        let user = await Usuario.findOne({ username });
        if (user) return res.status(400).json({ msg: "ID_DUPLICADO: EL_AGENTE_YA_EXISTE" });

        // Encriptar clave (10 rondas de sal)
        const salt = await bcrypt.genSalt(10);
        const hashedEmoji = await bcrypt.hash(password, salt);

        user = new Usuario({ username, password: hashedEmoji });
        await user.save();

        res.json({ msg: "REGISTRO_EXITOSO: AGENTE_CREADO" });
    } catch (err) {
        res.status(500).send("ERROR_DEL_SISTEMA");
    }
});

module.exports = router;