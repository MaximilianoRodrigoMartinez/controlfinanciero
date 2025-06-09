let movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];

const formulario = document.getElementById('formulario');
const movimientosDiv = document.getElementById('movimientos');
const resumenDiv = document.getElementById('resumen');
let grafico = null;
let filtroSeleccionado = 'todos';
let textoBusqueda = '';

// Evento para búsqueda
document.getElementById('buscador').addEventListener('input', (e) => {
  textoBusqueda = e.target.value.toLowerCase();
  renderizar();
});

// Evento principal
formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const descripcion = document.getElementById('descripcion').value.trim();
  const monto = parseFloat(document.getElementById('monto').value);
  const tipo = document.getElementById('tipo').value;
  const categoria = document.getElementById('categoria').value;


  if (monto <= 0) {
    Swal.fire("⚠️ Error", "El monto debe ser positivo", "warning");
    return;
  }

  if (!descripcion || isNaN(monto)) {
    alert("Completá todos los campos correctamente");
    return;
  }

  const nuevoMovimiento = { descripcion, monto, tipo, categoria, id: Date.now() };
  movimientos.push(nuevoMovimiento);
  localStorage.setItem('movimientos', JSON.stringify(movimientos));

  formulario.reset();
  renderizar();
});

// Mostrar movimientos
function renderizar() {
  movimientosDiv.innerHTML = '';
  movimientos.sort((a, b) => b.id - a.id);

  const movimientosFiltrados = movimientos.filter(mov => {
    const cumpleFiltro = filtroSeleccionado === 'todos' || mov.tipo === filtroSeleccionado;
  
    const textoCompleto = `
      ${mov.descripcion} 
      ${mov.monto} 
      ${mov.categoria} 
      ${new Date(mov.id).toLocaleString()}
    `.toLowerCase();
  
    const cumpleBusqueda = textoCompleto.includes(textoBusqueda);
  
    return cumpleFiltro && cumpleBusqueda;
  });
  

  movimientosFiltrados.forEach((mov) => {
    const item = document.createElement('div');
    item.className = `movimiento ${mov.tipo}`;
    item.innerHTML = `
      <div>
        <strong>${mov.descripcion}</strong> - $${mov.monto}
        <br>
        <small>${mov.categoria} • ${new Date(mov.id).toLocaleString()}</small>
      </div>
      <button onclick="eliminarMovimiento(${mov.id})">🗑️</button>
      <button onclick="editarMovimiento(${mov.id})">✏️</button>
    `;
    movimientosDiv.appendChild(item);
  });

  actualizarResumen();
}


// Eliminar movimiento
function eliminarMovimiento(id) {
  movimientos = movimientos.filter(mov => mov.id !== id);
  localStorage.setItem('movimientos', JSON.stringify(movimientos));
  renderizar();
}

// Calcular totales y balance
function actualizarResumen() {
  const ingresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, mov) => acc + mov.monto, 0);

  const egresos = movimientos
    .filter(m => m.tipo === 'egreso')
    .reduce((acc, mov) => acc + mov.monto, 0);

  const balance = ingresos - egresos;

  resumenDiv.innerHTML = `
    <h3>Resumen</h3>
    <p>Ingresos: $${ingresos}</p>
    <p>Egresos: $${egresos}</p>
    <p><strong>Balance: $${balance}</strong></p>
  `;
  actualizarGrafico(ingresos, egresos);
}

document.addEventListener('DOMContentLoaded', renderizar);

// Función para editar un movimiento

function editarMovimiento(id) {
  const mov = movimientos.find(m => m.id === id);
  Swal.fire({
    title: 'Editar Movimiento',
    html:
      `<input id="desc" class="swal2-input" value="${mov.descripcion}">` +
      `<input id="mont" type="number" class="swal2-input" value="${mov.monto}">`,
    confirmButtonText: 'Guardar',
    focusConfirm: false,
    preConfirm: () => {
      const nuevaDesc = document.getElementById('desc').value.trim();
      const nuevoMonto = parseFloat(document.getElementById('mont').value);
      if (!nuevaDesc || isNaN(nuevoMonto)) {
        Swal.showValidationMessage('Completá ambos campos correctamente');
        return false;
      }
      mov.descripcion = nuevaDesc;
      mov.monto = nuevoMonto;
      localStorage.setItem('movimientos', JSON.stringify(movimientos));
      renderizar();
    }
  });
}

