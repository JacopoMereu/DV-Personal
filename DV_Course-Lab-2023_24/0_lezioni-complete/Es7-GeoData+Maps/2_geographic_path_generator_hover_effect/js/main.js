window.onload = main;

function main() {
    get_GeoJSON_data();
}

function get_GeoJSON_data() {
    //  d3.json('./data/africa.geojson')
    //  d3.json('./data/africa_hd.geojson')
    //     d3.json('./data/usa.geojson')
        d3.json('./data/world.geojson')
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

    const projection =
        // d3.geoAzimuthalEqualArea()
        d3.geoMercator()
            // d3.geoEquirectangular()
            // d3.geoAlbersUsa()
            .fitSize([chartWidth, chartHeight], data)

    const geoGenerator = d3.geoPath().projection(projection);

    // When the mouse is over a feature (path)
    function handleMouseOver(e, d) {
        console.log("EVENT", e)
        console.log("DATA", d)

        // Show the area and measure of the path on a text
        const countryName = d.properties.name // Country name
        const pixelArea = geoGenerator.area(d); // Pixel Area
        const measure = geoGenerator.measure(d); // Measure (perimeter)

        // Assign the previous information as the text_legend text
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

    // When the mouse leaves a feature (path)
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

    // Create the map
    gContainer
        .selectAll(null)
        .data(data.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('fill', '#ddd')
        .attr('stroke', '#aaa')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)

    // Create a legend
    const gLegend = svg.append('g')
    const text_legend = gLegend
        .append('text')
        .attr('id', 'legend')
        .attr('y', margin.top / 2)
        .attr('x', margin.left/2)
        .text('Hover the mouse over a country')

    // Pre-creation of the rect and circle that will be used to
    // highlight the feature (path) bounds and centroid
    const hoveredCountryG = gContainer.append('g');
    const boundsRect = hoveredCountryG
        .append('rect')
        .attr('id', 'bounding-box')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '5, 1')
    const centroidCircle = hoveredCountryG
        .append('circle')
        .attr('id', 'centroid')
        .attr('r', 3)
        .attr('fill', 'none');
}