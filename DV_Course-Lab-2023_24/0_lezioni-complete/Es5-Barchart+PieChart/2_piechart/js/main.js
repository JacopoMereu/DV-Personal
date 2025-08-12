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

function get_bad_data() {
    return {
        'a': 9,
        'b': 20,
        'c': 8,
        'd': 30,
        'e': 12,
        'f': 3,
        'g': 7,
        'h': 15,
        'i': 10,
        'l': 5,
        'm': 2,
        'n': 1,
        'o': 4,
        'p': 6,
        'q': 11,
        'r': 13,
        's': 14,
        't': 16,
        'u': 17,
        'v': 18,
        'z': 19
    };
}

function get_bad_data2() {
    return {'a': 20, 'b': 17, 'c': 21, 'd': 19, 'e': 22}
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


    // The inner radius of the pie is 0 for a pie chart, but it can be higher for a donut chart.
    const innerRadius = 100;
    // The outer radius of the pie is half the small side of the svg minus the largest margin.
    const outerRadius = Math.min(chartWidth, chartHeight) / 2 - d3.max(Object.keys(margin), k => margin[k])


    // Create the svg object
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);
    // Create the container for the chart with a margin with respect to the svg
    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Create a specific group for the pie chart and translate it to the center of the svg
    const circleG = gContainer
        .append("g")
        .attr("transform", "translate(" + chartWidth / 2 + "," + chartHeight / 2 + ")")

    /**
     * Esercizio: Crea una scala ordinale per assegnare un colore a ciascun gruppo
     */
    // Create an ordinal scale to assign a color to each group
    const color = d3.scaleOrdinal()
            .domain(Object.keys(data)) // The domain is the list of groups: ['a', 'b', 'c', 'd', 'e']
            .range(d3.schemeTableau10)


    // Compute the position of each group on the pie:
    // (d3.pie().value(<CALLBACK THAT TELLS YOU HOW TO GET THE VALUE>))(<DATASET>)
    const pie = d3.pie()
        // .sort(null) // Do not sort group by size // TODO: Play with this
        .value(d => d[1]) // Specify which is the value. d is an entry of our data e.g. {'a':9} 'a': 9, d[0]='a', d[1]=9

    const arcs = pie(Object.entries(data)) // pie wants an array of values e.g. pie([9, 20, 30, 8, 12])
    console.log("ARCS", arcs)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    const arcGenerator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    const get_color = (arc_obj, i) => {
        const [group, value] = arc_obj.data // ['a', 9]
        return color(group)
    }

    // Add the paths (arcs)
    const base_opacity = 0.7
    circleG
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', get_color)
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", base_opacity)


    /**
     * Esercizio: Crea un cerchio per ciascun arco e posizionalo nel centro dell'arco (usa arcGenerator.centroid(<arco>))
     */
    // Create a circle in the center of the pie
    const r = 5
    circleG.append('g')
        .selectAll(null)
        .data(arcs)
        .join('circle')
        .attr('cx', arc_obj => arcGenerator.centroid(arc_obj)[0])
        .attr('cy', arc_obj => arcGenerator.centroid(arc_obj)[1])
        .attr('r', r);

    /**
     * Eserecizio: Crea un testo per ciascun arco e posizionalo nel centro dell'arco (usa arcGenerator.centroid(<arco>))
     * Se l'arco è nella semicirconferenza sinistra:
     *      - L'ancora del testo deve essere alla fine del testo
     * Se l'arco è nella semicirconferenza destra:
     *     - L'ancora del testo deve essere all'inizio del testo
     * Puoi usare la funzione arc_obj.startAngle per capire in quale semicirconferenza si trova l'arco
     */
    const is_right = arc_obj => arc_obj.startAngle < Math.PI

    const text_x = arc_obj => arcGenerator.centroid(arc_obj)[0],
        text_y = arc_obj => arcGenerator.centroid(arc_obj)[1],
        text_dx = arc_obj => is_right(arc_obj) ? "0.5em" : "-0.5em",
        text_dy = arc_obj => "-0.5em",
        text_text_anchor = arc_obj => is_right(arc_obj) ? "start" : "end",
        text_font_size = _ => 17;
    // Create text in the outer point
    circleG.append('g')
        .selectAll(null)
        .data(arcs)
        .join('text')
        .text(d => `${normalized_value_str(d.data[1])}`)
        .attr("x", text_x)
        .attr("y", text_y)
        .attr("dy", text_dy)
        .attr("dx", text_dx)
        .style("text-anchor", text_text_anchor)
        .style("font-size", text_font_size)
}