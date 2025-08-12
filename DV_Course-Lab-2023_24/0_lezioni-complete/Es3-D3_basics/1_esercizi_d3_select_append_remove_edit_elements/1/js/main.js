window.onload = main;

const get_radius = (idx) => 10*(idx+1);
function main() {
    esercizio0();
    esercizio1();
}

/**
 * Esercizio 0:
 * A) Seleziona tutti  i cerchi (tag 'circle')
 * 2) e cambiane il colore di riempimento in arancione ('orange').
 * C) Cambia anche il raggio di tutti i cerchi in base al loro indice.
 * Fallo senza sfruttare la chainability di d3.
 */
function esercizio0() {
    // A)
    const allCircles = d3.selectAll('circle');

    // B
    allCircles.attr('fill', 'orange');

    // C
    allCircles.attr("r", function (_, idx) {
        const r = get_radius(idx);
        const d = 2*r;
        console.log("[idx]", idx, "[idx+1]",  idx+1,"r=[10*(idx+1)]",  r, "d=[r*2]", d , `[BOX]=${d}x${d}`);
        return r;
    })
}

/**
 * Esercizio 1:
 * Fai esercizio0 sfruttando la chainability di d3.
 */
function esercizio1() {
        d3.selectAll('circle')
        .attr("fill", "orange")
        .attr("r", function (_, idx) {
            const r = get_radius(idx);
            const d = r*2;
            console.log("[idx]", idx, "[idx+1]",  idx+1,"r=[10*(idx+1)]",  r, "d=[r*2]", d , `[BOX]=${d}x${d}`);
            return r;
        })
}