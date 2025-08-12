window.onload = main;

let data = []

function main() {
    randomize_data();
}


function randomize_data() {
    data = get_data();
    render_data(data);
}

function get_data() {
    const N = +d3.select("input#N").property("value");

    return Array.from({length: N}, (_, i) => i);
}


function render_data() {
    const SCALES_WITH_DOMAIN = ["sequential", "ordinal", "threshold"];
    const svgWidth = +d3.select('svg').style('width').replace('px', '') - 30;

    const [min, max] = d3.extent(data);
    // equivalent to
    // const min = d3.min(data);
    // const max = d3.max(data);
    console.log("min", min, "max", max, "svgWidth", svgWidth);

    const container = d3.select("svg #container");
    container.selectAll("g").remove();

    const scaleX = d3.scaleLinear()
        .domain([min, max])
        .range([0, svgWidth]);


    for (let scaleType of SCALES_WITH_DOMAIN) {
        let scaleColor = getScaleFromString(scaleType, data, [0, svgWidth])
        console.log("scaleType", scaleType, "myScale", scaleColor);

        const g = container
            .append('g')
            .attr('transform', `translate(0, ${SCALES_WITH_DOMAIN.indexOf(scaleType) * 100 + 30})`);

        g.append('line')
            .attr('x1', 0)
            .attr('x2', svgWidth)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', "black")
            .attr('stroke-width', 1)
            .style('opacity', 0.3);

        g.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', 8)
            .attr('cx', scaleX)
            .attr('fill', scaleColor);

        g.append('text')
            .attr('x', svgWidth / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .text(scaleType);
    }
}


/* Utils */
function getScaleFromString(scaleType, data) {
    let myScale;

    // List of interpolators: https://d3js.org/d3-scale-chromatic/sequential#interpolateInferno
    if (scaleType === "sequential") {
        myScale = d3.scaleSequential()
            .domain(d3.extent(data))
            // .range(range) // No range, it will be set by the interpolator
            .interpolator(d3.interpolateRgbBasis(["red", "green"]));
            // .interpolator( d3.interpolateRgbBasis(["purple", "green", "orange"]) );
            // .interpolator(d3.interpolateRainbow)
            // .interpolator(d3.interpolateYlOrRd);
    }

    // Ordinal is not a continuous scale, then the "domain" is the list of values itself (data)
    // List of color schemes: https://d3js.org/d3-scale-chromatic/categorical
    else if (scaleType === "ordinal") {
        myScale = d3.scaleOrdinal()
            .domain(data)
            .range(["red", "green"])
            // .range(["wheat", "red", "black"])
            // .range(d3.schemeTableau10);

    } else if (scaleType === "threshold") {
        myScale = d3.scaleThreshold()
            // .domain([40,50, 60,80])
            .domain([data.at(data.length * 1 / 5), data.at(data.length * 2 / 5), data.at(data.length * 3 / 5)])
            .range(["red", "green", "blue", "brown", "black"])
    }else {
        console.log("ERROR: scaleType not found");
    }

    // Not all scales have the clamp method
    if (myScale.clamp)
        myScale.clamp(true);
    return myScale;
}