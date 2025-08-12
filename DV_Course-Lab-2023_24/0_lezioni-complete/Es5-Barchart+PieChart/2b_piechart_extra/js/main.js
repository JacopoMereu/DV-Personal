window.onload = main;

function main() {
    const data = get_good_data();
    // const data = get_bad_data();
    // const data = get_bad_data2();
    render_data(JLib.sort_object_by_values(data, reverse = true));
}

function get_good_data() {
    return {a: 9, b: 20, c: 8, d: 30, e: 12}
}

const svgWidth = 900;
const svgHeight = 650;

const margin = {top: 40, right: 40, bottom: 40, left: 40}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log("DATA", data)
    // Sum the values of the data
    const sumValues = d3.sum(Object.values(data))
    const normalized_value = v => (v / sumValues * 100).toFixed(0)
    const normalized_value_str = v => `${normalized_value(v)}%`


    // Create the svg object
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);
    // Create the container for the chart with a margin with respect to the svg
    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const innerRadius = 100;
    const outerRadius = Math.min(chartWidth, chartHeight) / 2 - d3.max(Object.keys(margin), k => margin[k])

    // Create a specific group for the pie chart and translate it to the center of the svg
    const circleG = gContainer
        .append("g")
        .attr("transform", "translate(" + chartWidth / 2 + "," + chartHeight / 2 + ")")
        .attr('id', 'circleG') // TODO new code here

    // Create an ordinal scale to assign a color to each group
    const color = d3.scaleOrdinal()
            .domain(Object.keys(data)) // The domain is the list of groups: ['a', 'b', 'c', 'd', 'e']
            .range(d3.schemeTableau10)

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(d => d[1])
    const arcs = pie(Object.entries(data)) // pie wants an array of values e.g. pie([9, 20, 30, 8, 12])

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    const arcGenerator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    const get_color = (arc_obj, i) => {
        const [group, value] = arc_obj.data // ['a', 9]
        return color(group)
    }
    /**
     * Esercizio: Aggiungi un mouseover e mouseout a ciascun arco che evidenzia l'arco e la riga della legenda corrispondente.
     *
     * Hint: Usa una classe all'arco uguale al nome del gruppo (e.g. 'a') per renderlo più facile da selezionare da qualche altra parte del codice.
     */
    circleG
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', get_color)
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        // TODO new code here
        .attr('class', d => d.data[0])
        .on("mouseover", function (evt, d) {
            d3.select(this)
                .classed('hovered', true)
            d3.select(`#legend g.${d.data[0]}`)
                .classed('hovered', true)

        })
        .on("mouseout", function (evt, d) {
            d3.select(this)
                .classed('hovered', false)
            d3.select(`#legend g.${d.data[0]}`)
                .classed('hovered', false)
        })


    // Create a circle in the center of the pie
    const r = 5
    circleG.append('g')
        .selectAll(null)
        .data(arcs)
        .join('circle')
        .attr('cx', arc_obj => arcGenerator.centroid(arc_obj)[0])
        .attr('cy', arc_obj => arcGenerator.centroid(arc_obj)[1])
        .attr('r', r);


    const is_right = arc_obj => arc_obj.startAngle < Math.PI
    const font_size = 17
    const dy = "-0.5em"
    // Create text in the outer point
    circleG.append('g')
        .selectAll(null)
        .data(arcs)
        .join('text')
        .text(d => `${normalized_value_str(d.data[1])}`)
        .attr("x", arc_obj => arcGenerator.centroid(arc_obj)[0])
        .attr("y", arc_obj => arcGenerator.centroid(arc_obj)[1])
        .attr("dy", dy)
        .attr("dx", arc_obj => is_right(arc_obj) ? "0.5em" : "-0.5em")
        .style("text-anchor", arc_obj => is_right(arc_obj) ? "start" : "end")
        .style("font-size", font_size)

    // Legend
    create_legend(gContainer, arcs, get_color, normalized_value_str)

}

// TODO new code here
function create_legend(container, arcs, get_color, normalized_value_str) {
    const rect_sizes = {width: 10, height: 10, x: 0, y: 0}
    const font_size = 12

    const arc2text = d => `${d.data[0]}: ${normalized_value_str(d.data[1])}`
    const longest_text = d3.max(arcs.map(arc2text), d => d.length)

    /**
     * Esercizio: Crea un gruppo per la legenda e posizionalo in alto a destra del grafico.
     */
    const legend = container
        .append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${chartWidth - margin.right - longest_text}, ${margin.top})`);

    /**
     * Esercizio: Crea un testo per la legenda ("Legend").
     */
    legend.append('text')
        .text("Legend")
        .attr('y', -rect_sizes.height * (3 / 2))
        .attr('x', rect_sizes.x)
        .attr('fill', 'black')
        .style('font-size', font_size)
        .attr('dominant-baseline', 'hanging')

    /**
     * Esercizio: Crea un gruppo per ciascun arco e posizionalo in base all'indice dell'arco.
     * Ogni gruppo deve contenere un rettangolo e un testo.
     * Il rettangolo deve essere colorato con il colore dell'arco.
     * Il testo deve essere il nome del gruppo seguito dal valore normalizzato.
     * Ogni gruppo deve avere un evento "mouseover" e "mouseout" che evidenzia sia l'arco che il gruppo (riga della legenda).
     * Puoi usare la funzione arc2text per ottenere il testo da mostrare.
     *                      e get_color per ottenere il colore da usare.
     * Hint: Usa una classe al gruppo uguale al nome del gruppo (e.g. 'a') per renderlo più facile da selezionare da qualche altra parte del codice.
     * */
    const legendGroups = legend.selectAll('g')
        .data(arcs)
        .join('g')
        .attr('transform', (d, i) => `translate(${0}, ${i * 2 * rect_sizes.height})`)
        .attr('class', d => d.data[0])
        .on("mouseover", function (evt, d) {
            d3.select(this)
                .classed('hovered', true)
            d3.select(`#circleG path.${d.data[0]}`)
                .classed('hovered', true)

        })
        .on("mouseout", function (evt, d) {
            d3.select(this)
                .classed('hovered', false)
            d3.select(`#circleG path.${d.data[0]}`)
                .classed('hovered', false)
        })


    legendGroups
        .append('rect')
        .attr('x', rect_sizes.x)
        .attr('y', rect_sizes.y)
        .attr('width', rect_sizes.width)
        .attr('height', rect_sizes.height)
        .attr('fill', get_color)

    legendGroups
        .append('text')
        .text(arc2text)
        .attr('x', rect_sizes.width * (3 / 2))
        .attr('fill', 'black')
        .style('font-size', font_size)
        .attr('dominant-baseline', 'hanging')
}