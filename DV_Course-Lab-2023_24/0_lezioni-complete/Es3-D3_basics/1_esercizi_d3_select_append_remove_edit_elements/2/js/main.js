window.onload = main;

function main() {
    /**
     * Esercizio 0 - Selezionare testi diversi e assegnagli il testo "D3 in Depth selection example":
     * I selettori sono:
     * A) il primo elemento con classe "intro"
     * B) tutti gli elementi con classe "intro"
     * C) tutti gli elementi con classe "intro" che sono discendenti del body
     */
    d3.select('.intro') // A
    // d3.selectAll('.intro') // B
    // d3.select('body .intro') // C
        .text('D3 in Depth selection example')

    /** Esericizio 1 - Seleziona tutti i cerchi
     * e cambia il loro raggio a 20 */
    d3.selectAll('circle')
        .attr('r', 20);


    /** Esercizio 2 - Seleziona il primo cerchio
     * e cambia il suo colore a "orange" */
    d3.select('circle')
        .style('fill', 'orange')


    /** Esercizio 3 - Seleziona la checkbox con id "myCheck"
     * e cambia il suo colore (accent-color) a "red"
     *  e spuntala (property checked a true) */
    d3.select('#myCheck')
        .style('accent-color', 'red')
        .property('checked', true);
}