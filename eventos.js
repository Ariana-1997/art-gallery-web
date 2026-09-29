const cuadros = [
    { id: 1, nombre: "ahbjsdbvh", categoria: "xd", descripcion: "1234512345", precio: 10, imagen: "../IMAGENES/img1.png", dimensiones: "40x 60cm", destacado: false },
    { id: 2, nombre: "bhbjsdbvh", categoria: "xd", descripcion: "6789067890", precio: 11, imagen: "../IMAGENES/img2.png", dimensiones: "40x 60cm", destacado: false },
    { id: 3, nombre: "chbjsdbvh", categoria: "xd", descripcion: "1111111111", precio: 12, imagen: "../IMAGENES/img3.png", dimensiones: "40x 60cm", destacado: false },
    { id: 4, nombre: "dhbjsdbvh", categoria: "xd", descripcion: "2222222222", precio: 13, imagen: "../IMAGENES/img4.png", dimensiones: "40x 60cm", destacado: false },
    { id: 5, nombre: "ehbjsdbvh", categoria: "xd", descripcion: "3333333333", precio: 14, imagen: "../IMAGENES/img5.png", dimensiones: "40x 60cm", destacado: false },
    { id: 6, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 7, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 8, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 9, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 10, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 11, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 12, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 13, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 14, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 15, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 16, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 17, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 18, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 19, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false },
    { id: 20, nombre: "", categoria: "", descripcion: "", precio: 0, imagen: "../IMAGENES/", dimensiones: "40x 60cm", destacado: false }
];



document.addEventListener("DOMContentLoaded", function () {
    const inputBusqueda = document.getElementById("busqueda-input");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const infoBusqueda = document.getElementById("info-busqueda");
    const sinResultados = document.getElementById("sin-resultados");
    const contenedor = document.getElementById("cuadrosOTAY");
    
    contenedor.innerHTML = "";
    cuadros.forEach(cuadro => {
        contenedor.innerHTML += `
    <div class="tarjeta_productos item-tarjeta" data-nombre="${cuadro.nombre}" data-descripcion="${cuadro.descripcion}">
    <div class="marco-imagen">
    <img class="producto1" src="${cuadro.imagen}" alt="Portada de ${cuadro.nombre}">
    </div>
    <div class="info_producto">
    <h3 class="prod-titulo">${cuadro.nombre}</h3>
    <p>categoria: ${cuadro.categoria}</p>
    <p>descripcion: <span class="prod-desc">${cuadro.descripcion}</span></p>
    <p>dimensiones: ${cuadro.dimensiones}</p>
    <p>precio: S/ ${cuadro.precio}</p>
    </div>
    </div>
    `;
    });
    // 2. Seleccionar las tarjetas DESPUÉS de crearlas
    const tarjetas = document.querySelectorAll(".item-tarjeta");

    function escaparRegex(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }


    function filtrarProductos() {
        const query = inputBusqueda.value.toLowerCase().trim();
        let coincidencias = 0;

        tarjetas.forEach(function (card) {
            const nombre = card.getAttribute("data-nombre");
            const descripcion = card.getAttribute("data-descripcion");
            const textoTotal = (nombre + " " + descripcion).toLowerCase();

            const tituloEl = card.querySelector(".prod-titulo");
            const descEl = card.querySelector(".prod-desc");

            if (textoTotal.includes(query)) {
                card.style.display = "";
                coincidencias++;

                if (query !== "") {
                    const regex = new RegExp(`(${query})`, "gi");
                    tituloEl.innerHTML = nombre.replace(regex, '<span class="resaltado-busqueda">$1</span>');
                    descEl.innerHTML = descripcion.replace(regex, '<span class="resaltado-busqueda">$1</span>');
                } else {
                    tituloEl.textContent = nombre;
                    descEl.textContent = descripcion;
                }
            } else {
                card.style.display = "none";
            }
        });

        if (query === "") {
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

    btnLimpiar.addEventListener("click", function () {
        inputBusqueda.value = "";
        filtrarProductos();
        inputBusqueda.focus();
    });
});