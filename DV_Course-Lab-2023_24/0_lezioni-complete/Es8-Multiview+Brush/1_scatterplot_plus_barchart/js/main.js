window.onload = main;

//region Main
function main() {
    get_data();
}

function get_data() {
    const preprocessed_data = data => data.map(d => ({...d, time: +d.time, distance: +d.distance}))
    return d3.csv('./data/data.csv')
        .then(data => init_render(preprocessed_data(data)))
        .catch(err => console.log(err));
}
//endregion

const svgWidth = 1900;
const svgHeight = 900;

//TODO Esercizio 1) Generare la configurazione in modo dinamico
// Nota: Come vengono nominate le variabili qui è importante per il corretto funzionamento del codice.
const config = {
    margin_from_svg: {T: 50, R: 40, B: 40, L: 40},
    P: 50,
    F : 0.6
}
config.leftChart = {
    width: svgWidth * config.F,
    height: svgHeight,
    margin: {...config.margin_from_svg, R: config.P},
    origin: {x: 0, y: 0}
}
config.rightChart = {
    width: svgWidth * (1 - config.F),
    height: svgHeight,
    margin: {...config.margin_from_svg, L: config.P},
    origin: {x: config.leftChart.width, y: 0}
}


let difficultyFilter = ['Easy', 'Intermediate', 'Difficult'];
let original_data;

function init_render(data) {
    console.log("DATA LOADED", data)
    original_data = data;

    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const scaleColorDifficulty = d3.scaleOrdinal()
        .domain(difficultyFilter)
        .range(["#29CD29", "#CDCD29", "#FF2929"])

    init_scatterplot(svg, data, config.leftChart, scaleColorDifficulty, 'distance', 'time')
    init_histogram(svg, data, config.rightChart, scaleColorDifficulty, 'difficulty', true)

    //TODO Esercizio 4) Assegna la classe 'clicked' ai rettangoli che corrispondono ai livelli di difficoltà in difficultyFilter
    d3.selectAll('.rects rect')
        .classed('clicked', d => difficultyFilter.includes(d[0]))


    /**TODO Esercizio 5) Implementare il filtro per livello di difficoltà
     * Cosa succede quando clicco su una barra?
     * 1. Si aggiorna il filtro.
     * 2. Si aggiorna il render del grafico a dispersione passando i dati filtrati.
     */

    // TODO 5.2
    function update_render(data) {
        d3.select('svg > g.scatterplot').remove()
        init_scatterplot(svg, data, config.leftChart, scaleColorDifficulty, 'distance', 'time')
    }

    // TODO 5.1
    const on_click = function (evt, d) {
        const isBarFiltered = difficultyFilter.includes(d[0]);
        if (isBarFiltered) {
            // remove key from array
            difficultyFilter = difficultyFilter.filter(x => x !== d[0])
        } else {
            // push key in array
            difficultyFilter.push(d[0])
        }
        // add/remove the class 'clicked' from the currect bar (rect)
        d3.select(this).classed('clicked', difficultyFilter.includes(d[0]))

        // update the scatterplot
        const filtered_data = original_data.filter(d => difficultyFilter.includes(d.difficulty))
        update_render(filtered_data)
    }

    // attacca la funzione on_click a tutti i rettangoli per gestire il click
    d3.selectAll('.rects rect')
        .on('click', on_click)

}

function createGContainer(container, config) {
    //TODO Esercizio 2) Creare il g container usando la configurazione in input
    return container.append('g')
        .attr('transform', `translate(${config.margin.L + config.origin.x}, ${config.margin.T + config.origin.y})`)
        // .attr('width', config.width)
        // .attr('height', config.height)
}

