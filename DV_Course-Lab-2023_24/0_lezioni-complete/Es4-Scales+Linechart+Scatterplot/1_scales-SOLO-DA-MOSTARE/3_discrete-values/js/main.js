window.onload = main;

let data = []

function main() {
    data = get_data();
    render_data(data);
}


function get_data() {
    // Dataset 1
    // return Array.from({ length: 26 }, (_, i) => i.toString());

    // Dataset 2
    // return ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]

    // Dataset 3
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}


function render_data() {
    const SCALES_WITH_DOMAIN = ["point", "band"];
    const svgWidth = +d3.select('svg').style('width').replace('px', '') - 30;

    const container = d3.select("svg #container");
    container.selectAll("g").remove();


    for (let scaleType of SCALES_WITH_DOMAIN) {
        let myScale = getScaleFromString(scaleType, data, [0, svgWidth])

        const handleScaleX = d => {
            if(scaleType==="band") {
                console.log("BANDWIDTH", myScale.bandwidth())
                return myScale(d);
            }
            else if (scaleType==="point") {
                console.log("STEP", myScale.step())
                return myScale(d);
            }
            else throw "Not implemented";
        }

        // draw the current axis
        const g = container
            .append('g')
            .attr('transform', `translate(0, ${SCALES_WITH_DOMAIN.indexOf(scaleType) * 100 + 30})`);

        g.append('line')
            .attr('x1', 0)
            .attr('x2', svgWidth)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .style('opacity', 0.3);

        // draw the circles in the axis
        g.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', 3)
            .attr('cx', handleScaleX);

        g.selectAll('text')
            .data(data)
            .join('text')
            .attr('x', handleScaleX)
            .attr('y', (_, i) => i % 2 === 0 ? -8 : 20)
            .text(d => scaleType==="time"? int2date(d).toLocaleDateString() :d);

        g.append('text')
            .attr('x', svgWidth / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .text(scaleType);
    }
}


/* Utils */
function getScaleFromString(scaleType, data, range) {
    let myScale;
    if (scaleType === "point") {
        myScale = d3.scalePoint()
            .domain(data)
            .range(range);
    }
    else if (scaleType === "band") {
        myScale = d3.scaleBand()
            .domain(data)
            .range(range);
    }
    else {
        console.log("ERROR: scaleType not found");
    }
    if (myScale.clamp)
        myScale.clamp(true);

    return myScale;
}