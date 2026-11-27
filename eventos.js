document.addEventListener("DOMContentLoaded", function () {
    const inputBusqueda = document.getElementById("busqueda-input");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const infoBusqueda = document.getElementById("info-busqueda");
    const sinResultados = document.getElementById("sin-resultados");
    const contenedor = document.getElementById("cuadrosOTAY");
    const selectOrden = document.getElementById("orden-productos");
    const selectCategoria = document.getElementById("filtro-categoria");
    const checkOfertas = document.getElementById("solo-ofertas");
    // eventos.js se carga en varias páginas: solo seguimos si existe la galería.
    if (!contenedor || typeof obtenerCuadros !== "function") return;

    const cuadros = obtenerCuadros();
    contenedor.innerHTML = "";
    cuadros.forEach((original, posicion) => {
        // Escapamos todos los textos: ahora los escribe el admin.
        const cuadro = {
            ...original,
            nombre: escaparHTML(original.nombre),
            categoria: escaparHTML(original.categoria),
            descripcion: escaparHTML(original.descripcion),
            dimensiones: escaparHTML(original.dimensiones),
            imagen: escaparHTML(original.imagen)
        };
        const tieneDesc = cuadro.descuento >0;
        contenedor.innerHTML += `
    <div class="tarjeta_productos item-tarjeta" data-nombre="${cuadro.nombre}" data-descripcion="${cuadro.descripcion}"
        data-categoria="${cuadro.categoria}" data-precio="${precioFinal(cuadro)}" data-descuento="${Number(cuadro.descuento) || 0}" data-posicion="${posicion}">
    ${tieneDesc ? `<span class="etiqueta-desc">-${cuadro.descuento}%</span>` : ""}
    <div class="marco-imagen">
    <img class="producto1" src="${cuadro.imagen}" alt="Portada de ${cuadro.nombre}">
    </div>
    <div class="info_producto">
    <h3 class="prod-titulo">${cuadro.nombre}</h3>
    <p><b>categoria:</b> ${cuadro.categoria}</p>
    <p class="prod-desc-p"><b>descripcion:</b> <span class="prod-desc">${cuadro.descripcion}</span></p>
    <button class="btn-ver-mas" type="button">ver más</button><br><br>
    <p><b>dimensiones:</b> ${cuadro.dimensiones}</p>
    <p class="precio-wrap">
        <b>precio:</b>
        <span class="precio-final">S/ ${precioFinal(cuadro)}</span>
        ${tieneDesc ? `<s class="precio-antes">S/ ${cuadro.precio}</s>` : ""}
    </p>
    <button class="boton-comprar agregar-carrito" type="button" data-id="cuadro-${cuadro.id}" data-nombre="${cuadro.nombre}" data-precio="${precioFinal(cuadro)}" data-imagen="${cuadro.imagen}">Agregar al carrito</button>
    </div>
    </div>
    `;
    });

    // 2. Seleccionar las tarjetas DESPUÉS de crearlas
    const tarjetas = Array.from(document.querySelectorAll(".item-tarjeta"));

    // Llenar el filtro de categorías con las que existen en el catálogo
    if (selectCategoria) {
        [...new Set(cuadros.map(c => c.categoria))]
            .sort((a, b) => a.localeCompare(b, "es"))
            .forEach(categoria => selectCategoria.append(new Option(categoria, categoria)));
    }

    // Comparadores para cada opción de "Ordenar por"
    const ordenes = {
        destacados: (a, b) => a.dataset.posicion - b.dataset.posicion,
        "precio-asc": (a, b) => a.dataset.precio - b.dataset.precio,
        "precio-desc": (a, b) => b.dataset.precio - a.dataset.precio,
        "nombre-asc": (a, b) => a.dataset.nombre.localeCompare(b.dataset.nombre, "es"),
        "nombre-desc": (a, b) => b.dataset.nombre.localeCompare(a.dataset.nombre, "es"),
        descuento: (a, b) => (b.dataset.descuento - a.dataset.descuento) || (a.dataset.posicion - b.dataset.posicion)
    };

    function ordenarTarjetas() {
        const criterio = selectOrden ? selectOrden.value : "destacados";
        tarjetas.slice().sort(ordenes[criterio] || ordenes.destacados)
            .forEach(card => contenedor.append(card));
    }

    function escaparRegex(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }


    function filtrarProductos() {
        const query = inputBusqueda.value.toLowerCase().trim();
        const categoria = selectCategoria ? selectCategoria.value : "";
        const soloOfertas = checkOfertas ? checkOfertas.checked : false;
        const hayFiltros = query !== "" || categoria !== "" || soloOfertas;
        let coincidencias = 0;

        tarjetas.forEach(function (card) {
            const nombre = card.getAttribute("data-nombre");
            const descripcion = card.getAttribute("data-descripcion");
            const textoTotal = (nombre + " " + descripcion).toLowerCase();

            const tituloEl = card.querySelector(".prod-titulo");
            const descEl = card.querySelector(".prod-desc");

            const pasaCategoria = !categoria || card.dataset.categoria === categoria;
            const pasaOferta = !soloOfertas || Number(card.dataset.descuento) > 0;

            if (textoTotal.includes(query) && pasaCategoria && pasaOferta) {
                card.style.display = "";
                coincidencias++;

                if (query !== "") {
                    const regex = new RegExp(`(${escaparRegex(escaparHTML(query))})`, "gi");
                    tituloEl.innerHTML = escaparHTML(nombre).replace(regex, '<span class="resaltado-busqueda">$1</span>');
                    descEl.innerHTML = escaparHTML(descripcion).replace(regex, '<span class="resaltado-busqueda">$1</span>');
                } else {
                    tituloEl.textContent = nombre;
                    descEl.textContent = descripcion;
                }
            } else {
                card.style.display = "none";
            }
        });

        if (!hayFiltros) {
            infoBusqueda.textContent = "";
            sinResultados.classList.add("d-none");
        } else {
            infoBusqueda.textContent = `Mostrando ${coincidencias} de ${tarjetas.length} productos`;
            if (coincidencias === 0) {
                sinResultados.classList.remove("d-none");
            } else {
                sinResultados.classList.add("d-none");
            }
        }
    }

    inputBusqueda.addEventListener("input", filtrarProductos);
    if (selectCategoria) selectCategoria.addEventListener("change", filtrarProductos);
    if (checkOfertas) checkOfertas.addEventListener("change", filtrarProductos);
    if (selectOrden) selectOrden.addEventListener("change", ordenarTarjetas);

    btnLimpiar.addEventListener("click", function () {
        inputBusqueda.value = "";
        if (selectCategoria) selectCategoria.value = "";
        if (checkOfertas) checkOfertas.checked = false;
        if (selectOrden) selectOrden.value = "destacados";
        ordenarTarjetas();
        filtrarProductos();
        inputBusqueda.focus();
    });
    contenedor.addEventListener("click", function (e) {
        if (!e.target.classList.contains("btn-ver-mas")) return;

        const parrafo = e.target.closest(".info_producto").querySelector(".prod-desc-p");
        const expandido = parrafo.classList.toggle("expandido");
        e.target.textContent = expandido ? "ver menos" : "ver más";
    });
});


