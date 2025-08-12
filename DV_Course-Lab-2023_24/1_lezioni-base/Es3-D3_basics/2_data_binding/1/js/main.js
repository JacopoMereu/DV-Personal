window.onload = main;

function main() {
    const data = get_data();
    render_data(data);
}

function get_data() {
    return [40, 10, 20, 60, 30];
}

function render_data(data) {
    console.log("DATA", data)
    const get_cx = (_, i) => i * 100;
    const get_radius = d => .5*d;

    /**
     * Esercizio:
     * 1. Selezionare l'elemento con id "container"
     * 2. Creare un nuovo cerchio per ogni punto del dataset (hint: .selectAll, .data and .join vanno sempre insieme)
     * 3. Impostare la posizione x del centro (cx) in base all'indice del cerchio
     * 4. Impostare il raggio (r) in base al valore del dato corrispondente
     */
    // TODO Write your code here
}