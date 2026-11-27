// =====================================================================
// catalogo.js — Capa de datos del catálogo (única fuente de verdad)
// La tienda (productos.html) y el panel (crud_admin.html) leen y escriben
// los cuadros SOLO a través de estas funciones. Hoy persisten en
// localStorage; si mañana hay un backend, solo cambia este archivo.
// =====================================================================

const CLAVE_CUADROS = "otayArtistCuadros";

// Datos semilla: se copian a localStorage la primera vez que se abre la web.
const CUADROS_INICIALES = [
    { id: 1, nombre: "Ciervo dorado", categoria: "Óleo sobre lienzo", descripcion: "Un ciervo de gran cornamenta destaca sobre un fondo de tonos cálidos y dorados, ideal para dar presencia y calidez a una sala.", precio: 1150, imagen: "../IMAGENES/p_img1.jpg", dimensiones: "80 x 100 cm", descuento: 20 },
    { id: 2, nombre: "Peces koi", categoria: "Óleo sobre lienzo", descripcion: "Dos peces koi rojizos nadan entre pinceladas claras y reflejos dorados; una composición de movimiento y abundancia.", precio: 980, imagen: "../IMAGENES/p_img2.jpg", dimensiones: "80 x 100 cm", descuento: 25 },
    { id: 3, nombre: "Tigre blanco", categoria: "Óleo sobre lienzo", descripcion: "Retrato cercano de un tigre blanco con ojos ámbar y acentos dorados que resaltan su expresión serena e intensa.", precio: 1250, imagen: "../IMAGENES/p_img3.jpg", dimensiones: "80 x 80 cm", descuento: 10 },
    { id: 4, nombre: "Bodegon animalista", categoria: "Óleo sobre lienzo", descripcion: "Racimos de uvas y flores rosadas en una escena de naturaleza muerta clásica.", precio: 1050, imagen: "../IMAGENES/p_img4.jpg", dimensiones: "80 x 100 cm", descuento: 15 },
    { id: 5, nombre: "Bodegón vínico", categoria: "Óleo sobre lienzo", descripcion: "Bodegón de vino, copa y uvas iluminado por una luz cálida, con contrastes profundos y pincelada marcada.", precio: 1100, imagen: "../IMAGENES/p_img5.jpg", dimensiones: "80 x 100 cm",descuento: 0},
    { id: 6, nombre: "Bodegon añejo", categoria: "Óleo sobre lienzo", descripcion: "Ramo de flores blancas y azules en un jarrón brillante, pintado con una textura rica y tonos elegantes.", precio: 920, imagen: "../IMAGENES/p_img6.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 7, nombre: "Blue", categoria: "Óleo sobre lienzo", descripcion: "Ramos de hortencias blancas y azules en un jarrón brillante, pintado con una textura rica y tonos elegantes.", precio: 990, imagen: "../IMAGENES/p_img7.jpg", dimensiones: "80 x 120 cm", descuento: 0},
    { id: 8, nombre: "Cervatillo silvestre", categoria: "Óleo sobre lienzo", descripcion: "Un cervatillo mira al espectador desde un prado de pequeñas flores blancas y vegetación en tonos profundos.", precio: 1080, imagen: "../IMAGENES/p_img8.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 9, nombre: "Pericos primaverales", categoria: "Óleo sobre lienzo", descripcion: "Estos pericos están en plena primavera, con plumas vibrantes y miradas curiosas.", precio: 850, imagen: "../IMAGENES/p_img9.jpg", dimensiones: "80 x 100 cm",descuento: 0 },
    { id: 10, nombre: "Happy Purple", categoria: "Óleo sobre lienzo", descripcion: "flores violetas de pétalos amplios y centros oscuros sobre un fondo suave de tonos verdes y rosados.", precio: 1180, imagen: "../IMAGENES/p_img10.jpg", dimensiones: "100 x 80 cm", descuento: 0 },
    { id: 11, nombre: "Loto", categoria: "Óleo sobre lienzo", descripcion: "Primer plano de loto y detalles dorados sobre un fondo luminoso.", precio: 890, imagen: "../IMAGENES/p_img11.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 12, nombre: "Orquideas", categoria: "Óleo sobre lienzo", descripcion: "orquídeas blancas resaltan sobre un fondo abstracto de grises y dorados, con una composición vertical elegante.", precio: 1200, imagen: "../IMAGENES/p_img12.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 13, nombre: "Peonias", categoria: "Óleo sobre lienzo", descripcion: "peonías en plena floración, con pétalos suaves y colores vibrantes.", precio: 980, imagen: "../IMAGENES/p_img13.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 14, nombre: "El baile", categoria: "Óleo sobre lienzo", descripcion: "Cisnes blancos se encuentran sobre un estanque azul, rodeados de flores y reflejos de colores.", precio: 1320, imagen: "../IMAGENES/p_img14.jpg", dimensiones: "100 x 80 cm", descuento: 0 },
    { id: 15, nombre: "Cisnes", categoria: "Óleo sobre lienzo", descripcion: "cisnes sobre tonos calidos en estanque con lotos", precio: 1050, imagen: "../IMAGENES/p_img15.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 16, nombre: "Bodegon", categoria: "Retrato al óleo sobre lienzo", descripcion: "bodegon de frutas, uvas y telas", precio: 1650, imagen: "../IMAGENES/p_img16.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 17, nombre: "Caballo", categoria: "Óleo sobre lienzo", descripcion: "Representación devocional de Jesús con el Sagrado Corazón, manto rojo y túnica clara.", precio: 1450, imagen: "../IMAGENES/p_img17.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 18, nombre: "Retrato personalizado", categoria: "Óleo sobre lienzo", descripcion: "retrato personalizado de una persona", precio: 1580, imagen: "../IMAGENES/p_img18.jpg", dimensiones: "80 x 120 cm", descuento: 0 },
    { id: 19, nombre: "San Miguel", categoria: "Óleo sobre lienzo", descripcion: "san Miguel Arcángel protector de la humanidad.", precio: 1120, imagen: "../IMAGENES/p_img19.jpg", dimensiones: "80 x 100 cm", descuento: 0 },
    { id: 20, nombre: "Sagrado corazon", categoria: "Óleo sobre lienzo", descripcion: "Sagrado corazon de Jesus protector y piadoso.", precio: 1350, imagen: "../IMAGENES/p_img20.jpg", dimensiones: "100 x 80 cm", descuento: 0 }
];

function leerCuadrosGuardados() {
    const contenido = localStorage.getItem(CLAVE_CUADROS);
    if (contenido === null) return null;
    try {
        const datos = JSON.parse(contenido);
        return Array.isArray(datos) ? datos : null;
    } catch (error) {
        console.error("Catálogo guardado corrupto, se restaurará el inicial:", error);
        return null;
    }
}

function guardarCuadros(lista) {
    try {
        localStorage.setItem(CLAVE_CUADROS, JSON.stringify(lista));
        return true;
    } catch (error) {
        // QuotaExceededError: suele pasar si se guardan imágenes muy pesadas.
        console.error("No se pudo guardar el catálogo:", error);
        return false;
    }
}

// READ (todos)
function obtenerCuadros() {
    let lista = leerCuadrosGuardados();
    if (lista === null) {
        lista = structuredClone(CUADROS_INICIALES);
        guardarCuadros(lista);
    }
    return lista;
}

// READ (uno)
function obtenerCuadroPorId(id) {
    return obtenerCuadros().find(c => c.id === Number(id)) || null;
}

function siguienteId(lista) {
    return lista.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;
}

// Normaliza y valida. Devuelve { datos, errores }.
function validarCuadro(entrada) {
    const datos = {
        nombre: String(entrada.nombre ?? "").trim(),
        categoria: String(entrada.categoria ?? "").trim(),
        descripcion: String(entrada.descripcion ?? "").trim(),
        dimensiones: String(entrada.dimensiones ?? "").trim(),
        imagen: String(entrada.imagen ?? "").trim(),
        precio: Number(entrada.precio),
        descuento: Number(entrada.descuento || 0)
    };
    const errores = {};
    if (datos.nombre.length < 2) errores.nombre = "El nombre debe tener al menos 2 caracteres.";
    if (!datos.categoria) errores.categoria = "La categoría es obligatoria.";
    if (datos.descripcion.length < 5) errores.descripcion = "Escribe una descripción (mín. 5 caracteres).";
    // Acepta "80x100", "80 X 100 cm.", "80×100cm", "80,5 x 100 cms"... y lo deja como "80 x 100 cm".
    const medidas = datos.dimensiones.match(/^(\d+(?:[.,]\d+)?)\s*[x×*]\s*(\d+(?:[.,]\d+)?)\s*(?:cms?\.?)?$/i);
    if (medidas) {
        const num = n => n.replace(",", ".");
        datos.dimensiones = `${num(medidas[1])} x ${num(medidas[2])} cm`;
    } else {
        errores.dimensiones = "Escribe ancho x alto, por ejemplo 80 x 100 cm.";
    }
    if (!datos.imagen) errores.imagen = "Indica una ruta de imagen o sube un archivo.";
    if (!Number.isFinite(datos.precio) || datos.precio <= 0) errores.precio = "El precio debe ser mayor que 0.";
    if (!Number.isInteger(datos.descuento) || datos.descuento < 0 || datos.descuento > 90)
        errores.descuento = "El descuento debe ser un entero entre 0 y 90.";
    return { datos, errores };
}

// CREATE
function crearCuadro(entrada) {
    const { datos, errores } = validarCuadro(entrada);
    if (Object.keys(errores).length) return { ok: false, errores };
    const lista = obtenerCuadros();
    const nuevo = { id: siguienteId(lista), ...datos };
    lista.push(nuevo);
    return guardarCuadros(lista)
        ? { ok: true, cuadro: nuevo }
        : { ok: false, errores: { general: "No hay espacio en el navegador (¿imagen muy pesada?)." } };
}

// UPDATE
function actualizarCuadro(id, entrada) {
    const { datos, errores } = validarCuadro(entrada);
    if (Object.keys(errores).length) return { ok: false, errores };
    const lista = obtenerCuadros();
    const indice = lista.findIndex(c => c.id === Number(id));
    if (indice === -1) return { ok: false, errores: { general: "El cuadro ya no existe." } };
    lista[indice] = { ...lista[indice], ...datos };
    return guardarCuadros(lista)
        ? { ok: true, cuadro: lista[indice] }
        : { ok: false, errores: { general: "No hay espacio en el navegador (¿imagen muy pesada?)." } };
}

// DELETE
function eliminarCuadro(id) {
    const lista = obtenerCuadros();
    const filtrada = lista.filter(c => c.id !== Number(id));
    if (filtrada.length === lista.length) return false;
    return guardarCuadros(filtrada);
}

function restaurarCatalogoInicial() {
    return guardarCuadros(structuredClone(CUADROS_INICIALES));
}

function precioFinal(c) {
    return Math.round(c.precio * (1 - (c.descuento || 0) / 100) * 100) / 100;
}

// Escapa texto antes de meterlo en innerHTML (evita XSS ahora que el admin escribe datos).
function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
}