//  login 
function login(event) {
    if (event) event.preventDefault();
    const userInput = document.getElementById("username");
    const passInput = document.getElementById("password");
    const error = document.getElementById("error");
    const user = userInput.value.trim();
    const pass = passInput.value;

    userInput.classList.remove("login-invalido");
    passInput.classList.remove("login-invalido");

    if (!user || !pass) {
        if (!user) userInput.classList.add("login-invalido");
        if (!pass) passInput.classList.add("login-invalido");
        if (error) error.textContent = "Completa usuario y contraseña.";
        return;
    }

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("usuario", user);
        window.location.href = "admin.html";
    } else {
        userInput.classList.add("login-invalido");
        passInput.classList.add("login-invalido");
        passInput.value = "";
        passInput.focus();
        if (error) error.textContent = "Usuario o contraseña incorrectos.";
    }
}

// mensaje de bienvenida solo si existe en la página
const usuario = localStorage.getItem("usuario");
const mensaje = document.getElementById("mensaje");
if (mensaje) {
    mensaje.innerText = usuario
        ? "Hola, " + usuario + " desde este espacio tendrás acceso a las principales herramientas para administrar y supervisar el funcionamiento de la plataforma de manera sencilla, rápida y organizada. Podrás gestionar cuadros, registrar nuevos productos, actualizar información y mantener todo en orden para brindar una mejor experiencia a nuestros usuarios. Te invitamos a explorar las diferentes opciones del panel y aprovechar al máximo sus funcionalidades"
        : "Usted no tiene sesión activa";
}

function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
}

// gráficos solo si el canvas existe en la página
const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const ventas = [25, 30, 20, 18, 15, 5, 30, 20, 18, 15, 45, 22];

const cBarras = document.getElementById('GraficoBarras');
if (cBarras) {
    new Chart(cBarras, {
        type: 'pie',
        data: { labels: meses, datasets: [{ data: ventas }] },
        options: { responsive: true,
            plugins: { title: { display: true, text: '% de ventas por mes' } } }
    });
}

const cPie = document.getElementById('GraficoBarras1');
if (cPie) {
    new Chart(cPie, {
        type: 'bar',
        data: { labels: meses, datasets: [{ label: 'Ventas (S/)', data: ventas }] },
        options: { responsive: true,
            plugins: { title: { display: true, text: 'Ventas por mes' } } }
    });
}

const cLineas = document.getElementById('GraficoLineas');
if (cLineas) {
    new Chart(cLineas, {
        type: 'line',
        data: {
            labels: meses.slice(0, 6),
            datasets: [
                { label: 'VENTAS (S/)', data: [1200, 1500, 1800, 1700, 2200, 2500], tension: 0.3 },
                { label: 'GASTOS (S/)', data: [800, 1000, 1200, 1100, 1500, 1800], tension: 0.3 }
            ]
        },
        options: { responsive: true,
            plugins: { title: { display: true, text: 'Evolución de ventas y gastos' } } }
    });
}