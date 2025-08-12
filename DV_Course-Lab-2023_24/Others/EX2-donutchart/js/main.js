window.onload = main;

function sort_object_by_values(obj, sort_reverse = false) {
    return Object.fromEntries(
        Object.entries(obj).sort((a, b) => sort_reverse ? b[1] - a[1] : a[1] - b[1])
    );
}

function main() {
    const data = get_dummy_data();
    render_data(sort_object_by_values(data, true));
}

function get_dummy_data() {
    return {a: 9, b: 20, c: 8, d: 30, e: 12}
}

const svgWidth = 900;
const svgHeight = 650;

const margin = {top: 40, right: 40, bottom: 40, left: 40}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    const sumValues = d3.sum(Object.values(data))
    const normalized_value = v => (v / sumValues * 100).toFixed(0)
    const normalized_value_str = v => `${normalized_value(v)}%`

    const innerRadius = 100;
    const outerRadius = Math.min(chartWidth, chartHeight) / 2 - d3.max(Object.keys(margin), k => margin[k])

    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const circleG = gContainer
        .append("g")
        .attr("transform", "translate(" + chartWidth / 2 + "," + chartHeight / 2 + ")")

    const color = d3.scaleOrdinal()
            .domain(Object.keys(data))
            .range(d3.schemeTableau10)

    const pie = d3.pie()
        .value(d => d[1])

    const arcs = pie(Object.entries(data))

    const arcGenerator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    const get_color = (arc_obj, i) => {
        const [group, value] = arc_obj.data
        return color(group)
    }

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


    const r = 5
    circleG.append('g')
        .selectAll(null)
        .data(arcs)
        .join('circle')
        .attr('cx', arc_obj => arcGenerator.centroid(arc_obj)[0])
        .attr('cy', arc_obj => arcGenerator.centroid(arc_obj)[1])
        .attr('r', r);

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