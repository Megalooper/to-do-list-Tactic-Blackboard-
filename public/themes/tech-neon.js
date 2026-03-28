// Animación: Cae desde arriba con un resplandor verde
const addTaskUI = (id, name) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.style.boxShadow = "0 0 10px #00ff41";
    li.innerHTML = `<span>ID: ${id} | ${name}</span><button onclick="this.parentElement.remove()">DEL</button>`;
    document.getElementById('taskList').prepend(li); // Las nuevas arriba
};