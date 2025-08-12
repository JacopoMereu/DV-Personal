window.onload = main;

function main() {
    render_data();
}

function render_data() {
    const container = d3.select("g#container");

    /** Esercizio
     * A) Seleziona tutti i cerchi nel gruppo container,
     * B) e salva il riferimento all'ultimo cerchio in una variabile.
     * C) Aggiungi un nuovo cerchio al contenitore,
     * D) impostandogli il cx a 50 pixels a destra rispetto all'ultimo cerchio esistente,
     * E) e lo stesso cy del cerchio esistente.
     * F) Imposta il raggio del nuovo cerchio a 10 pixels
     * G) e il colore di riempimento a rosso.
     */
        // A, B
    const metodo = 1;
    let last_circle;


    const circles = container.selectAll('circle')
    const last_idx = circles.size() - 1;
    if (metodo === 1) {
        // In the first method, we use the nth-child CSS selector.

        // nth-child starts from 1, not 0, thus we need to add 1
        // we could have used last-child, but we want to show how to use nth-child
        last_circle = container.select(`circle:nth-child(${last_idx + 1})`);
    } else if (metodo === 2) {
        // In the second method, we use the nodes() method to get the array of nodes
        last_circle = d3.select(
            circles.nodes()[circles.size() - 1]
        );
    } else if (metodo === 3) {
        // In the third method, we use the attr() method to set the class attribute,
        // and then we select the circle using the class attribute.
        // This is the MOST RECOMMENDED method. It's used also when we have to select corresponding elements in different charts.
        circles.attr('class', (_, i) => `circle-${i}`);

        last_circle = container.select(`.circle-${last_idx}`);
    }


    console.log(last_circle.node());
    container
        // C
        .append('circle')
        // D-E
        .attr('cx', +last_circle.attr('cx') + 50)
        .attr('cy', +last_circle.attr('cy'))
        // F-G
        .attr('r', 10)
        .attr('fill', 'red');


}
