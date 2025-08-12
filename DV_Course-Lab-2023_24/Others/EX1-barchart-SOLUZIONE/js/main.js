window.onload = main;

function main() {
    get_data()
    // const data = get_data();
    // render_data(data);
}

function get_data() {
    // return [
    //     {name: 'London', population: 8674000},
    //     {name: 'New York', population: 8406000},
    //     {name: 'Sydney', population: 4293000},
    //     {name: 'Paris', population: 2244000},
    //     {name: 'Beijing', population: 11510000}
    // ];
    //TODO Punto 1
    const P = data => data.map(o => ({...o, 'population': +o['population']}))
    d3.json('./data/data.json')
        .then(data => render_data(P(data)))
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
            // TODO Punto 2
            .padding(0.4)

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
            // TODO 3 (1/2)
            .attr('stroke', 'black')
            .attr('stroke-width', 3)
        ;
    }
    const on_mouseout = function (evt, d) {
        d3.select(this)
            .attr('fill', 'steelblue')
            // TODO 3 (2/2)
            .attr('stroke-width', 0)
        ;
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
        // TODO Punto 3
        // .text(d => d3.format(".2s")(d[value]));
        .text(d => d3.format(".3s")(d[value]));
}