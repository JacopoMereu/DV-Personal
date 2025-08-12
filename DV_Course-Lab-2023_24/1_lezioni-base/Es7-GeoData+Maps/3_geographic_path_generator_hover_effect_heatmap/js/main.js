window.onload = main;

function main() {
    get_data();
}

function get_data() {
    function preprocess_population_data(pop_data) {
        return pop_data.map((d) => {
            return {...d, pop: +d.pop}
        })
    }

    // Promise.all waits for all promises to resolve or reject.
    // It returns a promise that resolves when all of the promises have resolved.
    // TODO Load both the geojson and the csv data. The population data should be preprocessed
    //
}

const svgWidth = 1200;
const svgHeight = 800;

const margin = {top: 50, right: 60, bottom: 40, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data_countries_geojson, data_population_csv) {
    console.log("DATA LOADED #GeoJSON", data_countries_geojson)
    console.log("DATA LOADED #data_population_csv", data_population_csv)

    const svg = create_svg()
    const gContainer = create_gContainer(svg)
    const projection = get_projection(data_countries_geojson)
    const geoGenerator = get_geo_generator(projection)

    function handleMouseOver(e, d) {
        console.log("EVENT", e)
        console.log("DATA", d)

        // Show the area and measure of the path on a text
        const countryName = d.properties.name
        const pixelArea = geoGenerator.area(d);
        const measure = geoGenerator.measure(d);
        text_legend
            .text(`${countryName} (path.area = ${pixelArea.toFixed(1)} path.measure = ${measure.toFixed(1)})`);


        // Show the bounding box with a rect
        const bounds = geoGenerator.bounds(d);
        boundsRect
            .attr('x', bounds[0][0])
            .attr('y', bounds[0][1])
            .attr('width', bounds[1][0] - bounds[0][0])
            .attr('height', bounds[1][1] - bounds[0][1]);

        // Show the centroid with a circle
        const centroid = geoGenerator.centroid(d);
        centroidCircle
            .attr('fill', 'red')
            .attr('cx', centroid[0])
            .attr('cy', centroid[1]);
    }

    function handleMouseOut(e, d) {
        console.log("EVENT", e)
        console.log("DATA", d)

        // Reset text
        text_legend.text(`Hover the mouse over a country`);


        // Reset bounding box width and height
        boundsRect
            .attr('width', 0)
            .attr('height', 0);

        // Reset the circle
        centroidCircle
            .attr('fill', 'none')
    }

    const gLegend = svg.append('g').attr('transform', `translate(${0}, ${margin.top / 2})`)
    const text_legend = gLegend
        .append('text')
        .attr('id', 'legend')
        .attr('dx', margin.left / 2)
        .text('Hover the mouse over a country')

    const hoveredCountryG = gContainer.append('g');
    const boundsRect = hoveredCountryG
        .append('rect')
        .attr('id', 'bounding-box')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '5, 1')
    const centroidCircle = hoveredCountryG.append('circle')
        .attr('id', 'centroid')
        .attr('r', 3)
        .attr('fill', 'none');

    /** ////////////// NEW CODE ////////////// */
        // List of interpolators: https://d3js.org/d3-scale-chromatic/sequential#interpolateInferno
    const legendWidth = 600;
    const legendHeight = 20;

    const legend = gLegend.append('g')
    // TODO Apply the correct transform
    // <--


    const exp = 0.25

    //TODO 1) Create a scaleSequential which maps the population size into a color
    //TODO 2) See what happens by using a scaleSequentialSqrt

    const colorScale = null // <--
    // Draw a rectangle with the color scale
    legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#linear-gradient)')

    legend.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .text('Population')

    // TODO Define a linear gradient, with a stop for each color,  within a defs
    const defs = null // <--
    const linearGradient = null // <--
    linearGradient.selectAll(null)
        .data(colorScale.range())
        .join('stop')
        .attr('offset', (d, i) => i / (colorScale.range().length - 1))
        .attr('stop-color', d => d)


    //TODO 1) Define an horizontal linear scale for the population ticks
    //TODO 2) Change the scale from linear to sqrt
    // const legendScale = d3.scaleLinear()
    const legendScale = null // <--

    // The bottom axis
    const legendAxis = d3.axisBottom(legendScale)
        .tickSize(legendHeight)
        .ticks(5)
        .tickFormat(d3.format('.2s'))

    legend.append('g')
        .attr('transform', `translate(0, ${legendHeight})`)
        .call(legendAxis)
    /** ////////////// END CODE ////////////// */

    gContainer.append('g')
        .selectAll(null)
        .data(data_countries_geojson.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('fill', function (d, i) {
            // const countryData = data_population_csv.find((country) => country.name === d.properties.name) // TODO: Dire perché non funziona troppo bene
            const countryData = data_population_csv.find((country) => country.code === d.id)
            return countryData ? colorScale(countryData.pop) : 'black'
        })
        .attr('stroke', '#aaa')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .append('title')
        .text(d => {
            const countryData = data_population_csv.find((country) => country.code === d.id)
            return countryData ? `${d.properties.name}: ${d3.format('.2s')(countryData.pop)}` : `${d.properties.name}: Unknown population`
        })
}

function create_svg() {
    return d3.select("body")
        .append("svg")
        .style('width', svgWidth)
        .style('height', svgHeight);
}

function create_gContainer(svg) {
    return svg
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
}

function get_projection(data_countries_geojson) {
    return d3.geoMercator()
        .fitSize([chartWidth, chartHeight], data_countries_geojson)
}

function get_geo_generator(projection) {
    return d3.geoPath().projection(projection);
}