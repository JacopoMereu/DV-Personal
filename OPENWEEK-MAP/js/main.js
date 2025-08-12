window.onload = main;

function main() {
    get_GeoJSON_data()
}

function get_GeoJSON_data() {
        d3.json('./data/world2.geojson')
        .then(data => render_data(data))
        .catch(err => console.log(err));
}

const svgWidth = 1500;
const svgHeight = 930;

const margin = {top: 20, right: 20, bottom: 20, left: 20}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log("DATA LOADED", data)

    const svg = d3.select("body")
        .append("svg")
        .style('width', svgWidth)
        .style('height', svgHeight);

    const gContainer = svg
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const gMap = gContainer.append('g')

    const data2projection = (data) =>
        // d3.geoAzimuthalEqualArea()
        d3.geoMercator()
        //     d3.geoEquirectangular()
            .fitSize([chartWidth, chartHeight], data)
    const projection = data2projection(data)
    const geoGenerator = d3.geoPath().projection(projection);

    gMap
        .selectAll(null)
        .data(data.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('fill', '#ddd')
        .attr('stroke', '#aaa')
}