window.onload = main;

function main() {
      get_GeoJSON_data();
}

function get_GeoJSON_data() {
    /* We are loading the GeoJSON with the d3.json */
    //  d3.json('./data/africa.geojson')
    //  d3.json('./data/africa_hd.geojson')
    //     d3.json('./data/usa.geojson')
        d3.json('./data/world.geojson')
        //
        .then(data => render_data(data))
        .catch(err => console.log(err));
}

const svgWidth = 650;
const svgHeight = 500;

const margin = {top: 40, right: 60, bottom: 40, left: 60}
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

    /* Pick a projection function */
    const projection =
        // d3.geoAzimuthalEqualArea()
        // d3.geoMercator()
        d3.geoEquirectangular()
        // d3.geoAlbersUsa()
            .fitSize([chartWidth, chartHeight], data)

    /* Create the Geographic Path Generator */
    const geoGenerator = d3.geoPath().projection(projection);

    /* Generate the map:
    * 1. Create a path for each GeoJSON Feature by using the GeoGenerator
    * 2. Assign a lightgray fill
    * 3. Assign a black stroke*/
    gContainer
        .selectAll(null)
        .data(data.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('fill', 'lightgray')
        .attr('stroke', 'black')
}