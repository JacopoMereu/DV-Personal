window.onload = main;

function main() {
    get_data();
}

function get_data() {
    const csv_url = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

    d3.csv(csv_url)
        .then(loadedData => {
            render_data(preprocess_data(loadedData))
        })
        .catch(error => console.error('SONO IL CATCH ECCO L\'ERRORE', error));

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

    // scaleX will help us to map the date to the x position of the chart
    const scaleX = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, chartWidth])
        .nice()

    // scaleY will help us to map the value to the y position of the chart
    const scaleY = d3.scaleLinear()
        .domain(d3.extent(data, d => d.value))
        .range([chartHeight, 0])
        .nice()

    // draw the line chart
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

    // Create the axes
    createAxisX_D3Way(gContainer, scaleX)
    createAxisY_D3Way(gContainer, scaleY)

    // TODO Guardami
    ESERCIZIO_PER_CASA(svg, gContainer, scaleX, scaleY, data)


}

function createAxisX_D3Way(gContainer, scaleX) {
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX));
}

function createAxisY_D3Way(gContainer, scaleY) {
    gContainer.append("g")
        .call(d3.axisLeft(scaleY))
}


function ESERCIZIO_PER_CASA(svg, gContainer, scaleX, scaleY, data) {
    /**
     * Esercizio: creare un tooltip che si attiva quando il mouse si muove sopra il grafico (mousemove).
     * 1. Appendere un gruppo all'svg che contiene un rettangolo e due testi (uno per la data e uno per il valore)
     *      - il rettangolo deve essere bianco con bordo nero
     *      - i testi devono essere neri, font-size 10px, dominant-baseline a middle. Font-weight bold per la data
     * P.S. il tooltip deve essere inizialmente invisibile
     *
     * 2. Disegnare due linee tratteggiate (stroke-dasharray)
     *      - una orizzontale (Y=0) e una verticale (X=0)
     *
     * 3. Quando il mouse si muove (mousemove) sul grafico (svg):
     *      - catturare la posizione del mouse (d3.pointer)
     *      - sfruttare l'invert delle scale per passare da px a valori di data e valore.
     *              Fai attenzione che la posizione del mouse è relativa all'svg, mentre le scale sono relative al gContainer (e il gContainer è traslato rispetto all'svg
     *      - aggiorna il contenuto dei due testi con la data e il valore ottenuti al passo precedente
     *      - trasla il gruppo vicino alla posizione del mouse (aggiungi dell'offset per chiarezza)
     *      - trasla le linee tratteggiate sulla posizione esatta del mouse
     *      - mostra il tooltip
     * 3. Quando il mouse esce dal grafico, nascondi il tooltip
     */
    const rect_width = 55, rect_height = 30, rect_x = 0, rect_y = -5;
    const text_x = 5, text1_y = rect_height * (1 / 3) + rect_y, text2_y = rect_height * (2 / 3) + rect_y;

    // 1 TOOLTIP
    const tooltip = svg.append('g')
        .style('opacity', 0)

    // Rettangolo bianco con bordo nero
    tooltip.append('rect')
        .attr('x', rect_x)
        .attr('y', rect_y)
        .attr('width', rect_width)
        .attr('height', rect_height)
        .attr('fill', 'white')
        .attr('stroke', 'black')

    // Testo che contiene la data
    const dateText = tooltip.append('text')
        .attr('fill', 'black')
        .attr('x', text_x)
        .attr('y', text1_y)
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text('')
        .attr('dominant-baseline', 'middle')

    // Testo che contiene il prezzo
    const priceText = tooltip.append('text')
        .attr('fill', 'black')
        .attr('x', text_x)
        .attr('y', text2_y)
        .style('font-size', '10px')
        .text('')
        .attr('dominant-baseline', 'middle')

    // 2 Disegna la linea (Y=0)
    const yLine = gContainer.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', chartWidth)
        .attr('y2', 0)
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('3, 3'))

    // Disegna la linea (X=0)
    const xLine = gContainer.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', chartHeight)
        .attr('stroke', 'black')
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '3 3')

    // 3
    // Cattura la posizione del mouse sul grafico e usa le scale inverse per ottenere le posizioni x,y per ottenere la data e il valore
    svg.on('mousemove', function (e) {
        // Per fare il rettangolo leggermente spostato rispetto al mouse, altrimenti non si riesce a vedere la posizione del mouse
        const x_offset = 60, y_offset = 30;

        // Ottieni la posizione x,y del mouse. Hint: usa d3.pointer [https://d3js.org/d3-selection/events#pointer]
        const [x, y] = d3.pointer(e);

        // Inverti la x e la y per ottenere i valori originali. Hint: usa scaleX.invert e scaleY.invert [https://d3js.org/d3-scale/linear#linear_invert]
        // Ricordati che l'evento è relativo all'svg, mentre le scale sono relative al gContainer (hanno la stessa origine?)
        const netX = x - margin.left;
        const netY = y - margin.top;
        const date = scaleX.invert(netX);
        const value = scaleY.invert(netY);

        // Assegna le variabili come testo dei text dentro al tooltip
        dateText.text(`${d3.timeFormat('%d-%m-%Y')(date)}`)
        priceText.text(`${d3.format('$.2f')(value)}`)

        // Trasla il tooltip vicino alla posizione del mouse
        tooltip.attr('transform', `translate(${x - x_offset}, ${y - y_offset})`)

        // Mostra il tooltip
        tooltip.style('opacity', 1)

        // Mostra e trasla le linee (Y=0) e (X=0) esattamente nella posizione del mouse
        yLine.style('opacity', 1)
        xLine.style('opacity', 1)
        yLine.attr('y1', netY).attr('y2', netY)
        xLine.attr('x1', netX).attr('x2', netX)
    })
    // Quando il mouse esce dal grafico
    svg.on('mouseout', function (e) {
        // Nascondi il tooltip
        tooltip.style('opacity', 0)

        // Nascondi le linee
        yLine.style('opacity', 0)
        xLine.style('opacity', 0)
    })
}