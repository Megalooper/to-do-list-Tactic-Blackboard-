const express = require('express');
const router = express.Router();
const iaController = require('../controllers/iaController');

// POST /ia/estrategia
router.post('/estrategia', iaController.generarEstrategia);

module.exports = router;
