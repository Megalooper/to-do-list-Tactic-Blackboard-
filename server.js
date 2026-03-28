const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Conexión a MongoDB (Asegúrate de tenerlo corriendo en la Optiplex)
mongoose.connect('mongodb://127.0.0.1:27017/whitemask_db')
    .then(() => console.log("SISTEMA: DATABASE_CONNECTED"))
    .catch(err => console.error("SISTEMA: ERROR_DB", err));

// Esquema de la Tarea (Nodo)
const TaskSchema = new mongoose.Schema({
    id_ref: String,
    name: String,
    x: String, // Posición Horizontal
    y: String, // Posición Vertical
    subtasks: Array,
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', TaskSchema);

// RUTAS API
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
    await Task.findOneAndUpdate({ id_ref: req.params.id }, req.body);
    res.send("Actualizado");
});

app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findOneAndDelete({ id_ref: req.params.id });
    res.send("Eliminado");
});

app.listen(3000, () => console.log("SERVER_RUNNING: http://localhost:3000"));