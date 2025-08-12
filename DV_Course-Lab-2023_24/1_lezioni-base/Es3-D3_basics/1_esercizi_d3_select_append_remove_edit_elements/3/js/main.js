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
        .on("mouseover", function (d, idx) {
            const sel = d3.select(this);
            sel.attr("fill", "red");
        })
        // B
        .on("mouseout", function () {
            // TODO Write your code here
        })
        // C
        // TODO Write your code here

        // D
        // TODO Write your code here


    /**
     * Esercizio 1 - Seleziona l'svg
     * A) ed applica un evento contextmenu che prevenga il menu contestuale di default (event.preventDefault())
     */
    // TODO Write your code here
}