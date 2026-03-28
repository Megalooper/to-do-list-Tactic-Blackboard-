const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/User'); // Ajusta según tu carpeta de modelos

// --- PROTOCOLO DE REGISTRO ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar existencia previa
        const existe = await Usuario.findOne({ username });
        if (existe) return res.status(400).json({ success: false, msg: "ID_DUPLICADO" });

        // Encriptación de alto nivel
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoAgente = new Usuario({
            username,
            password: hashedPassword,
            theme: 'default' // Tema inicial
        });

        await nuevoAgente.save();
        res.json({ success: true, msg: "AGENTE_REGISTRADO_EN_DATABASE" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "FALLO_EN_EL_NÚCLEO" });
    }
});

// --- PROTOCOLO DE LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const agente = await Usuario.findOne({ username });

        if (!agente) return res.status(401).json({ success: false, msg: "ID_NO_ENCONTRADO" });

        const esValido = await bcrypt.compare(password, agente.password);
        if (!esValido) return res.status(401).json({ success: false, msg: "CLAVE_ERRÓNEA" });

        // INYECCIÓN DE SESIÓN
        req.session.userId = agente._id;
        req.session.username = agente.username;

        res.json({ success: true, theme: agente.theme });
    } catch (err) {
        res.status(500).json({ success: false, msg: "ERROR_SISTEMA" });
    }
});

// --- PROTOCOLO DE CIERRE DE SESIÓN ---
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.redirect('/');
        res.clearCookie('connect.sid'); // Limpia la galleta de sesión
        res.redirect('/login.html');
    });
});

module.exports = router;