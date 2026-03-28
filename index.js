require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // Versión 3.2.0 compatible
const app = express();

// --- 1. Middleware Base ---
app.use(express.json());
app.use(express.static('public'));

// --- 2. Conexión a MongoDB Atlas ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("📡 SISTEMA: CONECTADO_A_CLOUD_DB"))
    .catch(err => console.error("❌ SISTEMA: ERROR_CONEXION", err));

// --- 3. Configuración de Sesiones ---
app.use(session({
    secret: 'whitemask_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ 
        mongooseConnection: mongoose.connection,
        collection: 'sessions'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día
}));

// --- 4. Middleware de Protección ---
const requiereAuth = (req, res, next) => {
    if (req.session && req.session.userId) return next();
    res.redirect('/login.html');
};

// --- 5. Rutas ---
const tareasRoutes = require('./src/routes/tareasRoutes');
const authRoutes = require('./src/routes/authRoutes');
const iaRoutes = require('./src/routes/iaRoutes');

app.use('/auth', authRoutes);
app.use('/tareas', requiereAuth, tareasRoutes);
app.use('/ia', requiereAuth, iaRoutes);

app.get('/dashboard', requiereAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard-metrics.html'));
});

app.get('/', requiereAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- 6. Arranque ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});