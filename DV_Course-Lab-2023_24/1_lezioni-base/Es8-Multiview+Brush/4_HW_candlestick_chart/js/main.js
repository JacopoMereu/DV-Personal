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

    const scaleX = d3.scaleTime()
        .domain(d3.extent(data, d => d[key_x]))
        .range([0, chartWidth])
        .nice()

    const scaleY = d3.scaleLinear()
        // .domain([0, d3.max(original_data, d => d[key2])])
        .domain(d3.extent(data, d => d[key_close]))
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

    gContainer.append('path')
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => scaleX(d[key_x]))
            .y(d => scaleY(d[key_close]))
        )
    // endregion



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