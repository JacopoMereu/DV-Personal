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
    // TODO Write here

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

        return loadedData.map(o => ({...o,
            // 'date':  // TODO Write here
            // 'value': // TODO Write here
        }))
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
     * 1. Creare una scala temporale (d3.scaleTime) per mappare la data nella posizione x del chart. Nice the scale
     */
    // scaleX will help us to map the date to the x position of the chart
    const scaleX; // TODO Write here

    /**
     * Esercizio:
     * 1. Creare una scala lineare (d3.scaleLinear) per mappare il valore alla posizione y del chart
     */
    // scaleY will help us to map the value to the y position of the chart
    const scaleY; // TODO Write here


    /**
     * Esercizio:
     * 1. Appendere un path con d3 che rappresenterà la linea del grafico
     * 2. Associare la lista dei dati come dato "unico" (cioè solo all'unico elemento path) usando il metodo .datum(data)
     * 3. Impostare il colore (fill) del path a none
     * 4. Impostare lo stroke del path a lightskyblue
     * 5. Impostare il "d" del path con una funzione d3.area()
     *      che mappa la data alla posizione x, y0 alla posizione minima della scala y, e y1 alla posizione d.value della scala y
     *
     * Cosa succede se fill NON è impostato a none?
     * E se uso un d3.line?
     */
    // How to do an area chart instead
    gContainer;
        // TODO Write here // 1
        // TODO Write here // 2
        // TODO Write here // 3
        // TODO Write here // 4
        // TODO Write here // 5


    /**
     * Creiamo gli assi x e y in una maniera "dummy" e in una maniera "d3" (questa già implementata)
     */
    // Create the axes
    createAxisX_D3Way(gContainer, scaleX)
    createAxisY_D3Way(gContainer, scaleY)
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