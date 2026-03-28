
// WHITEMASK DASHBOARD ENGINE v4.0 - Lógica robusta y a prueba de fallos
let chartTareasInstance = null;
let chartEvolInstance = null;

async function syncDashboardMetrics() {
  let tareas = [];
  try {
    const res = await fetch('/tareas');
    tareas = await res.json();
  } catch (e) {
    document.body.innerHTML = '<div style="color:red;text-align:center;margin-top:60px;font-size:2rem;">Error al cargar datos del servidor.</div>';
    return;
  }

  // 1. Actualizar contadores
  const completas = tareas.filter(t => t.completada).length;
  const pendientes = tareas.length - completas;
  const criticas = tareas.filter(t => t.fechaLimite && !t.completada && (new Date(t.fechaLimite) - new Date() < 86400000));

  setText('totalTareas', tareas.length);
  setText('tareasCompletadas', completas);
  setText('tareasPendientes', pendientes);
  setText('tareasCriticas', criticas.length);

  // 2. Renderizar alertas críticas
  const listaAlertas = document.getElementById('listaAlertas');
  if (listaAlertas) {
    listaAlertas.innerHTML = criticas.length === 0
      ? '<li>No hay tareas críticas.</li>'
      : criticas.map(t => `<li><b>${t.nombre.toUpperCase()}</b> vence el ${t.fechaLimite ? new Date(t.fechaLimite).toLocaleDateString('es-ES') : 'NO DEFINIDO'}</li>`).join('');
  }

  // 3. Renderizar calendario simple (día actual)
  const calendarBox = document.getElementById('calendarBox');
  if (calendarBox) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    calendarBox.innerHTML = `<span>${now.toLocaleDateString('es-ES', options)}</span>`;
  }

  // 4. Gráfica de estado de tareas (doughnut)
  const ctxTareas = document.getElementById('chartTareas')?.getContext('2d');
  if (ctxTareas) {
    if (chartTareasInstance) chartTareasInstance.destroy();
    if (tareas.length > 0) {
      chartTareasInstance = new Chart(ctxTareas, {
        type: 'doughnut',
        data: {
          labels: ['Empezadas', 'Pendientes', 'Críticas'],
          datasets: [{
            data: [completas, pendientes, criticas.length],
            backgroundColor: ['#00f2ff', '#ff9800', '#ff0055'],
            borderColor: '#181820',
            borderWidth: 4
          }]
        },
        options: {
          plugins: { legend: { position: 'bottom', labels: { color: '#fff', font: { family: 'Fira Code' } } } },
          cutout: '60%',
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      ctxTareas.clearRect(0, 0, 300, 150);
      ctxTareas.font = '18px Fira Code, monospace';
      ctxTareas.fillStyle = '#888';
      ctxTareas.textAlign = 'center';
      ctxTareas.fillText('Sin datos para graficar', 150, 70);
    }
  }

  // 5. Gráfica de evolución (tareas creadas por día)
  const fechas = {};
  tareas.forEach(t => {
    if (t.fechaLimite) {
      const d = new Date(t.fechaLimite).toLocaleDateString('es-ES');
      fechas[d] = (fechas[d] || 0) + 1;
    }
  });
  const labels = Object.keys(fechas).sort((a,b) => new Date(a)-new Date(b));
  const data = labels.map(l => fechas[l]);
  const ctxEvol = document.getElementById('chartEvolucion')?.getContext('2d');
  if (ctxEvol) {
    if (chartEvolInstance) chartEvolInstance.destroy();
    if (labels.length > 0) {
      chartEvolInstance = new Chart(ctxEvol, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Tareas por día (fecha límite)',
            data,
            backgroundColor: '#00f2ff',
            borderRadius: 8
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { x: { grid: { display: false }, ticks: { color: '#fff', font: { family: 'Fira Code' } } }, y: { beginAtZero: true, ticks: { color: '#fff', font: { family: 'Fira Code' } } } },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      ctxEvol.clearRect(0, 0, 300, 150);
      ctxEvol.font = '18px Fira Code, monospace';
      ctxEvol.fillStyle = '#888';
      ctxEvol.textAlign = 'center';
      ctxEvol.fillText('Sin datos para graficar', 150, 70);
    }
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', syncDashboardMetrics);

