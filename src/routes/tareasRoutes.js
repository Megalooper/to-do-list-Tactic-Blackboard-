const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');

router.get('/', tareasController.obtenerTareas);
router.post('/', tareasController.crearTarea);
router.put('/:id', tareasController.actualizarTarea); // Cambiado a actualizarTarea genericamente
router.patch('/:id', tareasController.actualizarTarea); // Para cambios parciales (checkboxes)
router.delete('/:id', tareasController.eliminarTarea);

module.exports = router;