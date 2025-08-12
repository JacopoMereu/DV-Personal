window.onload = main;

function main() {
    const data = get_data();
    render_data(data);
}

function get_data() {
    return [
        {name: 'London', population: 8674000},
        {name: 'New York', population: 8406000},
        {name: 'Sydney', population: 4293000},
        {name: 'Paris', population: 2244000},
        {name: 'Beijing', population: 11510000}
    ];
}

function render_data(data) {
    const
        get_rect_height = (d, i) => 19,
        get_rect_x = (d, i) => 10,
        get_rect_width = (d, i) => d.population * 0.00004,
        get_rect_y = (d, i) => i * 20;

    const get_x_of_left_text = (d, i) => 0
    const get_x_of_right_text = (d, i) => get_rect_width(d, i) + get_rect_x(d, i)


    const format_string_number_fn = d3.format('.2s'); // Non sembra ma è una funzione (https://d3js.org/d3-format)

    /**
     * Esercizio:
     * 1. Creare un gruppo (g) per ogni elemento di "data" dentro g#bars
     * 2. Creare un rettangolo per ogni gruppo sfruttando le funzioni get_rect_height, get_rect_x, get_rect_width, get_rect_y
     * 3. Creare un testo per ogni gruppo sfruttando le funzioni get_x_of_left_text, get_rect_y, text-anchor=end, alignment-baseline=text-before-edge
     *      Il testo deve contenere il nome della città
     * 4. Creare un testo per ogni gruppo sfruttando le funzioni get_x_of_right_text, get_rect_y.
     *     Il testo deve contenere la popolazione della città formattata con la funzione format_string_number_fn e alignement-baseline=text-before-edge
     */

    // 1.
    // TODO Write here

    // 2.
    // TODO Write here

    // 3.
    // TODO Write here

    // 4.
    // TODO Write here

    /* TODO Spiegare cosa sia questa gerarchia
    * |_ g(1) {name: 'London', population: 8674000}
    *   |_ rect (↑) {name: 'London', population: 8674000}
    *   |_ text (↑){name: 'London', population: 8674000}
    *   |_ text (↑){name: 'London', population: 8674000}
    * |
    * |_ g(2) {name: 'New York', population: 8406000},
    *   |_ rect (↑){name: 'New York', population: 8406000},
    *   |_ text (↑){name: 'New York', population: 8406000},
    *   |_ text (↑){name: 'New York', population: 8406000},
    * |
    * |_ g(3) {name: 'Sydney', population: 4293000},
    *   |_ rect (↑) {name: 'Sydney', population: 4293000},
    *   |_ text (↑) {name: 'Sydney', population: 4293000},
    *   |_ text (↑) {name: 'Sydney', population: 4293000},
    * |
    * |_ g(4) {name: 'Paris', population: 2244000},
    *   |_ rect (↑) {name: 'Paris', population: 2244000},
    *   |_ text (↑) {name: 'Paris', population: 2244000},
    *   |_ text (↑) {name: 'Paris', population: 2244000},
    * |
    * |_ g(5) {name: 'Beijing', population: 11510000}
    *   |_ rect (↑) {name: 'Beijing', population: 11510000},
    *   |_ text (↑) {name: 'Beijing', population: 11510000},
    *   |_ text (↑) {name: 'Beijing', population: 11510000},
    * */
}