function init_scatterplot(container, data, config, scaleColorDifficulty, key1, key2) {
    console.log("RENDER SCATTERPLOT config", config)
    const chartWidth = config.width - config.margin.L - config.margin.R;
    const chartHeight = config.height - config.margin.T - config.margin.B;

    const gContainer = createGContainer(container, config)
        .classed('scatterplot', true)


    //region Codice vecchio (Esercitazione 4)
    const scaleX = d3.scaleLinear()
        // .domain([0, d3.max(original_data, d => d[key1])])
        .domain([0, d3.max(data, d => d[key1])])
        .range([0, chartWidth])
        .nice()

    const scaleY = d3.scaleLinear()
        // .domain([0, d3.max(original_data, d => d[key2])])
        .domain([0, d3.max(data, d => d[key2])])
        .range([chartHeight, 0])
        .nice()

    // Create the axes
    gContainer.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(
            d3.axisBottom(scaleX)
                .ticks(5)
                .tickFormat(d => d + ' km')
                .tickPadding(5)
        )
        .append("text")
        .attr("x", chartWidth)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text(key1);


    gContainer.append("g")
        .classed('y-axis', true)
        .call(
            d3.axisLeft(scaleY)
                .tickSizeInner(-chartWidth)
                .tickPadding(10)
        )
        .append("text")
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')
        .text(key2)

    // Do a scatterplot
    const useSymbols = !true;
    if (!useSymbols) {
        gContainer
            .append("g")
            .selectAll(null)
            .data(data)
            .join("circle")
            .attr("cx", d => scaleX(d[key1]))
            .attr("cy", d => scaleY(d[key2]))
            .attr("r", 5)
            .attr("fill", d => scaleColorDifficulty(d.difficulty))
            .attr('stroke', 'black')
    }
    else {
        // https://d3js.org/d3-shape/symbol
        const scaleSymbols = d3.scaleOrdinal()
            .domain(["Easy", "Intermediate", "Difficult"])
            .range([
                d3.symbol().type(d3.symbolCircle),
                d3.symbol().type(d3.symbolSquare),
                d3.symbol().type(d3.symbolDiamond)
            ])

        gContainer.append('g').classed('circles', true)
            .selectAll(null)
            .data(data)
            .join('path')
            .attr('class', 'symbol')
            .attr('transform', d => `translate(${scaleX(d[key1])}, ${scaleY(d[key2])})`)
            .attr('d', d => scaleSymbols(d.difficulty)())
            .attr("fill", d => scaleColorDifficulty(d.difficulty))
    }
    //endregion

}


function init_histogram(container, data, config, scaleColorDifficulty, key, sort_bars) {
    console.log("RENDER BARCHART config", config)
    const chartWidth = config.width - config.margin.L - config.margin.R;
    const chartHeight = config.height - config.margin.T - config.margin.B;

    const gContainer = createGContainer(container, config)
        .classed('barchart', true)

    //TODO Esercizio 3)  Contare il numero di trail per ogni livello di difficoltà
    const aggregatedDataMap = d3.rollups(data, g => g.length, d => d[key]);


    // region Codice vecchio (Esercitazione 5)
    if (sort_bars)
        aggregatedDataMap.sort((a, b) => d3.ascending(a[1], b[1]));

    // scale-x
    const scaleX = d3.scaleBand()
        .domain(aggregatedDataMap.map(d => d[0]))
        .range([0, chartWidth])
        .padding(0.1);
    // axis-x
    gContainer.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(scaleX));

    //  scale-y
    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(aggregatedDataMap, d => d[1])])
        .range([chartHeight, 0])
        .nice();
    // axis-y
    gContainer.append('g')
        .call(d3.axisLeft(scaleY)
            .ticks(null, ".2s")
            .tickSize(-chartWidth)
        )
        .append("text")
        .text("Trails")
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')


    const get_x = d => scaleX(d[0])
    const get_y = d => scaleY(d[1])
    const get_width = d => scaleX.bandwidth()
    const get_height = d => chartHeight - scaleY(d[1])

    // bars
    gContainer.append('g').classed("rects", true).selectAll('rect')
        .data(aggregatedDataMap)
        .join('rect')
        .attr('x', get_x)
        .attr('y', get_y)
        .attr('width', get_width)
        .attr('height', get_height)
        .attr('fill', d => scaleColorDifficulty(d[0]))
        .append('title')
        .text(d => d3.format(".2s")(d[1]))
    //endregion
}