window.onload = main;

//region Main
function main() {
    get_data();
}

function get_data() {
    const preprocessed_data = data => {
        const timeFormat = "%Y-%m-%d %H:%M:%S";
        return data.map(d => ({
            Open: +d.Open, Close: +d.Close, High: +d.High, Low: +d.Low,
            Time: d3.timeParse(timeFormat)(d.Time)
        }))
    }
    d3.csv('./data/btc-usd-2020-6H.csv')
        .then(data => init_render(preprocessed_data(data)))
        .catch(err => console.log(err));
}

//endregion

const svgWidth = 1900;
const svgHeight = 900;

const config = {
    margin_from_svg: {T: 50, R: 90, B: 40, L: 90},
    P: 40,
    F: 0.8
}
config.topChart = {
    width: svgWidth,
    height: svgHeight * config.F,
    margin: {...config.margin_from_svg, B: config.P},
    origin: {x: 0, y: 0}
}
config.bottomChart = {
    width: svgWidth,
    height: svgHeight * (1 - config.F),
    margin: {...config.margin_from_svg, T: config.P},
    origin: {x: 0, y: config.topChart.height}
}


let original_data;

function init_render(data) {
    console.log("DATA LOADED", data)
    original_data = data;

    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);


    init_candlestick_chart(svg, data, config.topChart, true, 'main_chart')
    init_brushx(svg, data, config.bottomChart, update_chart)

    function update_chart(x0, x1) {
        const isClickWithoutSelection = x0 === null && x1 === null
        if (isClickWithoutSelection) { return }

        const filtered_data = original_data.filter(d => d.Time >= x0 && d.Time <= x1)
        d3.select('svg > g#main_chart').remove()
        const _ = init_candlestick_chart(svg, filtered_data, config.topChart, true, 'main_chart')

    }
}

function createGContainer(container, config) {
    return container.append('g')
        .attr('transform', `translate(${config.margin.L + config.origin.x}, ${config.margin.T + config.origin.y})`)
        .attr('width', config.width)
        .attr('height', config.height)
}

function init_candlestick_chart(container, data, config, show_y_labels, custom_id) {
    console.log("RENDER SCATTERPLOT config", config)
    const chartWidth = config.width - config.margin.L - config.margin.R;
    const chartHeight = config.height - config.margin.T - config.margin.B;

    const gContainer = createGContainer(container, config)
        .classed('scatterplot', true)
    if (custom_id) gContainer.attr('id', custom_id)

    //region TODO Codice Modificato(Esercitazione 4)
    const key_x = 'Time', key_close = 'Close', key_high = 'High', key_low = 'Low', key_open = 'Open'

    /** È importante che la scala x sia una scala invertibile, in modo che il brush possa funzionare correttamente,
     * scaleBand non è facilmente invertibile, quindi non vogliamo usarla per la scala x
     * mentre scaleTime è invertibile.
     * Detto ciò, scaleBand può essere calcolata per gestire la larghezza delle candele in maniera furba (giochiamo col padding)
     * **/
        // Uso scaleTime per calcolare la posizione X del (centro) delle candele
    const scaleX = d3.scaleTime()
            .domain(d3.extent(data, d => d[key_x]))
            .range([0, chartWidth])
            .nice()

    // Uso scaleBand per calcolare la larghezza delle candele
    const scaleBandX = d3.scaleBand()
        .domain(data.map(d => d[key_x]))
        .range([0, chartWidth])
        .padding(0.3)

    // Il presso più basso e più alto saranno sicuramente i minimi e massimi di Low e High.
    // Non c'è bisogno di cercare in tutte e 4 le variabili numeriche (Open, Close, High, Low)
    const lowest = d3.min(data, d => d[key_low]), highest = d3.max(data, d => d[key_high])
    const scaleY = d3.scaleLinear()
        .domain([lowest, highest ])
        .range([chartHeight, 0])
        .nice()

    // region Codice vecchio, crea gli assi
    // Create the axes
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX))
        .append("text")
        .attr("x", chartWidth)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text(key_x);

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
        .text(key_close)
    // endregion


    /* Create a candlestick chart
    * 1. For each record in the data, create a group element
    * 2. Create a line element for the high-low range
    * 3. Create a rect element for the open-close range
    * 3b. Set the color of the rect based on the open-close range: if the close is higher than the open, the color is green, otherwise red
     */

    const candleWidth = scaleBandX.bandwidth() ;
    const candleX = d => scaleX(d[key_x]);
    const candleHeight = d => Math.abs(scaleY(d.Close) - scaleY(d.Open));
    const candleYClose = d => scaleY(d.Close);
    const candleYOpen = d => scaleY(d.Open);
    const candleYHigh = d => scaleY(d.High);
    const candleYLow = d => scaleY(d.Low);

    // 1
    const formatDollar = d3.format('$,.2f')
    const candlestick = gContainer
        .selectAll(null)
        .data(data)
        .join('g')
        .classed('candlestick', true)
        .attr('transform', d => `translate(${candleX(d)}, ${0})`)
        .call(g=>g.append('title')
            .text(d => `Open: ${formatDollar(d.Open)}\nClose: ${formatDollar(d.Close)}\nHigh: ${formatDollar(d.High)}\nLow: ${formatDollar(d.Low)}`)
        )

    candlestick.append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', candleYHigh)
        .attr('y2', candleYLow)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

    candlestick.append('rect')
        .attr('x', -candleWidth / 2)
        .attr('y', d => Math.min(candleYOpen(d), candleYClose(d)))
        .attr('width', candleWidth)
        .attr('height', candleHeight)
        .attr('fill', d => d.Close > d.Open ? 'green' : 'red')
    //endregion

    return scaleX
}

function init_brushx(container, data, config, callback) {
    console.log("RENDER SCATTERPLOT config", config)
    const chartWidth = config.width - config.margin.L - config.margin.R;
    const chartHeight = config.height - config.margin.T - config.margin.B;
    const scaleX = init_candlestick_chart(container, data, config, false)


    const translate = {
        x: config.margin.L + config.origin.x,
        y: config.margin.T + config.origin.y
    }

    const B = {
            topLeftCorner: [translate.x, translate.y],
            bottomRightCorner: [translate.x + chartWidth, translate.y + chartHeight]
        }

    function OnBrushSelectionChange(event) {
        const extent = event.selection;
        if (!extent) {
            callback(null, null);
            return
        }

        const [f_x0, f_x1] = [extent[0] - translate.x, extent[1] - translate.x]
        const [x0, x1] = [scaleX.invert(f_x0), scaleX.invert(f_x1)]

        console.log("f_x0", f_x0, "==> x0", x0)
        console.log("f_x1", f_x1, "==> x1", x1)

        callback(x0, x1)
    }

    const brush = d3.brushX()
        .extent([B.topLeftCorner, B.bottomRightCorner])
        .on("brush", OnBrushSelectionChange)
        .on("end", OnBrushSelectionChange);

    container
        .append('g')
        .classed('brush-g', true)
        .call(brush)

}