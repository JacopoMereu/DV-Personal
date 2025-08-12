window.onload = main;

function main() {
      get_GeoJSON_data();
}

function get_GeoJSON_data() {
    /* TODO Play with the different geojson */

     d3.json('./data/africa.geojson')
    //  d3.json('./data/africa_hd.geojson')
    //     d3.json('./data/usa.geojson')
    //     d3.json('./data/world.geojson')
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

    /*TODO Pick a projection function */
    const projection = null //<--

    /*TODO  Create the Geographic Path Generator */
    const geoGenerator = null //<--

    /*TODO  Generate the map:
    * 1. Create a path for each GeoJSON Feature by using the GeoGenerator
    * 2. Assign a lightgray fill
    * 3. Assign a black stroke*/
    // <--
}