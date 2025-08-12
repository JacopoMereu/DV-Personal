window.onload = main;

function main() {
    /**
     * Esercizio 0 - Seleziona tutti i cerchi
     * A) ed applica un evento mouseover che cambia il colore del cerchio in rosso
     * B) ed applica un evento mouseout che cambia il colore del cerchio in nero
     * C) ed applica un evento click che aggiunge la classe "selected" al cerchio
     * D) ed applica un evento contextmenu che rimuove la classe "selected" al cerchio
     */
    d3.selectAll("circle")
        // A
        .on("mouseover", function (event, d) {
            const sel = d3.select(this);
            sel.attr("fill", "red");
        })
        // B
        .on("mouseout", function () {
            d3.select(this)
                .attr("fill", "black");
        })
        // C
        .on("click", function () {
            d3.select(this)
                .classed("selected", true);
        })
        // D
        .on("contextmenu", function () {
            d3.select(this)
                .classed("selected", false);
        });

    /**
     * Esercizio 1 - Seleziona l'svg
     * A) ed applica un evento contextmenu che previene il menu contestuale di default (event.preventDefault())
     */
    d3.select('svg')
        .on('contextmenu', function (event) {
            event.preventDefault();
        })

}