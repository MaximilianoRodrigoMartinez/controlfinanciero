let ingresoMensual = 0;
let gastos = [];

function ingresarIngreso() {
    ingresoMensual = parseFloat(prompt("Ingrese su ingreso mensual:"));
}

function ingresarGasto() {
    let nombreGasto = prompt("Ingrese el nombre del gasto:");
    let montoGasto = parseFloat(prompt("Ingrese el monto del gasto:"));
    let gasto = {
        nombre: nombreGasto,
        monto: montoGasto
    };
    gastos.push(gasto);
    alert("Gasto agregado: " + nombreGasto + " - $" + montoGasto);
}

function verResumen() {
    let resumen = "Ingreso mensual: $" + ingresoMensual + "\nGastos: \n";
    gastos.forEach((gasto, index) => {
        resumen += (index + 1) + ". " + gasto.nombre + " - $" + gasto.monto + "\n";
    });
    alert(resumen);
}

while (true) {
    let opcion = prompt("Elija una opción:\n1. Ingresar ingreso mensual\n2. Ingresar gastos\n3. Ver resumen\n4. Salir");

    switch (opcion) {
        case "1":
            ingresarIngreso();
            break;
        case "2":
            ingresarGasto();
            break;
        case "3":
            verResumen();
            break;
        case "4":
            alert("Saliendo...");
            break;
        default:
            alert("Opción no válida, intente nuevamente.");
            continue;
    }

    if (opcion === "4") {
        break;
    }
}
