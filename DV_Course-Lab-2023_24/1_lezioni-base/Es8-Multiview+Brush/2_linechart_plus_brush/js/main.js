window.onload = main;

//region Main
function main() {
    get_data();
}

function get_data() {
    const preprocessed_data = data => {
        const timeFormat = "%Y-%m-%d";
        // const timeFormat = "%Y-%m-%d %H:%M:%S";
        return data.map(d => ({Close: +d.Close, Time: d3.timeParse(timeFormat)(d.Time)}))
    }
    d3.csv('./data/dummy.csv')
        // d3.csv('./data/btc-usd-2020-6H.csv')
        .then(data => init_render(preprocessed_data(data)))
        .catch(err => console.log(err));
}

//endregion

const svgWidth = 1900;
const svgHeight = 900;

//TODO Esercizio 1) Generare la configurazione in modo dinamico.
// Nota: Come vengono nominate le variabili qui è importante per il corretto funzionamento del codice.
//

let original_data;

function init_render(data) {
    console.log("DATA LOADED", data)
    original_data = data;

    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);


    init_linechart(svg, data, config.topChart, true, 'main_chart')
    init_brushx(svg, data, config.bottomChart, update_chart)

    function update_chart(x0, x1) {
        // TODO Esercizio 3) Filtra i dati in base alla selezione del brush
        // x0 e x1 saranno le date di inizio e fine della selezione
        //

    }
}

function createGContainer(container, config) {
    return container.append('g')
        .attr('transform', `translate(${config.margin.L + config.origin.x}, ${config.margin.T + config.origin.y})`)
        .attr('width', config.width)
        .attr('height', config.height)
}

function init_linechart(container, data, config, show_y_labels, custom_id) {
    const key1 = 'Time', key2 = 'Close';
    console.log("RENDER SCATTERPLOT config", config)
    const chartWidth = config.width - config.margin.L - config.margin.R;
    const chartHeight = config.height - config.margin.T - config.margin.B;

    const gContainer = createGContainer(container, config)
        .classed('scatterplot', true)
    if (custom_id) gContainer.attr('id', custom_id)

    //region Codice vecchio (Esercitazione 4)
    const scaleX = d3.scaleTime()
        .domain(d3.extent(data, d => d[key1]))
        .range([0, chartWidth])
        .nice()

    const scaleY = d3.scaleLinear()
        // .domain([0, d3.max(original_data, d => d[key2])])
        .domain(d3.extent(data, d => d[key2]))
        .range([chartHeight, 0])
        .nice()

    // Create the axes
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX))
        .append("text")
        .attr("x", chartWidth)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text(key1);

    // y-axis
    gContainer.append("g")
        .classed('y-axis', true)
        .call(
            d3.axisLeft(scaleY)
                .tickSizeInner(-chartWidth)
                .tickPadding(10)
                .ticks(show_y_labels ? null : 0)
        )
        .append("text")
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')
        .text(key2)

    gContainer.append('path')
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => scaleX(d[key1]))
            .y(d => scaleY(d[key2]))
        )
    //endregion

    return scaleX
}

function init_brushx(container, data, config, callback) {
    console.log("RENDER SCATTERPLOT config", config)
    const chartWidth = config.width - config.margin.L - config.margin.R;
    const chartHeight = config.height - config.margin.T - config.margin.B;
    const scaleX = init_linechart(container, data, config, false)


    const translate = {
        x: config.margin.L + config.origin.x,
        y: config.margin.T + config.origin.y
    }

    /** TODO Esercizio 2) Genera il brush
     *  2.1 Creare le coordinate per l'extent del brush
     *  2.2 Genera il brush
     *  2.3 Imposta l'extent del brush
     *  2.4 Implementa la funzione di callback per il brush
     *  2.5 Associare la funzione di callback agli eventi "brush" e "end"
     *  2.6 Aggiungi il brush al container
     * */

    // TODO 2.1
    //

    function  OnBrushSelectionChange(event) {
        //TODO 2.4
        //
    }

    // TODO 2.2
    //const brush = //
        // TODO 2.3
        //
        // TODO 2.5
        //
        //

    // TODO 2.6
    //
}