// --- BLOQUE DE FECHA/HORA EN SIDEBAR ---
function updateSidebarDate() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('es-ES', dateOptions);
    const timeStr = now.toLocaleTimeString('es-ES');
    const dateEl = document.getElementById('sidebar-date');
    const timeEl = document.getElementById('sidebar-time');
    if (dateEl) dateEl.textContent = dateStr;
    if (timeEl) timeEl.textContent = timeStr;
}
setInterval(updateSidebarDate, 1000);
window.addEventListener('DOMContentLoaded', updateSidebarDate);
/**
 * WHITEMASK OPERATIVE SYSTEM - CORE JS
 * Gestión de Pizarra Táctica, Matrix y Sincronización con SFX
 */

// --- 1. SISTEMA DE AUDIO TÁCTICO ---
const sfx = {
    deploy: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    check: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
    success: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3')
};

const playSFX = (type) => {
    if (sfx[type]) {
        sfx[type].currentTime = 0;
        sfx[type].volume = 0.4;
        sfx[type].play().catch(e => console.log("Audio_Blocked")); 
    }
};

// --- 2. CONFIGURACIÓN DEL FONDO (MATRIX) ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.onresize = resize;
resize();

const characters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*";
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

window.matrixColor = "#ffffff"; 
window.matrixSpeed = 50;

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (window.matrixColor === 'transparent') return;

    ctx.fillStyle = window.matrixColor;
    ctx.font = fontSize + "px monospace";
    
    drops.forEach((y, i) => {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, window.matrixSpeed);

// --- 3. GESTIÓN DE DATOS Y RENDERIZADO ---
let tareasActuales = [];

async function loadTasks() {
    try {
        const res = await fetch('/tareas');
        tareasActuales = await res.json();
        const board = document.getElementById('taskList');
        board.innerHTML = '';
        tareasActuales.forEach(t => renderNode(t));
    } catch (err) {
        console.error("❌ ERROR_LOAD:", err);
    }
}

function renderNode(t) {
    const node = document.createElement('div');
    node.className = 'node-task node-loading';
    node.id = `node-${t._id}`;
    node.draggable = true;
    node.style.left = t.x || "350px";
    node.style.top = t.y || "100px";

    node.onclick = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        document.querySelectorAll('.node-task').forEach(n => { if(n !== node) n.classList.remove('expanded'); });
        node.classList.toggle('expanded');
    };

    node.ondragstart = (e) => {
        e.dataTransfer.setData("text", node.id);
        node.style.opacity = "0.5";
    };
    node.ondragend = () => node.style.opacity = "1";

    const subsHTML = (t.subtareas || []).map((s, i) => `
        <div style="margin-bottom:8px; display:flex; gap:10px; align-items:center;">
            <input type="checkbox" ${s.completada ? 'checked' : ''} 
                onchange="updateSubtaskStatus('${t._id}', ${i})"> 
            <span class="subtask-text" style="${s.completada ? 'text-decoration:line-through; opacity:0.5;' : ''}">
                ${s.texto.toUpperCase()}
            </span>
        </div>
    `).join('');

    // Fecha editable
    const fecha = t.fechaLimite ? new Date(t.fechaLimite) : null;
    const fechaStr = fecha ? fecha.toLocaleDateString('es-ES') : 'Sin fecha';
    const fechaVal = fecha ? fecha.toISOString().slice(0,10) : '';

    node.innerHTML = `
        <div class="node-title-mini">${(t.nombre || "SIN_NOMBRE").toUpperCase()}</div>
        <div class="node-date-box" style="margin-bottom:8px;">
            <span class="node-date-label" style="font-size:0.85rem; color:#00f2ff; font-weight:bold;">Límite:</span>
            <span class="node-date-value" style="margin-left:6px; cursor:pointer;">${fechaStr}</span>
            <input type="date" value="${fechaVal}" style="display:none; margin-left:8px; background:#111; color:#fff; border:1px solid #333; padding:2px 6px; border-radius:4px; font-family:inherit; font-size:0.95rem;" onchange="updateNodeDate('${t._id}', this.value)">
        </div>
        <div class="status-tag ${t.completada ? 'status-progress' : 'status-standby'}">
            STATUS: ${t.completada ? 'IN_PROGRESS' : 'STANDBY'}
        </div>
        <div class="node-expanded-content">
            <div style="font-size:0.7rem; opacity:0.6; margin-bottom:10px;">ID: #${t._id.slice(-6)}</div>
            <div class="sub-tasks-list">${subsHTML || '[ SIN_FASES ]'}</div>
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button class="btn-node black" onclick="completeMission('${t._id}')">ÉXITO</button>
                <button class="btn-node" onclick="abortMission('${t._id}')">ABORTAR</button>
            </div>
        </div>
    `;
    
    document.getElementById('taskList').appendChild(node);
    setTimeout(() => node.classList.remove('node-loading'), 100);
}

