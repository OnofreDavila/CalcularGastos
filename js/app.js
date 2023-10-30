//Variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto );

    formulario.addEventListener('submit', agregarGasto);
}

//Clases
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        //iterando sobre el array de gastos y sumando gasto.cantidad
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);

        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos =this.gastos.filter ( gasto => gasto.id !== id );
        this.calcularRestante();
    }

}

class UI {
    insertarPresupuesto( cantidad ){
        //cantidad = al objeto presupuesto que le pasare en la funcion preguntar Presupuesto comno atributo a la funcion del llamado de intertarPresupuesto
        
        //extraer los keys del objeto presupuesto mediante un destruction 
        const { presupuesto, restante } = cantidad;

        //seleciono los html y directamente les doy el valor a mostrar en la interfase 
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta( mensaje, tipo ){
    //crear un DIV para el mensaje de alerta
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo==='error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el html
        document.querySelector('.primario').insertBefore (divMensaje, formulario);

        //quitar del HTML
        setTimeout(()=> {
            divMensaje.remove();
        }, 3000 );


    }

    MostrarGastos (gastos) {

        this.limpiarHTML(); //elimina el html previo

        //Iterar sobre los gastos
        gastos.forEach ( gasto => {

            const { cantidad, nombre, id } = gasto;

            //crear el elemento HTML tipo LI para insertar 
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id; 

            // agregamos el texto que llevara el nuevo gasto
            nuevoGasto.innerHTML = `${nombre} <span class= "badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            //agregamos el boton de borrar que lleva el gasto, creandolo primero
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            // agregamos el boton eliminar 
            nuevoGasto.appendChild(btnBorrar);

            //agregar al HTML el gasto
            gastoListado.appendChild(nuevoGasto);

        })
    }

    limpiarHTML () {
        //forma lenta
        //contenedorCarrito.innerHTML = '';
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante (restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto (presupuestoObj) {  //preesupuestoOPbj=presupuesto lo identifico asi para empezar a diferenciar el objeto del key
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
         //comprobar 25%
        if( restante < (presupuesto*0.25) ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger'); 
        } else if ( restante < (presupuesto*0.5) ) {
            restanteDiv.classList.remove('alert-success'); //en casod e que tenga la opcion de poder aumentar el presupuesto tendria que remover el alert-danger
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-warning', 'alert-danger');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es menor o igual a 0
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }


}

//Instanciar a nivel global del objeto principal de calculo "presupuesto".
const ui = new UI();
let presupuesto;

//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if(presupuestoUsuario ==='' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    //Presupuesto valido
    presupuesto = new Presupuesto (presupuestoUsuario);
    

    //llamar la funcion para insertar en el HTML
    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
function agregarGasto(e){
    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar campos del forms
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;
    } else if ( cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');

        return;
    }

    //Genero un objeto con el gasto, este metodo es lo contrario al destruturing ya que creo un objeto llamado gasto con las key nombre y cantidad, es decir, junto ambas sleciones en un objeto
    // llamado "objet literal"
    const gasto = { nombre, cantidad, id: Date.now() }; // mejoria del objeto literal.

    //Añade el nuevo objeto gasto al objeto presupuesto 
    presupuesto.nuevoGasto( gasto );

    //mostrar el mensaje de gasto agregado
    ui.imprimirAlerta('Gasto agregado Correctamente');

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.MostrarGastos (gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);


    //reiniciar el formulario
    formulario.reset();
}


function eliminarGasto(id) {
    //elimina del objeto presupuesto
    presupuesto.eliminarGasto(id);

    //Elimina del HTML
    const { gastos, restante } = presupuesto;
    ui.MostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}