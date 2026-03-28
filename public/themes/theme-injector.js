/**
 * SISTEMA DE INYECCIÓN DE PROTOCOLOS VISUALES
 * Gestiona la carga dinámica de CSS y la persistencia de temas.
 */

function changeTheme(themeName) {
    // 1. Aplicamos el atributo al body para disparar animaciones específicas en CSS
    document.body.setAttribute('data-theme', themeName);

    // 2. Limpiamos el link de tema dinámico anterior si existe
    const oldTheme = document.getElementById('dynamic-theme');
    if (oldTheme) oldTheme.remove();

    // 3. Si no es el tema base, inyectamos el nuevo archivo CSS
    if (themeName !== 'default') {
        const link = document.createElement('link');
        link.id = 'dynamic-theme';
        link.rel = 'stylesheet';
        link.href = `/themes/${themeName}.css`;
        document.head.appendChild(link);
    }

    // 4. Guardamos la elección en el almacenamiento local del navegador
    localStorage.setItem('selected-theme', themeName);
    
    // 5. Sincronizamos los estilos del fondo (Matrix)
    updateInterfaceStyles(themeName);
}

function updateInterfaceStyles(theme) {
    const matrixColors = {
        'default': '#ffffff',
        'glass': '#60a5fa',
        'neon': '#39ff14',
        'retro': 'transparent' // Ocultamos la matrix en modo oficina
    };
    window.matrixColor = matrixColors[theme] || '#ffffff';
}

// Inicialización al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selected-theme') || 'default';
    
    // Sincronizamos el elemento select del sidebar
    const selector = document.getElementById('themeSelector');
    if (selector) selector.value = savedTheme;
    
    // Ejecutamos la inyección inicial
    changeTheme(savedTheme);
});

function toggleAuth() {
    const card = document.getElementById('authCard');
    
    // 1. Forzamos la animación
    card.classList.add('auth-switching');
    
    // 2. A mitad de la animación (400ms) hacemos el cambio de contenido
    setTimeout(() => {
        const login = document.getElementById('loginFields');
        const reg = document.getElementById('registerFields');
        
        if (login.style.display === 'none') {
            login.style.display = 'block';
            reg.style.display = 'none';
        } else {
            login.style.display = 'none';
            reg.style.display = 'block';
        }
    }, 400);

    // 3. Limpiamos la clase cuando termine todo el proceso (800ms)
    setTimeout(() => {
        card.classList.remove('auth-switching');
    }, 850);
}


// Ejecutar esto en cada página para guardar la preferencia
localStorage.setItem('user-view-preference', window.location.pathname);
// 1. APLICAR TEMA AL CARGAR
function injectCurrentTheme() {
    const savedTheme = localStorage.getItem('user-theme-preference') || 'neon'; // neon por defecto
    const body = document.body;
    
    // Eliminamos placeholder y temas viejos, y aplicamos el nuevo
    body.classList.remove('theme-placeholder', 'theme-neon', 'theme-glass', 'theme-classic');
    body.classList.add(`theme-${savedTheme}`);
    
    console.log(`📡 TEMA_INYECTADO: ${savedTheme.toUpperCase()}`);
}

// 2. GUARDAR TEMA (Llamar desde el selector en whitemask.js o dashboard.html)
function saveThemePreference(themeName) {
    localStorage.setItem('user-theme-preference', themeName);
    injectCurrentTheme(); // Actualizar de inmediato
}

// Inicialización
window.addEventListener('DOMContentLoaded', injectCurrentTheme);