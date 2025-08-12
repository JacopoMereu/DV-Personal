window.onload = main;

function main() {
    get_data();
}

function get_data() {
    const csv_url = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

    // JS Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
    /**
     * Esercizio:
     * 1. Caricare i dati dal file csv hostato su github all'url csv_url.
     * 2. Preprocessare i dati
     * 3. Chiamare la funzione render_data con i dati preprocessati
     */
    d3.csv(csv_url)
        .then(loadedData => {
            render_data(preprocess_data(loadedData))
        })
        .catch(error => console.error('SONO IL CATCH ECCO L\'ERRORE', error));

    /**
     * Esercizio:
     * Preprocessare i dati perché abbiamo 2 problemi:
     * 1. La data è una stringa, dobbiamo convertirla in un oggetto Date
     * 2. Il valore è una stringa, dobbiamo convertirla in un numero
     * @param loadedData
     * @return {*}
     */
    const preprocess_data = (loadedData) => {
        // doc timeParse: https://d3js.org/d3-time-format#timeParse
        const our_string_format = '%Y-%m-%d'
        const timeParser = d3.timeParse(our_string_format);
        return loadedData.map(o => ({...o, 'date': timeParser(o['date']), 'value': +o['value']}))
    }


}

const svgWidth = 650;
const svgHeight = 500;

const margin = {top: 40, right: 60, bottom: 40, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log("DATA LOADED", data)
    // YYYY-MM-DD --> %Y-%m-%d
    // DATA LOADED (1822) [{"date": "2013-04-28","value": "135.98"}, {"date": "2013-08-07", "value": "106.75"}, ...]

    // Create the svg and the g container. There is a margin between the svg and the g container
    const svg = d3.select("body").append("svg");

    const gContainer = svg
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    /**
     * Esercizio:
     * 1. Creare una scala temporale (d3.scaleTime) per mappare la data alla posizione x del chart
     */
    // scaleX will help us to map the date to the x position of the chart
    const scaleX = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, chartWidth])
            .nice()

    /**
     * Esercizio:
     * 1. Creare una scala lineare (d3.scaleLinear) per mappare il valore alla posizione y del chart
     */
    // scaleY will help us to map the value to the y position of the chart
    const scaleY = d3.scaleLinear()
            .domain(d3.extent(data, d => d.value))
            .range([chartHeight, 0])
            .nice()


    /**
     * Esercizio:
     * 1. Creare un path con d3 che rappresenti la linea del grafico
     * 2. Associare la lista dei dati come dato "unico" (cioè solo all'unico elemento path) usando il metodo .datum(data)
     * 3. Impostare il colore del path a none
     * 4. Impostare lo stroke del path a lightskyblue
     * 5. Impostare il d attributo del path con una funzione d3.area()
     *      che mappa la data alla posizione x, y0 alla posizione minima della scala y, e y1 alla posizione d.value della scala y
     *
     * Cosa succede se fill NON è impostato a none?
     * E se uso un d3.line?
     */
    // How to do an area chart instead
    gContainer
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "lightskyblue")
        .attr("d", d3.area()
            .x(d => scaleX(d.date))
            .y0(scaleY(0))
            .y1(d => scaleY(d.value))
        )


    /**
     * Creiamo gli assi x e y in una maniera "dummy" e in una maniera "d3" (questa già implementata)
     */
    // Create the axes
    // createAxisX_DummyWay(gContainer, scaleX)
    // createAxisY_DummyWay(gContainer, scaleY)
    createAxisX_D3Way(gContainer, scaleX)
    createAxisY_D3Way(gContainer, scaleY)
}

function createAxisX_DummyWay(gContainer, scaleX) {
    const arrow_y_offset = 10;
    const arrow_x_offset = 10;

    gContainer.append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', chartHeight)
        .attr('y2', chartHeight)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)

    // Arrow top side for axis X
    gContainer.append('line')
        .attr('x1', chartWidth)
        .attr('y1', chartHeight)
        .attr('x2', chartWidth - arrow_x_offset)
        .attr('y2', chartHeight - arrow_y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)

    // Arrow bottom side for axis X
    gContainer.append('line')
        .attr('x1', chartWidth)
        .attr('y1', chartHeight)
        .attr('x2', chartWidth - arrow_x_offset)
        .attr('y2', chartHeight + arrow_y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)

    // Text for axis X
    gContainer.append('text')
        .attr('x', chartWidth)
        .attr('y', chartHeight - arrow_y_offset)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'text-after-edge')
        .text('Date')

    // Create a line (tick) representing the axis X with ~5 values
    const ticksX = scaleX.ticks(5)
    gContainer.selectAll('line.x')
        .data(ticksX)
        .join('line')
        .attr('x1', d => scaleX(d))
        .attr('x2', d => scaleX(d))
        .attr('y1', chartHeight)
        .attr('y2', chartHeight + 5)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)

    // Create a text representing the value for each tick
    gContainer.selectAll('text.x')
        .data(ticksX)
        .join('text')
        .attr('x', d => scaleX(d))
        .attr('y', chartHeight + 20)
        .attr('text-anchor', 'middle')
        .text(d => d3.timeFormat('%Y')(d))
}

function createAxisY_DummyWay(gContainer, scaleY) {
    const arrow_y_offset = 10;
    const arrow_x_offset = 10;

    // Line for axis Y
    gContainer.append('line')
        .attr('x1', 0)
        .attr('y1', chartHeight)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)

    // Arrow left side for axis Y
    gContainer.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0 - arrow_x_offset)
        .attr('y2', 0 + arrow_y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)

    // Arrow bottom side for axis Y
    gContainer.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0 + arrow_x_offset)
        .attr('y2', 0 + arrow_y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)

    // Text for axis Y
    gContainer.append('text')
        .attr('x', 0 + arrow_x_offset)
        .attr('y', 0)
        .attr('text-anchor', 'start')
        .text('Value')

    // Create a line (tick) representing the axis Y with ~5 values
    const ticksY = scaleY.ticks(5)
    gContainer.selectAll('line.y')
        .data(ticksY)
        .join('line')
        .attr('x1', 0)
        .attr('x2', -5)
        .attr('y1', d => scaleY(d))
        .attr('y2', d => scaleY(d))
        .attr('stroke', 'black')
        .attr('stroke-width', 2)

    // Create a text representing the value of each tick
    gContainer.selectAll('text.y')
        .data(ticksY)
        .join('text')
        .attr('x', -10)
        .attr('y', d => scaleY(d))
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .text(d => d)
}


// d3 axes: https://d3js.org/d3-axis#axisTop
function createAxisX_D3Way(gContainer, scaleX) {
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX));
}

function createAxisY_D3Way(gContainer, scaleY) {
    gContainer.append("g")
        .call(d3.axisLeft(scaleY))
}