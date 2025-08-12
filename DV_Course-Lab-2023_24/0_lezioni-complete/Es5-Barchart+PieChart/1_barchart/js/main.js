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
        data.sort((a, b) => d3.ascending(a[value], b[value]));


    /**
     * Esercizio.
     * 1. Creare la scala x (scaleBand). Usa un padding di 0.1
     * 2. Disegna l'asse x (axisBottom).
     */
        // scale-x
    const scaleX = d3.scaleBand()
            .domain(data.map(d => d[key]))
            .range([0, chartWidth])
            // [ https://d3js.org/d3-scale/band#band_paddingInner ]
            // .padding(0.3) // todo giocare con padding
            // .paddingInner(0.9) // todo giocare con padding
            .paddingOuter(1) // todo giocare con padding

    // axis-x
    gContainer.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(scaleX));

    /**
     * Esercizio. Creare la scala y (scaleLinear) e l'asse y (axisLeft).
     * Le linee dell'asse y devono essere tratteggiate e di colore lightgrey
     *      e devono essere lunghe quanto la larghezza del grafico (tickSize)
     * BONUS: Giocare con i tick e tickFormat (https://d3js.org/d3-axis#axis_ticks, https://d3js.org/d3-axis#axis_tickFormat)
     */
        //  scale-y
    const scaleY = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[value])])
            .range([chartHeight, 0])
            .nice();
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
    const get_x = d => scaleX(d[key])
    const get_y = d => scaleY(d[value])
    const get_width = d => scaleX.bandwidth()
    const get_height = d => chartHeight - scaleY(d[value])

    /** Esercizio: Definire le funzioni on mouseover e mouseout:
     * Quando il mouse va sul rettangolo, cambiagli il colore in orange
     * Quando il mouse ESCE dal rettangolo, cambiagli il colore in steelblue */
    const on_mouseover = (evt, d) => { // https://github.com/d3/d3-selection/issues/263
        d3.select(evt.currentTarget)
            .attr('fill', 'orange');
    }
    const on_mouseout = function (evt, d) {
        d3.select(this)
            .attr('fill', 'steelblue');
    }

    // bars
    /** Esercizio: aggiungere un elemento di tipo "title" e dargli la popolazione come testo */
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
        .append('title')
        .text(d => d3.format(".2s")(d[value]));
}