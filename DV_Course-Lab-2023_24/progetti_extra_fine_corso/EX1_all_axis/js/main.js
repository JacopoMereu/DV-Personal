window.onload = main;

function main() {
    d3.formatDefaultLocale({
        decimal: ",",
        thousands: " ", grouping: [3],  // thousands and grouping go together
        currency: ["€", ""] // The first element is the prefix, the second is the suffix
    })
    const data = get_data();
    render_data(data);
}

function get_data() {
    // d3.range(100+1) is equivalent to Array.from({length: 101}, (value, idx) => idx)
    // It creates an array from 0 to 100, both included
    return d3.range(100 + 1).map(d => d*100);
}

const svgWidth = 650;
const svgHeight = 650;

const margin = {top: 40, right: 40, bottom: 40, left: 40}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    // Create a scale common for all the 4 axes
    const scale_common = d3.scaleLinear()
        .domain(d3.extent(data, d => d)) // [min, max]
        .range([0, chartWidth])
        // .nice();

    // Create the 4 axis
    const magic_margin = 10;

    // Left
    gContainer.append("g").classed("axis", true)
        .attr("transform", `translate(${0 - magic_margin},${0})`)
        .call(d3.axisLeft(scale_common).tickSize(-chartWidth));

    // Bottom
    const leftAxis = d3.axisBottom(scale_common);
    // https://d3js.org/d3-format#locale_format
    leftAxis.ticks(5, ",.0f") // Set the ticks with an array of values in [min, max]
        .tickFormat((text, idx) => `[${idx}] ${text}`)
    // .tickValues([0, 10, 50, 100]) // Set the ticks with an array of values in [min, max]
        .tickPadding(3)
        .tickSize(5)
        // .tickSizeOuter(-chartHeight)

    gContainer.append("g")
        .attr("transform", `translate(${0},${chartHeight + magic_margin})`)
        .call(leftAxis);

    // // Right
    gContainer.append("g")
        .attr("transform", `translate(${chartWidth + magic_margin},${0})`)
        .call(d3.axisRight(scale_common));

    // Top
    gContainer.append("g")
        .attr("transform", `translate(${0},${0 - magic_margin})`)
        .call(d3.axisTop(scale_common));
}