// --- 4. LÓGICA DE LA PIZARRA (DROP) ---
const board = document.getElementById('taskList');
board.ondragover = (e) => e.preventDefault();
board.ondrop = async (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const el = document.getElementById(id);
    if (el) {
        const newX = (e.clientX - 125) + "px";
        const newY = (e.clientY - 35) + "px";
        el.style.left = newX; el.style.top = newY;
        const mongoId = id.replace('node-', '');
        await fetch(`/tareas/${mongoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: newX, y: newY })
        });
    }
};

// --- 5. ACCIONES DE SIDEBAR Y CREACIÓN ---
let currentSubtasks = [];
window.addInternalTask = () => {
    const input = document.getElementById('subtaskInput');
    if (input.value) {
        currentSubtasks.push({ texto: input.value, completada: false });
        document.getElementById('subtaskDisplay').innerHTML += `<li>> ${input.value.toUpperCase()}</li>`;
        input.value = '';
    }
};

document.getElementById('addBtn').onclick = async () => {
    const nombreInput = document.getElementById('taskInput');
    const fechaInput = document.getElementById('deadlineInput');
    if (!nombreInput.value) return alert("SISTEMA: ERROR_IDENTIFICADOR");

    const taskData = {
        nombre: nombreInput.value,
        x: "350px", 
        y: "100px",
        subtareas: currentSubtasks,
        fechaLimite: fechaInput && fechaInput.value ? fechaInput.value : undefined
    };

    const response = await fetch('/tareas', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(taskData)
    });

    if (response.ok) {
        const guardada = await response.json();
        playSFX('deploy'); // <--- AHORA SÍ: Suena cuando Atlas responde
        renderNode(guardada);
        nombreInput.value = '';
        if (fechaInput) fechaInput.value = '';
        document.getElementById('subtaskDisplay').innerHTML = '';
        currentSubtasks = [];
    }
};

// --- 6. ACTUALIZACIÓN DE ESTADOS ---
window.updateSubtaskStatus = async (tareaId, index) => {
    const node = document.getElementById(`node-${tareaId}`);
    const checkboxes = node.querySelectorAll('input[type="checkbox"]');
    const spans = node.querySelectorAll('.subtask-text');
    const statusTag = node.querySelector('.status-tag');

    const nuevasSubtareas = Array.from(checkboxes).map((cb, i) => ({
        texto: spans[i].innerText,
        completada: cb.checked
    }));

    const algunaCompletada = nuevasSubtareas.some(s => s.completada);
    statusTag.innerText = algunaCompletada ? "STATUS: IN_PROGRESS" : "STATUS: STANDBY";
    statusTag.className = algunaCompletada ? "status-tag status-progress" : "status-tag status-standby";

    spans[index].style.textDecoration = checkboxes[index].checked ? 'line-through' : 'none';
    spans[index].style.opacity = checkboxes[index].checked ? '0.5' : '1';
    
    playSFX('check'); // <--- SFX de sincronización

    await fetch(`/tareas/${tareaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtareas: nuevasSubtareas, completada: algunaCompletada })
    });
};

window.abortMission = async (id) => {
    if(!confirm("_¿CONFIRMA_ANULACIÓN?")) return;
    await fetch(`/tareas/${id}`, { method: 'DELETE' });
    document.getElementById(`node-${id}`).remove();
};

window.completeMission = async (id) => {
    const el = document.getElementById(`node-${id}`);
    el.style.background = "#39ff14"; el.style.color = "#000";
    playSFX('success'); // <--- SFX de éxito
    el.innerHTML = "<h2 style='margin:auto; text-align:center;'>MISIÓN_ÉXITO</h2>";
    setTimeout(async () => {
        await fetch(`/tareas/${id}`, { method: 'DELETE' });
        el.remove();
    }, 1000);
};

window.updateNodeDate = async (tareaId, nuevaFecha) => {
    await fetch(`/tareas/${tareaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fechaLimite: nuevaFecha })
    });
    await loadTasks();
};

window.onload = loadTasks;

// --- ASISTENTE IA PARA FASES ---
document.getElementById('iaSuggestBtn').onclick = async () => {
    const mision = document.getElementById('iaMisionInput').value;
    const resultBox = document.getElementById('iaSuggestResult');
    resultBox.innerHTML = '<span style="color:#00f2ff">[ IA: Procesando... ]</span>';
    try {
        const res = await fetch('/ia/estrategia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mision })
        });
        if (!res.ok) throw new Error('Error IA');
        const data = await res.json();
        // Mostrar fases sugeridas y botón para agregarlas
        let html = `<b>Categoría:</b> <span style='color:#00f2ff'>${data.categoria || 'general'}</span><br>`;
        html += `<b>Fases sugeridas:</b><ol style='margin-left:18px;'>`;
        data.fases.forEach(f => html += `<li>${f}</li>`);
        html += '</ol>';
        html += `<button id='addIaPhasesBtn' class='btn-node' style='background:#00f2ff;color:#000;'>Agregar fases</button>`;
        resultBox.innerHTML = html;
        document.getElementById('addIaPhasesBtn').onclick = () => {
            data.fases.forEach(f => {
                currentSubtasks.push({ texto: f, completada: false });
                document.getElementById('subtaskDisplay').innerHTML += `<li>> ${f.toUpperCase()}</li>`;
            });
        };
    } catch (e) {
        resultBox.innerHTML = '<span style="color:#ff0033">[ IA: Error al obtener sugerencias ]</span>';
    }
};