// ======================================================
// REPORTES DEL ADMINISTRADOR (OTAY)
// Reemplaza TODO el bloque de gráficos que estaba al final de eventos.js
// Requiere: Chart.js cargado antes, y eventos.js (obtenerCuadros, precioFinal)
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("GraficoBarras") || typeof Chart === "undefined") return;

    // Pon false para usar solo las compras reales (antes de entregar/publicar)
    const MODO_DEMO = true;
    const TOP_PRODUCTOS = 8;

    const PALETA = [
    "#3B2A20", // café oscuro
    "#C9956B", // caramelo piel
    "#7A4A2B", // marrón medio
    "#E3C5A5", // piel clara
    "#1F1A17", // negro cálido
    "#A8693F", // canela
    "#D8B48C", // beige
    "#5E4636", // café grisáceo
    "#D99A7C", // piel rosada
    "#8C7B6B"  // taupe
];
const COLOR_OTROS = "#BFB5A8"; // gris arena

    const formatoSoles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
    const formatoEntero = new Intl.NumberFormat("es-PE");

    // ---------- 1. Datos ----------
    let historial = [];
    try {
        historial = JSON.parse(localStorage.getItem("otayArtistHistorialCompras")) || [];
    } catch (error) {
        console.error("Error al leer el historial:", error);
    }

    const catalogo = (typeof obtenerCuadros === "function") ? obtenerCuadros() : [];
    const categoriaPorNombre = new Map(catalogo.map(c => [c.nombre, c.categoria || "Sin categoría"]));

    if (MODO_DEMO && catalogo.length && typeof precioFinal === "function") {
        const ventasDemoPorMes = [
            { mes: 1, productos: [[1, 3], [2, 2], [3, 1]] },
            { mes: 2, productos: [[4, 4], [5, 2], [6, 3]] },
            { mes: 3, productos: [[7, 3], [8, 5], [9, 2]] },
            { mes: 4, productos: [[10, 4], [11, 3], [12, 2]] },
            { mes: 5, productos: [[13, 5], [14, 2], [15, 3]] },
            { mes: 6, productos: [[16, 3], [17, 4], [18, 2]] },
            { mes: 7, productos: [[1, 5], [7, 3], [19, 2]] },
            { mes: 8, productos: [[2, 4], [10, 3], [20, 2]] },
            { mes: 9, productos: [[3, 5], [13, 4], [14, 3]] },
            { mes: 10, productos: [[5, 4], [8, 3], [18, 2]] }
        ];

        ventasDemoPorMes.forEach(venta => {
            const productos = venta.productos
                .map(([id, cantidad]) => {
                    const cuadro = catalogo.find(p => Number(p.id) === id);
                    if (!cuadro) return null;
                    return { id: `cuadro-${cuadro.id}`, nombre: cuadro.nombre, precio: precioFinal(cuadro), cantidad };
                })
                .filter(Boolean);

            if (productos.length) {
                historial.push({
                    fecha: new Date(2026, venta.mes - 1, 15, 12).toISOString(),
                    productos,
                    total: productos.reduce((s, p) => s + p.precio * p.cantidad, 0)
                });
            }
        });
    }

    // ---------- 2. Agrupar ----------
    const ventasPorMes = new Map();        // clave "2026-03" -> datos del mes
    const ventasPorProducto = new Map();   // nombre -> unidades
    const ingresosPorProducto = new Map(); // nombre -> soles
    const ventasPorCategoria = new Map();  // categoría -> unidades
    let totalIngresos = 0;
    let totalPedidos = 0;

    const ahora = new Date();
    const claveMesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;

    historial.forEach(compra => {
        const fecha = new Date(compra.fecha);
        if (isNaN(fecha.getTime()) || !Array.isArray(compra.productos)) return;

        const claveMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
        if (!ventasPorMes.has(claveMes)) {
            ventasPorMes.set(claveMes, {
                fecha,
                etiqueta: fecha.toLocaleDateString("es-PE", { month: "short", year: "numeric" }).replace(".", ""),
                productos: new Map(),
                ingresos: 0
            });
        }
        const datosMes = ventasPorMes.get(claveMes);
        let contoPedido = false;

        compra.productos.forEach(p => {
            const cantidad = Number(p.cantidad) || 0;
            const precio = Number(p.precio) || 0;
            if (!p.nombre || cantidad <= 0) return;

            contoPedido = true;
            datosMes.productos.set(p.nombre, (datosMes.productos.get(p.nombre) || 0) + cantidad);
            datosMes.ingresos += precio * cantidad;

            ventasPorProducto.set(p.nombre, (ventasPorProducto.get(p.nombre) || 0) + cantidad);
            ingresosPorProducto.set(p.nombre, (ingresosPorProducto.get(p.nombre) || 0) + precio * cantidad);

            const cat = categoriaPorNombre.get(p.nombre) || "Sin categoría";
            ventasPorCategoria.set(cat, (ventasPorCategoria.get(cat) || 0) + cantidad);

            totalIngresos += precio * cantidad;
        });
        if (contoPedido) totalPedidos++;
    });

    const mesesOrdenados = [...ventasPorMes.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const ultimoEsParcial = mesesOrdenados.length > 0 &&
        mesesOrdenados[mesesOrdenados.length - 1][0] === claveMesActual;

    const etiquetasMeses = mesesOrdenados.map(([clave, d]) =>
        clave === claveMesActual ? `${d.etiqueta} (parcial)` : d.etiqueta
    );

    // Producto más vendido por mes (con manejo de empates)
    const productosMasVendidos = mesesOrdenados.map(([, d]) => {
        const lista = [...d.productos.entries()].sort((a, b) => b[1] - a[1]);
        if (!lista.length) return { nombre: "Sin ventas", cantidad: 0 };
        const max = lista[0][1];
        return { nombre: lista.filter(p => p[1] === max).map(p => p[0]).join(" / "), cantidad: max };
    });

    const productosOrdenados = [...ventasPorProducto.entries()].sort((a, b) => b[1] - a[1]);
    const ingresosMensuales = mesesOrdenados.map(([, d]) => d.ingresos);

    // Un color fijo por producto (el mismo en todos los gráficos)
    const colorPorProducto = new Map(
        productosOrdenados.map(([nombre], i) => [nombre, PALETA[i % PALETA.length]])
    );
    const colorDe = nombre => colorPorProducto.get(nombre.split(" / ")[0]) || PALETA[0];

    // ---------- 3. Referencias del DOM ----------
    const canvasLinea = document.getElementById("GraficoLineas");
    const tarjetaDe = canvas => canvas.closest("[class*='card'], [class*='tarjeta'], section") || canvas.parentElement;

    // ---------- 4. Utilidades ----------
    function crearGrafico(id, configuracion) {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const anterior = Chart.getChart(canvas);
        if (anterior) anterior.destroy();
        new Chart(canvas, configuracion);
    }

    // Tarjeta extra para el gráfico por categoría (se crea sola si no existe)
    function asegurarCanvas(id, titulo, tarjetaReferencia) {
        let canvas = document.getElementById(id);
        if (canvas) return canvas;

        const tarjeta = document.createElement("div");
        tarjeta.style.cssText =
            "background:#fff;border-radius:24px;padding:24px;margin-top:24px;border:1px solid #eee;";
        const h = document.createElement("h3");
        h.textContent = titulo;
        h.style.cssText = "margin:0 0 12px;font-size:1.1rem;";
        const caja = document.createElement("div");
        caja.style.cssText = "position:relative;height:320px;";
        canvas = document.createElement("canvas");
        canvas.id = id;
        caja.append(canvas);
        tarjeta.append(h, caja);
        tarjetaReferencia.after(tarjeta);
        return canvas;
    }
  
    const recortar = (texto, max) => texto.length > max ? texto.slice(0, max - 1) + "…" : texto;
    const textoSobre = hex => {
    const n = parseInt(hex.slice(1), 16);
    const brillo = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
    return brillo > 140 ? "#1F1A17" : "#FFFFFF";
    };


    // ---------- 5. GRÁFICO 1: Top productos (+ "Otros") ----------
    const top = productosOrdenados.slice(0, TOP_PRODUCTOS);
    const resto = productosOrdenados.slice(TOP_PRODUCTOS).reduce((s, p) => s + p[1], 0);

    const etiquetasPastel = top.map(p => p[0]);
    const datosPastel = top.map(p => p[1]);
    const coloresPastel = top.map(p => colorPorProducto.get(p[0]));
    if (resto > 0) {
        etiquetasPastel.push(`Otros (${productosOrdenados.length - TOP_PRODUCTOS})`);
        datosPastel.push(resto);
        coloresPastel.push(COLOR_OTROS);
    }

    crearGrafico("GraficoBarras", {
        type: "doughnut",
        data: {
            labels: etiquetasPastel.length ? etiquetasPastel : ["Sin ventas"],
            datasets: [{
                label: "Unidades vendidas",
                data: datosPastel.length ? datosPastel : [0],
                backgroundColor: coloresPastel.length ? coloresPastel : [COLOR_OTROS],
                borderWidth: 2,
                borderColor: "#F4EDE0"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: `Top ${TOP_PRODUCTOS} productos más vendidos` },
                legend: { position: "bottom", labels: { boxWidth: 12, padding: 10 } },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : "0.0";
                            return `${ctx.label}: ${ctx.raw} u. (${pct}%)`;
                        }
                    }
                }
            }
        }
    });

    // ---------- 6. GRÁFICO 2: Producto estrella por mes ----------
    // Plugin propio: escribe el nombre del producto dentro de cada barra
    const etiquetasEnBarras = {
        id: "etiquetasEnBarras",
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            ctx.save();
            ctx.fillStyle = "#1f2937";
            ctx.font = "600 11px sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            meta.data.forEach((barra, i) => {
                const info = productosMasVendidos[i];
                if (!info || info.cantidad === 0) return;

                const espacio = Math.abs(barra.base - barra.y) - 14;
                if (espacio < 20) return; // barra muy baja: solo se ve en el tooltip

                let texto = info.nombre;
                while (texto.length > 3 && ctx.measureText(texto).width > espacio) {
                    texto = texto.slice(0, -2) + "…";
                }

                ctx.save();
                ctx.translate(barra.x, barra.base - 8);
                ctx.rotate(-Math.PI / 2);
                ctx.fillStyle = textoSobre(colorDe(info.nombre));
                ctx.fillText(texto, 0, 0);
                ctx.restore();
            });
            ctx.restore();
        }
    };

    crearGrafico("GraficoBarras1", {
        type: "bar",
        data: {
            labels: etiquetasMeses.length ? etiquetasMeses : ["Sin ventas"],
            datasets: [{
                label: "Unidades vendidas",
                data: productosMasVendidos.length ? productosMasVendidos.map(p => p.cantidad) : [0],
                backgroundColor: productosMasVendidos.map(p => colorDe(p.nombre)),
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: "Producto más vendido por mes (unidades)" },
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const p = productosMasVendidos[ctx.dataIndex];
                            return `${p.nombre}: ${p.cantidad} unidades`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    title: { display: true, text: "Unidades" }
                },
                x: { ticks: { maxRotation: 45, autoSkip: false, font: { size: 10 } } }
            }
        },
        plugins: [etiquetasEnBarras]
    });

    // ---------- 7. GRÁFICO 3: Ingresos mensuales + promedio ----------
    const promedio = ingresosMensuales.length
        ? ingresosMensuales.reduce((a, b) => a + b, 0) / ingresosMensuales.length
        : 0;
    const ultimo = ingresosMensuales.length - 1;

    crearGrafico("GraficoLineas", {
        type: "line",
        data: {
            labels: etiquetasMeses.length ? etiquetasMeses : ["Sin ventas"],
            datasets: [
                {
                    label: "Ingresos (S/)",
                    data: ingresosMensuales.length ? ingresosMensuales : [0],
                    borderColor: "#5B3A29",
                    backgroundColor: "rgba(91,58,41,0.18)",
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    // El tramo hacia el mes en curso va punteado: aún no termina
                    segment: {
                        borderDash: c => (ultimoEsParcial && c.p1DataIndex === ultimo) ? [6, 6] : undefined
                    }
                },
                {
                    label: `Promedio (${formatoSoles.format(promedio)})`,
                    data: ingresosMensuales.map(() => promedio),
                    borderColor: "#1F1A17",
                    borderDash: [8, 6],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: "Evolución de ingresos mensuales" },
                tooltip: {
                    callbacks: { label: ctx => `${ctx.dataset.label.split(" (")[0]}: ${formatoSoles.format(ctx.raw)}` }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => formatoSoles.format(v) }
                },
                x: { ticks: { maxRotation: 0, autoSkip: false } }
            }
        }
    });

    // ---------- 8. GRÁFICO 4: Ventas por categoría ----------
    const categoriasOrdenadas = [...ventasPorCategoria.entries()].sort((a, b) => b[1] - a[1]);
    asegurarCanvas("GraficoCategorias", "Ventas por categoría", tarjetaDe(canvasLinea));

    crearGrafico("GraficoCategorias", {
        type: "bar",
        data: {
            labels: categoriasOrdenadas.length ? categoriasOrdenadas.map(c => c[0]) : ["Sin ventas"],
            datasets: [{
                label: "Unidades vendidas",
                data: categoriasOrdenadas.length ? categoriasOrdenadas.map(c => c[1]) : [0],
                backgroundColor: categoriasOrdenadas.map((_, i) => PALETA[i % PALETA.length]),
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: "y", // barras horizontales: se leen mejor con nombres largos
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: "Unidades vendidas por categoría" },
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
});