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

const svgWidth = 650;
const svgHeight = 650;

const margin = {top: 40, right: 40, bottom: 40, left: 80}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// Exercise from Lez2/2_data_binding/3
function render_data(data) {
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const key = 'name', value = 'population', sort = true
    render_bar_chart(svg, data, key, value, sort);
}

function render_bar_chart(svg, data, key, value, sort) {
    // The usual pattern for creating a group element and translating it to the margin
    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    /**
     * Esercizio. Se sort è true, ordina i dati in base al valore di value (d3.ascending)
     */
    if (sort)
        // data //TODO Write here


    /**
     * Esercizio.
     * 1. Creare la scala x (scaleBand). Usa un padding di 0.1
     * 2. Disegna l'asse x (axisBottom).
     */
    // scale-x
    //const scaleX = //TODO Write here

    // axis-x
    // gContainer. //TODO Write here

    /**
     * Esercizio. Creare la scala y (scaleLinear) e l'asse y (axisLeft).
     * Le linee dell'asse y devono essere tratteggiate e di colore lightgrey
     *      e devono essere lunghe quanto la larghezza del grafico (tickSize)
     * BONUS: Giocare con i tick e tickFormat (https://d3js.org/d3-axis#axis_ticks, https://d3js.org/d3-axis#axis_tickFormat)
     */
    //  scale-y
    // const scaleY = //TODO Write here

    // axis-y
    gContainer.append('g')
        .call(d3.axisLeft(scaleY)
            .ticks(null, ".2s")
            // .tickFormat(d3.format(".2s"))
            // .tickFormat(d=> d/1000000 + 'M')
            .tickSize(-chartWidth)
        )
        .call(g => g.selectAll('line')
            .attr('stroke', 'lightgrey')
            .attr('stroke-dasharray', '10, 2')
        );


    /** Esercizio: Definire le funzioni get_x, get_y, get_width, get_height
     * sfruttando scaleX e scaleY */
    const get_x = (d, i) => 0 //TODO Write here
    const get_y = (d, i) => 0 //TODO Write here
    const get_width = (d, i) => 0 //TODO Write here
    const get_height = (d, i) => 0 //TODO Write here

    /** Esercizio: Definire le funzioni on mouseover e mouseout:
     * Quando il mouse va sul rettangolo, cambiagli il colore in orange
     * Quando il mouse ESCE dal rettangolo, cambiagli il colore in steelblue */
    const on_mouseover = function(evt, d) {
        //TODO Write here
    }
    const on_mouseout = function (evt, d) {
        //TODO Write here
    }

    // bars
    /** Esercizio: aggiungere un elemento di tipo "title" e dargli la popolazione come testo */
    const format_population_fn = d3.format(".2s");
    gContainer.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', get_x)
        .attr('y', get_y)
        .attr('width', get_width)
        .attr('height', get_height)
        .attr('fill', 'steelblue')
        .on('mouseover', on_mouseover)
        .on('mouseout', on_mouseout)
        //TODO Write here
}