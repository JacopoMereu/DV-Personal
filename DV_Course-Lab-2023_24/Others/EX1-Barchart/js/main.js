window.onload = main;

function main() {
    get_data();}

function get_data() {
    return [  // A)
        d3.json('./data/data.json') // A) recupera i dati letti dal file data.json della cartella data
            .then(data => render_data(data)) // richiama la funzione render_data con i dati acquisiti nella riga precedente
            .catch(err => console.log(err)) // in caso di errore mostra un messaggio di errore nella console
    ];
}


const svgWidth = 650;
const svgHeight = 650;

const margin = {top: 40, right: 40, bottom: 40, left: 80}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const key = 'name', value = 'population', sort = true
    render_bar_chart(svg, data, key, value, sort);
}

function render_bar_chart(svg, data, key, value, sort) {
    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    if (sort)
        data.sort((a, b) => d3.ascending(a[value], b[value]));


    const scaleX = d3.scaleBand()
        .domain(data.map(d => d[key]))
        .range([0, chartWidth])
        .padding(0.4) // B) crea un distanziamento tra i vari elementi presenti nell'asse orizzontale di un valore di 0.4 . Il dominio del padding va da 0 a 1


    gContainer.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(scaleX));

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[value])])
        .range([chartHeight, 0])
        .nice();

    gContainer.append('g')
        .call(d3.axisLeft(scaleY)
            .ticks(null, ".2s")
            .tickSize(-chartWidth)
        )
        .call(g => g.selectAll('line')
            .attr('stroke', 'lightgrey')
            .attr('stroke-dasharray', '10, 2')
        );


    const get_x = d => scaleX(d[key])
    const get_y = d => scaleY(d[value])
    const get_width = d => scaleX.bandwidth()
    const get_height = d => chartHeight - scaleY(d[value])

    const on_mouseover = (evt, d) => { // https://github.com/d3/d3-selection/issues/263
        d3.select(evt.currentTarget)
            .attr('fill', 'orange')
            .attr("stroke","black") // C) Viene colorato il contorno dell'elemento su cui passa sopra il mouse del colore segnato tra parentesi(black), può anche essere scritto come un unione RGB (#000000)
            .attr("stroke-width",3) // C) viene dato uno spessore al contorno creato nella riga precedente
    }
    const on_mouseout = function (evt, d) {
        d3.select(this)
            .attr('fill', 'steelblue')
            .attr("stroke","none") // C) viene reso invisibile e quindi senza valore(none) il contorno creato precedentemente
    }

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
        .text(d => d3.format(".3s")(d[value])); // D) viene modificato il testo del tooltip che mostra una cifra decimale in più
}