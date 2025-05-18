let movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];

const formulario = document.getElementById('formulario');
const movimientosDiv = document.getElementById('movimientos');
const resumenDiv = document.getElementById('resumen');

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

  movimientos.forEach((mov) => {
    const item = document.createElement('div');
    item.className = `movimiento ${mov.tipo}`;
    item.innerHTML = `
      <span>${mov.descripcion} - $${mov.monto}</span>
      <button onclick="eliminarMovimiento(${mov.id})">🗑️</button>
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
}

document.addEventListener('DOMContentLoaded', renderizar);

// Boton borrar todo

const btnBorrarTodo = document.getElementById('borrarTodo');

// Evento para borrar todo
btnBorrarTodo.addEventListener('click', () => {
  const confirmacion = confirm("¿Estás seguro que querés borrar todos los movimientos?");
  if (confirmacion) {
    movimientos = [];
    localStorage.removeItem('movimientos');
    renderizar();
  }
});