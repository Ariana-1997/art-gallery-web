const CLAVE_CARRITO = "otayArtistCarrito";
const CLAVE_HISTORIAL = "otayArtistHistorialCompras";
const formatoSoles = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
});

function leerListaGuardada(clave) {
    const contenido = localStorage.getItem(clave);
    if (contenido === null) return [];

    try {
        const datos = JSON.parse(contenido);
        if (Array.isArray(datos)) return datos;
        throw new Error("El contenido guardado no es una lista válida.");
    } catch (error) {
        console.error(`No se pudo leer ${clave}:`, error);
        alert("No se pudieron leer los datos guardados del carrito. Revisa el almacenamiento del navegador.");
        return [];
    }
}

function guardarLista(clave, datos) {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
        return true;
    } catch (error) {
        console.error(`No se pudo guardar ${clave}:`, error);
        alert("No se pudieron guardar los cambios. Comprueba el espacio disponible en el navegador.");
        return false;
    }
}

function actualizarContadorCarrito() {
    const cantidad = leerListaGuardada(CLAVE_CARRITO)
        .reduce((total, producto) => total + (Number(producto.cantidad) || 0), 0);

    document.querySelectorAll(".contador-carrito").forEach(contador => {
        contador.textContent = cantidad;
        contador.setAttribute("aria-label", `${cantidad} productos en el carrito`);
    });
}

function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

function renderizarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    if (!contenedor) return;

    const carrito = leerListaGuardada(CLAVE_CARRITO);
    const subtotal = carrito.reduce(
        (total, producto) => total + Number(producto.precio) * Number(producto.cantidad),
        0
    );
    const articulos = carrito.reduce(
        (total, producto) => total + Number(producto.cantidad),
        0
    );
    const subtotalEl = document.getElementById("subtotal-carrito");
    const totalEl = document.getElementById("total-carrito");
    const botonCompra = document.getElementById("confirmar-compra");
    const vacio = document.getElementById("carrito-vacio");

    contenedor.replaceChildren();
    subtotalEl.textContent = formatoSoles.format(subtotal);
    totalEl.textContent = formatoSoles.format(subtotal);
    botonCompra.disabled = carrito.length === 0;
    vacio.classList.toggle("d-none", carrito.length > 0);

    carrito.forEach(producto => {
        const fila = crearElemento("article", "fila-carrito");
        const imagen = crearElemento("img", "imagen-carrito");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        const detalle = crearElemento("div", "detalle-carrito");
        detalle.append(
            crearElemento("h3", "", producto.nombre),
            crearElemento("p", "", formatoSoles.format(Number(producto.precio)))
        );

        const controles = crearElemento("div", "controles-cantidad");
        const disminuir = crearElemento("button", "boton-cantidad", "−");
        disminuir.type = "button";
        disminuir.dataset.accion = "disminuir";
        disminuir.dataset.id = producto.id;
        disminuir.setAttribute("aria-label", `Disminuir cantidad de ${producto.nombre}`);
        const cantidad = crearElemento("span", "", String(producto.cantidad));
        const aumentar = crearElemento("button", "boton-cantidad", "+");
        aumentar.type = "button";
        aumentar.dataset.accion = "aumentar";
        aumentar.dataset.id = producto.id;
        aumentar.setAttribute("aria-label", `Aumentar cantidad de ${producto.nombre}`);
        controles.append(disminuir, cantidad, aumentar);

        const importe = crearElemento(
            "strong",
            "importe-carrito",
            formatoSoles.format(Number(producto.precio) * Number(producto.cantidad))
        );
        const eliminar = crearElemento("button", "eliminar-carrito", "Eliminar");
        eliminar.type = "button";
        eliminar.dataset.accion = "eliminar";
        eliminar.dataset.id = producto.id;
        fila.append(imagen, detalle, controles, importe, eliminar);
        contenedor.append(fila);
    });

    actualizarContadorCarrito();
    renderizarHistorial();

    const resumenArticulos = document.getElementById("cantidad-articulos");
    resumenArticulos.textContent = `${articulos} ${articulos === 1 ? "cuadro" : "cuadros"}`;
}

