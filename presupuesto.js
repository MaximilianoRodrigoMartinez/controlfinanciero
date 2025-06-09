let movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];

const formulario = document.getElementById('formulario');
const movimientosDiv = document.getElementById('movimientos');
const resumenDiv = document.getElementById('resumen');
let grafico = null;


// Evento principal
formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const descripcion = document.getElementById('descripcion').value.trim();
  const monto = parseFloat(document.getElementById('monto').value);
  const tipo = document.getElementById('tipo').value;

  if (!descripcion || isNaN(monto)) {
    alert("Completá todos los campos correctamente");
    return;
  }

  const nuevoMovimiento = { descripcion, monto, tipo, id: Date.now() };
  movimientos.push(nuevoMovimiento);
  localStorage.setItem('movimientos', JSON.stringify(movimientos));

  formulario.reset();
  renderizar();
});

// Mostrar movimientos
function renderizar() {
  movimientosDiv.innerHTML = '';
  movimientos.sort((a, b) => b.id - a.id);
  movimientos.forEach((mov) => {
    const item = document.createElement('div');
    item.className = `movimiento ${mov.tipo}`;
    item.innerHTML = `
    <div class="contenido">
      <div>
        <strong>${mov.descripcion}</strong> - $${mov.monto}
        <br>
        <small>${new Date(mov.id).toLocaleString()}</small>
      </div>
      <div class="botones">
        <button onclick="eliminarMovimiento(${mov.id})">🗑️</button>
        <button onclick="editarMovimiento(${mov.id})">✏️</button>
      </div>
    </div>
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