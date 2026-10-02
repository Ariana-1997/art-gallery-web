const cuadros = [
    { id: 1, nombre: "Ciervo dorado", categoria: "Óleo sobre lienzo", descripcion: "Un ciervo de gran cornamenta destaca sobre un fondo de tonos cálidos y dorados, ideal para dar presencia y calidez a una sala.", precio: 1150, imagen: "../IMAGENES/p_img1.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 2, nombre: "Peces koi", categoria: "Óleo sobre lienzo", descripcion: "Dos peces koi rojizos nadan entre pinceladas claras y reflejos dorados; una composición de movimiento y abundancia.", precio: 980, imagen: "../IMAGENES/p_img2.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 3, nombre: "Tigre blanco", categoria: "Óleo sobre lienzo", descripcion: "Retrato cercano de un tigre blanco con ojos ámbar y acentos dorados que resaltan su expresión serena e intensa.", precio: 1250, imagen: "../IMAGENES/p_img3.jpg", dimensiones: "80 x 80 cm", destacado: false },
    { id: 4, nombre: "Bodegon animalista", categoria: "Óleo sobre lienzo", descripcion: "Racimos de uvas y flores rosadas en una escena de naturaleza muerta clásica.", precio: 1050, imagen: "../IMAGENES/p_img4.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 5, nombre: "Bodegón vínico", categoria: "Óleo sobre lienzo", descripcion: "Bodegón de vino, copa y uvas iluminado por una luz cálida, con contrastes profundos y pincelada marcada.", precio: 1100, imagen: "../IMAGENES/p_img5.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 6, nombre: "Bodegon añejo", categoria: "Óleo sobre lienzo", descripcion: "Ramo de flores blancas y azules en un jarrón brillante, pintado con una textura rica y tonos elegantes.", precio: 920, imagen: "../IMAGENES/p_img6.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 7, nombre: "Blue", categoria: "Óleo sobre lienzo", descripcion: "Ramos de hortencias blancas y azules en un jarrón brillante, pintado con una textura rica y tonos elegantes.", precio: 990, imagen: "../IMAGENES/p_img7.jpg", dimensiones: "80 x 120 cm", destacado: false },
    { id: 8, nombre: "Cervatillo silvestre", categoria: "Óleo sobre lienzo", descripcion: "Un cervatillo mira al espectador desde un prado de pequeñas flores blancas y vegetación en tonos profundos.", precio: 1080, imagen: "../IMAGENES/p_img8.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 9, nombre: "Pericos primaverales", categoria: "Óleo sobre lienzo", descripcion: "Estos pericos están en plena primavera, con plumas vibrantes y miradas curiosas.", precio: 850, imagen: "../IMAGENES/p_img9.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 10, nombre: "Happy Purple", categoria: "Óleo sobre lienzo", descripcion: "flores violetas de pétalos amplios y centros oscuros sobre un fondo suave de tonos verdes y rosados.", precio: 1180, imagen: "../IMAGENES/p_img10.jpg", dimensiones: "100 x 80 cm", destacado: false },
    { id: 11, nombre: "Loto", categoria: "Óleo sobre lienzo", descripcion: "Primer plano de loto y detalles dorados sobre un fondo luminoso.", precio: 890, imagen: "../IMAGENES/p_img11.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 12, nombre: "Orquideas", categoria: "Óleo sobre lienzo", descripcion: "orquídeas blancas resaltan sobre un fondo abstracto de grises y dorados, con una composición vertical elegante.", precio: 1200, imagen: "../IMAGENES/p_img12.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 13, nombre: "Peonias", categoria: "Óleo sobre lienzo", descripcion: "peonías en plena floración, con pétalos suaves y colores vibrantes.", precio: 980, imagen: "../IMAGENES/p_img13.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 14, nombre: "El baile", categoria: "Óleo sobre lienzo", descripcion: "Cisnes blancos se encuentran sobre un estanque azul, rodeados de flores y reflejos de colores.", precio: 1320, imagen: "../IMAGENES/p_img14.jpg", dimensiones: "100 x 80 cm", destacado: false },
    { id: 15, nombre: "Cisnes", categoria: "Óleo sobre lienzo", descripcion: "cisnes sobre tonos calidos en estanque con lotos", precio: 1050, imagen: "../IMAGENES/p_img15.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 16, nombre: "Bodegon", categoria: "Retrato al óleo sobre lienzo", descripcion: "bodegon de frutas, uvas y telas", precio: 1650, imagen: "../IMAGENES/p_img16.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 17, nombre: "Caballo", categoria: "Óleo sobre lienzo", descripcion: "Representación devocional de Jesús con el Sagrado Corazón, manto rojo y túnica clara.", precio: 1450, imagen: "../IMAGENES/p_img17.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 18, nombre: "Retrato personalizado", categoria: "Óleo sobre lienzo", descripcion: "retrato personalizado de una persona", precio: 1580, imagen: "../IMAGENES/p_img18.jpg", dimensiones: "80 x 120 cm", destacado: false },
    { id: 19, nombre: "San Miguel", categoria: "Óleo sobre lienzo", descripcion: "san Miguel Arcángel protector de la humanidad.", precio: 1120, imagen: "../IMAGENES/p_img19.jpg", dimensiones: "80 x 100 cm", destacado: false },
    { id: 20, nombre: "Sagrado corazon", categoria: "Óleo sobre lienzo", descripcion: "Sagrado corazon de Jesus protector y piadoso.", precio: 1350, imagen: "../IMAGENES/p_img20.jpg", dimensiones: "100 x 80 cm", destacado: false }
];



document.addEventListener("DOMContentLoaded", function () {
    const inputBusqueda = document.getElementById("busqueda-input");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const infoBusqueda = document.getElementById("info-busqueda");
    const sinResultados = document.getElementById("sin-resultados");
    const contenedor = document.getElementById("cuadrosOTAY");
    
    contenedor.innerHTML = "";
    cuadros.forEach(cuadro => {
        const mensajeCompra = encodeURIComponent(
                `Hola, quisiera comprar el cuadro "${cuadro.nombre}" por S/ ${cuadro.precio}.`
            );
        contenedor.innerHTML += `
    <div class="tarjeta_productos item-tarjeta" data-nombre="${cuadro.nombre}" data-descripcion="${cuadro.descripcion}">
    <div class="marco-imagen">
    <img class="producto1" src="${cuadro.imagen}" alt="Portada de ${cuadro.nombre}">
    </div>
    <div class="info_producto">
    <h3 class="prod-titulo">${cuadro.nombre}</h3>
    <p><b>categoria:</b> ${cuadro.categoria}</p>
    <p class="prod-desc-p"><b>descripcion:</b> <span class="prod-desc">${cuadro.descripcion}</span></p>
    <button class="btn-ver-mas" type="button">ver más</button><br><br>
    <p><b>dimensiones:</b> ${cuadro.dimensiones}</p>
    <p><b>precio:</b> S/ ${cuadro.precio}</p>
    <a class="boton-comprar" href="https://wa.me/51926824898?text=${mensajeCompra}" target="_blank" rel="noopener noreferrer">Comprar</a>
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
        contenedor.addEventListener("click", function (e) {
        if (!e.target.classList.contains("btn-ver-mas")) return;

        const parrafo = e.target.closest(".info_producto").querySelector(".prod-desc-p");
        const expandido = parrafo.classList.toggle("expandido");
        e.target.textContent = expandido ? "ver menos" : "ver más";
    });
});

