// admin_crud.js — Lógica de la página crud_admin.html
// Depende de catalogo.js (crearCuadro, obtenerCuadros, actualizarCuadro, eliminarCuadro...)

const TAMANO_MAX_IMAGEN = 400 * 1024; // 400 KB: localStorage tiene ~5 MB en total

document.addEventListener("DOMContentLoaded", () => {
    const cuerpoTabla = document.getElementById("tabla-cuadros");
    const filtro = document.getElementById("filtro-admin");
    const contador = document.getElementById("contador-cuadros");
    const aviso = document.getElementById("aviso-crud");

    const modalEl = document.getElementById("modal-cuadro");
    const modal = new bootstrap.Modal(modalEl);
    const form = document.getElementById("form-cuadro");
    const tituloModal = document.getElementById("titulo-modal");
    const inputArchivo = document.getElementById("cuadro-archivo");
    const vistaPrevia = document.getElementById("vista-previa");
    const errorGeneral = document.getElementById("error-general");

    const modalBorrarEl = document.getElementById("modal-eliminar");
    const modalBorrar = new bootstrap.Modal(modalBorrarEl);
    let idPorEliminar = null;

    // ---------- READ ----------
    function renderTabla() {
        const texto = filtro.value.toLowerCase().trim();
        const cuadros = obtenerCuadros().filter(c =>
            `${c.nombre} ${c.categoria} ${c.descripcion}`.toLowerCase().includes(texto)
        );
        cuerpoTabla.replaceChildren();
        contador.textContent = `${cuadros.length} cuadro(s)`;

        if (cuadros.length === 0) {
            const fila = cuerpoTabla.insertRow();
            const celda = fila.insertCell();
            celda.colSpan = 7;
            celda.className = "text-center text-muted py-4";
            celda.textContent = "No hay cuadros que mostrar.";
            return;
        }

        cuadros.forEach(c => {
            const fila = cuerpoTabla.insertRow();
            fila.insertCell().textContent = c.id;

            const img = document.createElement("img");
            img.src = c.imagen;
            img.alt = c.nombre;
            img.className = "rounded";
            img.style.cssText = "width:56px;height:56px;object-fit:cover";
            fila.insertCell().append(img);

            fila.insertCell().textContent = c.nombre;
            fila.insertCell().textContent = c.categoria;
            fila.insertCell().textContent = c.dimensiones;

            const precio = fila.insertCell();
            precio.textContent = `S/ ${precioFinal(c)}`;
            if (c.descuento > 0) {
                const badge = document.createElement("span");
                badge.className = "badge bg-danger ms-1";
                badge.textContent = `-${c.descuento}%`;
                precio.append(badge);
            }

            const acciones = fila.insertCell();
            acciones.className = "text-nowrap";
            acciones.innerHTML = `
                <button class="btn btn-sm btn-outline-primary me-1" data-accion="editar" data-id="${c.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger" data-accion="borrar" data-id="${c.id}">Eliminar</button>`;
        });
    }

    function mostrarAviso(mensaje, tipo = "success") {
        aviso.className = `alert alert-${tipo}`;
        aviso.textContent = mensaje;
        window.clearTimeout(mostrarAviso.t);
        mostrarAviso.t = window.setTimeout(() => aviso.classList.add("d-none"), 3000);
    }

    // ---------- Formulario (CREATE / UPDATE) ----------
    function limpiarErrores() {
        form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
        errorGeneral.classList.add("d-none");
    }

    function mostrarErrores(errores) {
        Object.entries(errores).forEach(([campo, mensaje]) => {
            if (campo === "general") {
                errorGeneral.textContent = mensaje;
                errorGeneral.classList.remove("d-none");
                return;
            }
            const input = form.elements[campo];
            if (!input) return;
            input.classList.add("is-invalid");
            input.parentElement.querySelector(".invalid-feedback").textContent = mensaje;
        });
    }

    function actualizarVistaPrevia() {
        const src = form.elements.imagen.value.trim();
        vistaPrevia.classList.toggle("d-none", !src);
        if (src) vistaPrevia.src = src;
    }

    function abrirFormulario(cuadro = null) {
        form.reset();
        limpiarErrores();
        inputArchivo.value = "";
        form.elements.id.value = cuadro ? cuadro.id : "";
        tituloModal.textContent = cuadro ? `Editar: ${cuadro.nombre}` : "Nuevo cuadro";
        if (cuadro) {
            ["nombre", "categoria", "descripcion", "dimensiones", "imagen", "precio", "descuento"]
                .forEach(campo => { form.elements[campo].value = cuadro[campo] ?? ""; });
        } else {
            form.elements.categoria.value = "Óleo sobre lienzo";
            form.elements.descuento.value = 0;
        }
        actualizarVistaPrevia();
        modal.show();
    }

    // Subir imagen desde el PC -> se guarda como Data URL (base64)
    inputArchivo.addEventListener("change", () => {
        const archivo = inputArchivo.files[0];
        if (!archivo) return;
        if (!archivo.type.startsWith("image/")) {
            mostrarErrores({ imagen: "El archivo debe ser una imagen." });
            inputArchivo.value = "";
            return;
        }
        if (archivo.size > TAMANO_MAX_IMAGEN) {
            mostrarErrores({ imagen: "La imagen pesa más de 400 KB. Comprímela o usa una ruta en IMAGENES/." });
            inputArchivo.value = "";
            return;
        }
        const lector = new FileReader();
        lector.onload = () => {
            form.elements.imagen.value = lector.result;
            form.elements.imagen.classList.remove("is-invalid");
            actualizarVistaPrevia();
        };
        lector.readAsDataURL(archivo);
    });
    form.elements.imagen.addEventListener("input", actualizarVistaPrevia);

    form.addEventListener("submit", event => {
        event.preventDefault();
        limpiarErrores();
        const entrada = Object.fromEntries(new FormData(form));
        const id = entrada.id;
        const resultado = id ? actualizarCuadro(id, entrada) : crearCuadro(entrada);

        if (!resultado.ok) {
            mostrarErrores(resultado.errores);
            return;
        }
        modal.hide();
        renderTabla();
        mostrarAviso(id ? `"${resultado.cuadro.nombre}" se actualizó.` : `"${resultado.cuadro.nombre}" se creó.`);
    });

    // ---------- DELETE ----------
    document.getElementById("confirmar-eliminar").addEventListener("click", () => {
        const cuadro = obtenerCuadroPorId(idPorEliminar);
        if (cuadro && eliminarCuadro(idPorEliminar)) {
            mostrarAviso(`"${cuadro.nombre}" se eliminó.`, "warning");
        }
        idPorEliminar = null;
        modalBorrar.hide();
        renderTabla();
    });

    // ---------- Delegación de eventos en la tabla ----------
    cuerpoTabla.addEventListener("click", event => {
        const boton = event.target.closest("[data-accion]");
        if (!boton) return;
        const cuadro = obtenerCuadroPorId(boton.dataset.id);
        if (!cuadro) return renderTabla();

        if (boton.dataset.accion === "editar") abrirFormulario(cuadro);
        if (boton.dataset.accion === "borrar") {
            idPorEliminar = cuadro.id;
            document.getElementById("nombre-eliminar").textContent = cuadro.nombre;
            modalBorrar.show();
        }
    });

    document.getElementById("btn-nuevo").addEventListener("click", () => abrirFormulario());
    document.getElementById("btn-restaurar").addEventListener("click", () => {
        if (!window.confirm("Se borrarán tus cambios y se cargarán los 20 cuadros originales. ¿Continuar?")) return;
        restaurarCatalogoInicial();
        renderTabla();
        mostrarAviso("Catálogo restaurado.", "info");
    });
    filtro.addEventListener("input", renderTabla);

    renderTabla();
});