// Boton borrar todo

const btnBorrarTodo = document.getElementById('borrarTodo');

// Evento para borrar todo
btnBorrarTodo.addEventListener('click', () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esto eliminará todos los movimientos',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e63946',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, borrar todo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      movimientos = [];
      localStorage.removeItem('movimientos');
      renderizar();
      Swal.fire('¡Hecho!', 'Se eliminaron todos los movimientos.', 'success');
    }
  });
});

// Ordenar movimientos por ultimo ID

movimientos.sort((a, b) => b.id - a.id); 

// Actualizar gráfico

function actualizarGrafico(ingresos, egresos) {
  const ctx = document.getElementById('grafico').getContext('2d');

  if (grafico) {
    grafico.destroy(); 
  }

  grafico = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ingresos', 'Egresos'],
      datasets: [{
        data: [ingresos, egresos],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Filtro de movimientos

document.getElementById('filtro').addEventListener('change', function () {
  filtroSeleccionado = this.value;
  renderizar();
});

// Guardar "Mis Finanzas"

// Exportar movimientos como archivo JSON
document.getElementById('exportarJSON').addEventListener('click', () => {
  if (movimientos.length === 0) {
    Swal.fire("⚠️ Atención", "No hay movimientos para exportar.", "warning");
    return;
  }

  const dataStr = JSON.stringify(movimientos, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'movimientos.json';
  enlace.click();

  URL.revokeObjectURL(url);
});


// Importar movimientos desde un archivo JSON
document.getElementById('ImportarJSON').addEventListener('click', () => {
  document.getElementById('fileInput').click(); // Simula click en el input file
});

document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedMovimientos = JSON.parse(e.target.result);

      if (Array.isArray(importedMovimientos)) {
        const idsExistentes = new Set(movimientos.map(m => m.id));
        const nuevos = importedMovimientos.filter(m => !idsExistentes.has(m.id));

        movimientos = movimientos.concat(nuevos);
        localStorage.setItem('movimientos', JSON.stringify(movimientos));
        renderizar();

        Swal.fire("✅ Importación exitosa", `${nuevos.length} movimientos agregados.`, "success");
      } else {
        Swal.fire("❌ Error", "El archivo no contiene un formato válido.", "error");
      }
    } catch (error) {
      Swal.fire("❌ Error al importar", error.message, "error");
    }
  };
  reader.readAsText(file);
  
  // Resetear el input para permitir reimportar el mismo archivo
  event.target.value = '';
});


// Conversor
document.getElementById('btn-convertir').addEventListener('click', async () => {
  const monto = parseFloat(document.getElementById('monto-convertir').value);
  const de = document.getElementById('moneda-origen').value;
  const a = document.getElementById('moneda-destino').value;
  
  if (isNaN(monto)) {
    Swal.fire("Error", "Ingrese un monto válido", "error");
    return;
  }

  try {
    const respuesta = await fetch(`/.netlify/functions/convertir?monto=${monto}&de=${de}&a=${a}`);
    const data = await respuesta.json();
    
    if (data.result === 'success') {
      const resultado = data.conversion_result.toFixed(2);
      document.getElementById('resultado-conversion').innerHTML = `
        <p>${monto} ${de} = <strong>${resultado} ${a}</strong></p>
        <small>Tasa: 1 ${de} = ${data.conversion_rate} ${a}</small>
      `;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    Swal.fire("Error API", "No se pudo obtener la tasa de cambio", "error");
    console.error("Error detallado:", error); 
  }
});