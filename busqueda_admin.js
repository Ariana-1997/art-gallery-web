// busqueda_admin.js — Búsqueda avanzada de cuadros en el panel de administración.
// Depende de catalogo.js (obtenerCuadros, precioFinal, escaparHTML).

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-busqueda");
    const cuerpo = document.getElementById("resultados-busqueda");
    const chips = document.getElementById("filtros-activos");
    const selectCategoria = document.getElementById("b-categoria");
    const vacio = document.getElementById("sin-resultados-admin");

    const cuadros = obtenerCuadros();

    // ---------- Utilidades ----------
    function normalizar(texto) {
        // minúsculas y sin tildes: "Bodegón" encuentra "bodegon"
        return String(texto ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function medidas(cuadro) {
        const m = String(cuadro.dimensiones).match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i);
        return m ? { ancho: Number(m[1]), alto: Number(m[2]) } : { ancho: 0, alto: 0 };
    }

    function formato(cuadro) {
        const { ancho, alto } = medidas(cuadro);
        if (!ancho || !alto) return "—";
        if (ancho === alto) return "Cuadrado";
        return alto > ancho ? "Vertical" : "Horizontal";
    }

    function numero(valor) {
        return valor === "" || valor === null ? null : Number(valor);
    }

    const soles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

    // Resalta las palabras buscadas. Se trabaja sobre el texto original y se
    // escapa cada trozo, así una búsqueda nunca puede romper el HTML.
    function resaltar(texto, palabras) {
        const patrones = palabras.filter(Boolean).map(p => p
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/a/g, "[aáà]").replace(/e/g, "[eéè]").replace(/i/g, "[iíì]")
            .replace(/o/g, "[oóò]").replace(/u/g, "[uúùü]").replace(/n/g, "[nñ]"));
        if (!patrones.length) return escaparHTML(texto);
        return String(texto ?? "")
            .split(new RegExp(`(${patrones.join("|")})`, "gi"))
            .map((trozo, i) => i % 2 ? `<mark>${escaparHTML(trozo)}</mark>` : escaparHTML(trozo))
            .join("");
    }

    // ---------- Categorías disponibles ----------
    [...new Set(cuadros.map(c => c.categoria))]
        .sort((a, b) => a.localeCompare(b, "es"))
        .forEach(cat => selectCategoria.append(new Option(cat, cat)));

    // ---------- Leer criterios del formulario ----------
    function leerCriterios() {
        const f = form.elements;
        return {
            texto: f.texto.value.trim(),
            enNombre: f.enNombre.checked,
            enDescripcion: f.enDescripcion.checked,
            enCategoria: f.enCategoria.checked,
            categoria: f.categoria.value,
            precioMin: numero(f.precioMin.value),
            precioMax: numero(f.precioMax.value),
            oferta: f.oferta.value,
            descuentoMin: numero(f.descuentoMin.value),
            formato: f.formato.value,
            anchoMin: numero(f.anchoMin.value),
            altoMin: numero(f.altoMin.value),
            orden: f.orden.value
        };
    }

    // ---------- Filtrar ----------
    function cumple(cuadro, c, palabras) {
        if (palabras.length) {
            const campos = [];
            if (c.enNombre) campos.push(cuadro.nombre);
            if (c.enDescripcion) campos.push(cuadro.descripcion);
            if (c.enCategoria) campos.push(cuadro.categoria);
            const texto = normalizar(campos.join(" "));
            // Todas las palabras deben aparecer (búsqueda "Y"), en cualquier orden
            if (!palabras.every(p => texto.includes(p))) return false;
        }
        if (c.categoria && cuadro.categoria !== c.categoria) return false;

        const precio = precioFinal(cuadro);
        if (c.precioMin !== null && precio < c.precioMin) return false;
        if (c.precioMax !== null && precio > c.precioMax) return false;

        const descuento = Number(cuadro.descuento) || 0;
        if (c.oferta === "con" && descuento === 0) return false;
        if (c.oferta === "sin" && descuento > 0) return false;
        if (c.descuentoMin !== null && descuento < c.descuentoMin) return false;

        if (c.formato && formato(cuadro) !== c.formato) return false;
        const { ancho, alto } = medidas(cuadro);
        if (c.anchoMin !== null && ancho < c.anchoMin) return false;
        if (c.altoMin !== null && alto < c.altoMin) return false;
        return true;
    }

    const ordenes = {
        relevancia: (a, b) => a.id - b.id,
        "precio-asc": (a, b) => precioFinal(a) - precioFinal(b),
        "precio-desc": (a, b) => precioFinal(b) - precioFinal(a),
        "nombre-asc": (a, b) => a.nombre.localeCompare(b.nombre, "es"),
        "nombre-desc": (a, b) => b.nombre.localeCompare(a.nombre, "es"),
        descuento: (a, b) => (b.descuento || 0) - (a.descuento || 0) || a.id - b.id,
        "id-desc": (a, b) => b.id - a.id
    };

    let resultadosActuales = [];

    function buscar() {
        const c = leerCriterios();
        const palabras = normalizar(c.texto).split(/\s+/).filter(Boolean);
        resultadosActuales = cuadros
            .filter(cuadro => cumple(cuadro, c, palabras))
            .sort(ordenes[c.orden] || ordenes.relevancia);

        pintarResumen(resultadosActuales);
        pintarTabla(resultadosActuales, palabras);
        pintarChips(c);
    }

    // ---------- Resumen ----------
    function pintarResumen(lista) {
        const precios = lista.map(precioFinal);
        const enOferta = lista.filter(c => (c.descuento || 0) > 0).length;
        const promedio = precios.length ? precios.reduce((a, b) => a + b, 0) / precios.length : 0;
        document.getElementById("r-total").textContent = `${lista.length} de ${cuadros.length}`;
        document.getElementById("r-promedio").textContent = precios.length ? soles.format(promedio) : "—";
        document.getElementById("r-rango").textContent = precios.length
            ? `${soles.format(Math.min(...precios))} – ${soles.format(Math.max(...precios))}` : "—";
        document.getElementById("r-ofertas").textContent = String(enOferta);
    }

    // ---------- Tabla ----------
    function pintarTabla(lista, palabras) {
        vacio.classList.toggle("d-none", lista.length > 0);
        cuerpo.innerHTML = lista.map(c => {
            const desc = Number(c.descuento) || 0;
            return `
            <tr>
                <td class="text-muted">${c.id}</td>
                <td><img src="${escaparHTML(c.imagen)}" alt="" class="busqueda-miniatura"></td>
                <td>
                    <div class="fw-semibold">${resaltar(c.nombre, palabras)}</div>
                    <div class="busqueda-descripcion">${resaltar(c.descripcion, palabras)}</div>
                </td>
                <td>${resaltar(c.categoria, palabras)}</td>
                <td class="text-nowrap">${escaparHTML(c.dimensiones)}<br><small class="text-muted">${formato(c)}</small></td>
                <td class="text-nowrap text-end">
                    ${desc ? `<s class="text-muted small">${soles.format(c.precio)}</s><br>` : ""}
                    <span class="fw-semibold">${soles.format(precioFinal(c))}</span>
                </td>
                <td class="text-center">${desc ? `<span class="badge bg-danger">-${desc}%</span>` : `<span class="text-muted">—</span>`}</td>
                <td><a class="btn btn-sm btn-outline-dark" href="crud_admin.html?editar=${c.id}">Editar</a></td>
            </tr>`;
        }).join("");
    }

    // ---------- Filtros activos (se pueden quitar uno por uno) ----------
    const etiquetas = {
        texto: c => c.texto && `Texto: "${c.texto}"`,
        categoria: c => c.categoria && `Categoría: ${c.categoria}`,
        precioMin: c => c.precioMin !== null && `Desde ${soles.format(c.precioMin)}`,
        precioMax: c => c.precioMax !== null && `Hasta ${soles.format(c.precioMax)}`,
        oferta: c => c.oferta && (c.oferta === "con" ? "Con descuento" : "Sin descuento"),
        descuentoMin: c => c.descuentoMin !== null && `Descuento ≥ ${c.descuentoMin}%`,
        formato: c => c.formato && `Formato: ${c.formato}`,
        anchoMin: c => c.anchoMin !== null && `Ancho ≥ ${c.anchoMin} cm`,
        altoMin: c => c.altoMin !== null && `Alto ≥ ${c.altoMin} cm`
    };

    function pintarChips(c) {
        chips.replaceChildren();
        Object.entries(etiquetas).forEach(([campo, texto]) => {
            const etiqueta = texto(c);
            if (!etiqueta) return;
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "filtro-chip";
            chip.dataset.campo = campo;
            chip.setAttribute("aria-label", `Quitar filtro ${etiqueta}`);
            chip.textContent = `${etiqueta}  ×`;
            chips.append(chip);
        });
    }

    chips.addEventListener("click", event => {
        const chip = event.target.closest(".filtro-chip");
        if (!chip) return;
        form.elements[chip.dataset.campo].value = "";
        buscar();
    });

    // ---------- Exportar resultados a CSV (se abre en Excel) ----------
    document.getElementById("btn-exportar").addEventListener("click", () => {
        const columnas = ["ID", "Nombre", "Categoría", "Descripción", "Dimensiones", "Formato",
            "Precio", "Descuento (%)", "Precio final"];
        const celda = valor => `"${String(valor).replace(/"/g, '""')}"`;
        const filas = resultadosActuales.map(c => [c.id, c.nombre, c.categoria, c.descripcion, c.dimensiones,
            formato(c), c.precio, c.descuento || 0, precioFinal(c)].map(celda).join(";"));
        const csv = "﻿" + [columnas.map(celda).join(";"), ...filas].join("\r\n");
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        enlace.download = `cuadros_${new Date().toISOString().slice(0, 10)}.csv`;
        enlace.click();
        URL.revokeObjectURL(enlace.href);
    });

    // ---------- Eventos ----------
    // "input" ya se dispara en textos, números, selects y checkboxes. No se escucha
    // "change" porque al perder el foco volvería a pintar las etiquetas en medio de un clic.
    form.addEventListener("input", buscar);
    form.addEventListener("submit", event => event.preventDefault());
    form.addEventListener("reset", () => window.setTimeout(buscar));

    buscar();
});
