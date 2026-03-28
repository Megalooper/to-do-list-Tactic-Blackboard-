// Selección de elementos del DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Función para crear el HTML de una tarea con estilo Whitemask
const createQueryRow = (id, nombre, estado) => {
    return `
        <li class="task-item" id="task-${id}">
            <div class="task-info">
                <span class="task-id">[OP_${id}]</span>
                <span class="task-name">${nombre.toUpperCase()}</span>
            </div>
            <div class="task-actions">
                <span class="task-status">${estado}</span>
                <button onclick="deleteTask('${id}')" class="delete-btn">✖</button>
            </div>
        </li>
    `;
};

// Agregar tarea (Simulación)
addBtn.addEventListener('click', () => {
    const nombre = taskInput.value;
    if (nombre === '') return alert("ERROR: Ingrese nombre de operación");

    // Generar ID aleatorio tipo 00X
    const randomId = Math.floor(Math.random() * 900) + 100;
    
    // Insertar en la lista
    taskList.innerHTML += createQueryRow(randomId, nombre, "ACTIVE");

    // Limpiar input y dar foco
    taskInput.value = '';
    taskInput.focus();
    
    console.log(`LOG: Operación ${randomId} desplegada.`);
});

// Borrar tarea (Simulación)
window.deleteTask = (id) => {
    const element = document.getElementById(`task-${id}`);
    element.style.opacity = '0'; // Efecto de desvanecido
    setTimeout(() => {
        element.remove();
        console.log(`LOG: Operación ${id} terminada.`);
    }, 300);
};

// Permitir agregar con la tecla Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});