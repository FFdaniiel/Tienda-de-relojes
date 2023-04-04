//  Variable que mantiene el estado visible del carrito
var carritoVisible = false;

// Esperamos que todos los ementos de la página se carguen para continuar con el script
if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

function ready(){
    // Agregamos funcionalidad a los botones Eliminar del carrito
    let botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for(var i = 0;  i < botonesEliminarItem.length; i++){
        let button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    // Agrego funcionalidad al boton sumar cantidad
    let botonesSumarCantidad = document.querySelectorAll('.sumar-cantidad');
    for(let i = 0; i < botonesSumarCantidad.length; i++){
        let button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);

    }
     // Agrego funcionalidad al boton restar cantidad
     let botonesRestarCantidad = document.querySelectorAll('.restar-cantidad');
     for(let i = 0; i < botonesRestarCantidad.length; i++){
         let button = botonesRestarCantidad[i];
         button.addEventListener('click', restarCantidad);
 
     }

    //  Agrego funcionalidad a los botones Agregar al Carrito
    let botonesAgregarAlCarrito = document.querySelectorAll('.boton-item');

    for (let i = 0; i < botonesAgregarAlCarrito.length; i++) {
    let button = botonesAgregarAlCarrito[i];
    button.addEventListener('click', agregarAlCarritoClicked);
    
    }

    // Agregar funcionalidad al boton pagar
    document.querySelectorAll('.btn-pagar')[0].addEventListener('click', pagarClicked);

}

// Elimino el item seleccionado del carrito

function eliminarItemCarrito(event){
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    
    // Actualizamos el total del carrito una vez que hemos eliminado un item
    actualizarTotalCarrito();
    
    // La siguiente funcion controla si hay elementos en el carrito una vez que se elimino
    // si no hay debo ocultar el carrito
    ocultarCarrito();
}

// Actualizar el total del carrito
function actualizarTotalCarrito(){
    // seleccionamos el contenedor carrito
    let carritoContenedor = document.querySelectorAll('.carrito')[0];
    let carritoItems = carritoContenedor.getElementsByClassName('carrito-item')
    let total = 0;

    // Recorremos cada elemento del carrito para actualizar el total

    for( let i = 0; i < carritoItems.length; i++){
        let item = carritoItems[i];
        let precioElemento = item.querySelectorAll('.carrito-item-precio')[0];
        // console.log(precioElemento);
        // Quitamos el simbolo peso y el punto de milesimo
        let precio = parseFloat(precioElemento.innerText.replace('$','').replace('.',''));
        let cantidadItem = item.querySelectorAll('.carrito-item-cantidad')[0];
        let cantidad = cantidadItem.value;
        // console.log(cantidad);
        total = total + (precio * cantidad);
    }
    total = Math.round(total*100)/100;
    document.querySelectorAll('.carrito-precio-total')[0].innerText = `$${total.toLocaleString('es')},00`;
}

function ocultarCarrito(){
    let carritoItems = document.querySelectorAll('.carrito-items')[0];
    if(carritoItems.childElementCount == 0){
        let carrito = document.querySelectorAll('.carrito')[0];
        carrito.style.marginRight = '-100%'
        carrito.style.opacity = '0';
        carritoVisible = false;

        //Ahora maximizo el contedor de los elementos

        let items = document.querySelectorAll('.contenedor-items')[0];
        items.style.width = '100%';
    }
}

// Aumento en uno la cantidad del elemento seleccionado

function sumarCantidad(event){
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.querySelectorAll('.carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.querySelectorAll('.carrito-item-cantidad')[0].value = cantidadActual;
   
    // Actualizamos el total
    actualizarTotalCarrito();
}
// Restamos en uno la cantidad del elemento seleccionado
function restarCantidad(event){
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.querySelectorAll('.carrito-item-cantidad')[0].value;
    cantidadActual--;

    // Controlamos que no sea menor que 1
    if(cantidadActual >= 1){

        selector.querySelectorAll('.carrito-item-cantidad')[0].value = cantidadActual;
   
        // Actualizamos el total
        actualizarTotalCarrito();
    }
}

function agregarAlCarritoClicked(event){
    let button = event.target;
    let item = button.parentElement;
    let titulo = item.querySelectorAll('.titulo-item')[0].innerText;
    let precio = item.querySelectorAll('.precio-item')[0].innerText;
    let imagenSrc = item.querySelectorAll('.img-item')[0].src;

    // La siguiente funcion agrega el elemento al carrito. Le mando por parámetros los valores
    agregarItemCarrito(titulo, precio, imagenSrc);


    // Hacemos visible el carrito cuanto agrega por primera vez
    hacerVisibleCarrito();
}

function agregarItemCarrito(titulo, precio, imagenSrc){
    let item = document.createElement('div');
    item.classList.add = 'item';
    let itemsCarrito = document.querySelectorAll('.carrito-items')[0];

    // Vamos a controlar que el item que esta ingresando no se encuentra ya en el carrito
    let nombresItemsCarrito = itemsCarrito.querySelectorAll('.carrito-item-titulo');
    for (let i = 0; i < nombresItemsCarrito.length; i++) {
        if(nombresItemsCarrito[i].innerText == titulo){
            // SweetAlert
            Swal.fire({
                toast: true,
                timerProgressBar: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2500,
                icon: 'error',
                title: `${titulo.toLowerCase()} ya se encuentra en el carrito`,
                showClass: {
                    popup: 'animate__animated animate__bounceInRight'
                },
                hideClass: {
                    popup: 'animate__animated animate__bounceOutRight'
                },
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                  }
            })

            return;
        }
    }

    let itemCarritoContenido = `
    <div class="carrito-item">
        <img src="${imagenSrc}" alt="" width="80px">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <span class="btn-eliminar">
            <i class="fa-solid fa-trash"></i>
        </span>
    </div>
    `
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    // Agregamos la funcionalidad Eliminar del nuevo item
    item.querySelectorAll('.btn-eliminar')[0].addEventListener('click',eliminarItemCarrito);
    
    // Agregamos la funcionalidad de sumar del nuevo elemento
    let botonSumarCantidad = item.querySelectorAll('.sumar-cantidad')[0];
        botonSumarCantidad.addEventListener('click', sumarCantidad);

    // Agregamos la funcionalidad de restar del nuevo elemento
    let botonRestarCantidad = item.querySelectorAll('.restar-cantidad')[0];
        botonRestarCantidad.addEventListener('click', restarCantidad);
    actualizarTotalCarrito()
}

//  
function pagarClicked(event){
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: '¡Compra realizada con éxito!',
        text: 'Gracias por su compra',
        showConfirmButton: false,
        timer: 2500,
        preConfirm: true,
        timerProgressBar: true,
      })

    //   Elimino todos los elementos de carrito
    let carritoItems = document.querySelectorAll('.carrito-items')[0];
    setTimeout(() => {
        while (carritoItems.hasChildNodes()) {
            carritoItems.removeChild(carritoItems.firstChild);
        }

        // Actualiza el carrito
        actualizarTotalCarrito();
        //   Funcion que oculta el carrito
        ocultarCarrito()
      }, 2500);
    
    
}

function hacerVisibleCarrito(){
    carritoVisible = true;
    let carrito = document.querySelectorAll('.carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    let items = document.querySelectorAll('.contenedor-items')[0];
    items.style.width ='60%';
}