function renderizarHistorial() {
    const contenedor = document.getElementById("historial-compras");
    if (!contenedor) return;

    const historial = leerListaGuardada(CLAVE_HISTORIAL);
    contenedor.replaceChildren();

    if (historial.length === 0) {
        contenedor.append(crearElemento("p", "historial-vacio", "Aún no tienes compras registradas."));
        return;
    }

    historial.slice().reverse().forEach(compra => {
        const tarjeta = crearElemento("article", "compra-historial");
        const fecha = new Date(compra.fecha);
        tarjeta.append(
            crearElemento("h3", "", `Compra del ${fecha.toLocaleDateString("es-PE")}`),
            crearElemento(
                "p",
                "",
                compra.productos.map(producto => `${producto.nombre} × ${producto.cantidad}`).join(", ")
            ),
            crearElemento("strong", "", `Total: ${formatoSoles.format(Number(compra.total))}`)
        );
        contenedor.append(tarjeta);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    renderizarCarrito();

    document.addEventListener("click", event => {
        const botonAgregar = event.target.closest(".agregar-carrito");
        if (botonAgregar) {
            const producto = {
                id: botonAgregar.dataset.id,
                nombre: botonAgregar.dataset.nombre,
                precio: Number(botonAgregar.dataset.precio),
                imagen: botonAgregar.dataset.imagen,
                cantidad: 1
            };
            const carrito = leerListaGuardada(CLAVE_CARRITO);
            const existente = carrito.find(item => item.id === producto.id);
            if (existente) {
                existente.cantidad = Number(existente.cantidad) + 1;
            } else {
                carrito.push(producto);
            }
            if (guardarLista(CLAVE_CARRITO, carrito)) {
                actualizarContadorCarrito();
                botonAgregar.textContent = "Agregado al carrito";
                window.setTimeout(() => {
                    botonAgregar.textContent = "Agregar al carrito";
                }, 1200);
            }
            return;
        }

        const botonAccion = event.target.closest("[data-accion]");
        if (!botonAccion) return;

        const carrito = leerListaGuardada(CLAVE_CARRITO);
        const producto = carrito.find(item => item.id === botonAccion.dataset.id);
        if (!producto) return;

        if (botonAccion.dataset.accion === "aumentar") producto.cantidad++;
        if (botonAccion.dataset.accion === "disminuir") producto.cantidad--;
        const actualizado = carrito.filter(item => item.cantidad > 0);
        if (botonAccion.dataset.accion === "eliminar") {
            guardarLista(CLAVE_CARRITO, carrito.filter(item => item.id !== producto.id));
        } else {
            guardarLista(CLAVE_CARRITO, actualizado);
        }
        renderizarCarrito();
    });

    const botonCompra = document.getElementById("confirmar-compra");
    if (botonCompra) {
        botonCompra.addEventListener("click", () => {
            const carrito = leerListaGuardada(CLAVE_CARRITO);
            if (carrito.length === 0) return;

            const total = carrito.reduce(
                (suma, producto) => suma + Number(producto.precio) * Number(producto.cantidad),
                0
            );
            const resumen = carrito
                .map(producto => `${producto.nombre} × ${producto.cantidad}`)
                .join("\n");
            if (!window.confirm(`Confirma tu compra:\n\n${resumen}\n\nTotal: ${formatoSoles.format(total)}`)) return;

            const historial = leerListaGuardada(CLAVE_HISTORIAL);
            historial.push({
                fecha: new Date().toISOString(),
                productos: carrito.map(({ id, nombre, precio, cantidad }) => ({ id, nombre, precio, cantidad })),
                total
            });
            if (!guardarLista(CLAVE_HISTORIAL, historial)) return;
            if (!guardarLista(CLAVE_CARRITO, [])) {
                historial.pop();
                guardarLista(CLAVE_HISTORIAL, historial);
                return;
            }

            window.alert("¡Compra confirmada! Tu pedido quedó guardado en el historial.");
            renderizarCarrito();
        });
    }
});
