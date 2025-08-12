window.onload = main;

let data = []

function main() {

    const on_change = () => {
        const radioValue = d3.select('input[name="data_type"]:checked').property("value");
        if (radioValue === "random") {
            console.log("random");
            d3.select("#row_random_data").classed("disabled", false);
            d3.select("#row_input_data").classed("disabled", true);
            from_random();
        } else {
            d3.select("#row_random_data").classed("disabled", true);
            d3.select("#row_input_data").classed("disabled", false);
            from_input();
        }
    }
    d3.selectAll('input[name="data_type"]').on('change', on_change);
    on_change();
}


function from_random() {
    const min = +d3.select("input#min").property("value");
    const max = +d3.select("input#max").property("value");
    const N = +d3.select("input#N").property("value");

    data = JLib.get_N_random_numbers_in_range(N, min, max, true);

    render_data(data);
    const show_text = d3.select("input#show_text").property("checked");
    d3.selectAll('.labels').classed('hide', !show_text);
}

function from_input() {
    const input = d3.select("input#input_data").property("value");
    data = input.split(",").map(d => +d);
    render_data(data);
    const show_text = d3.select("input#show_text").property("checked");
    d3.selectAll('.labels').classed('hide', !show_text);

}
function toggle_text() {
    const g_label = d3.selectAll(".labels");
    const class_name = 'hide';
    g_label.classed(class_name, !g_label.classed(class_name));
}

let shift = 0;
function shift_data() {
    shift = +d3.select("input#shift").property("value");
    render_data(data);

}
function render_data() {
    const SCALES_WITH_DOMAIN = ["linear", "pow2", "sqrt2", "log10", "time"];
    const right = 100;
    const svgWidth = +d3.select('svg').style('width').replace('px', '') - right;

    const copy = [...data].map(d => d + shift);
    const [min, max] = d3.extent(copy);
    console.log("min", min, "max", max, "svgWidth", svgWidth);

    const container = d3.select("svg #container");
    container.selectAll("g").remove();

    const get_y = (i) => i * 100 + 30;
    for (let scaleType of SCALES_WITH_DOMAIN) {
        const curr = SCALES_WITH_DOMAIN.indexOf(scaleType);
        let myScale = getScaleFromString(scaleType, [min, max], [0, svgWidth])
        // console.log("scaleType", scaleType, "myScale", myScale);

        const handleScaleX = d => {
            if (scaleType === "time") {
                return myScale(int2date(d));
            } else if (scaleType === "log10") {
                return myScale(d+1);
            }
            return myScale(d);
        }

        const g = container
            .append('g')
            .attr('transform', `translate(0, ${get_y(curr)})`)

        g.append('line')
            .attr('x1', 0)
            .attr('x2', svgWidth)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .style('opacity', 0.3);

        g.append('g').classed('circles',true).selectAll('circle')
            .data(copy)
            .join('circle')
            .attr('r', 3)
            .attr('cx', handleScaleX);

        g.append('g').classed('labels',true).selectAll('text')
            .data(copy)
            .join('text')
            .attr('x', handleScaleX)
            .attr('y', (_, i) => i % 2 === 0 ? -8 : 20)
            .text(d => scaleType === "time" ? int2date(d - shift).toLocaleDateString() : d - shift);

        g.append('text')
            .attr('x', svgWidth / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .text(scaleType);

        // make a circle on the right of the scale
        g.append('circle')
            .attr('cx', svgWidth + 25)
            .attr('cy', -10)
            .attr('r', 5)
            .attr('fill', 'green')
            .on('click', function () {
                const class_name = 'hide'
                const parent = d3.select(this.parentNode);
                parent.classed(class_name, !parent.classed(class_name));
                if (parent.classed(class_name)) {
                    d3.select(this).attr('fill', 'red');
                } else {
                    d3.select(this).attr('fill', 'green');
                }
            });
    }
}


/* Utils */
function getScaleFromString(scaleType, domain, range) {
    let myScale;
    if (scaleType === "linear") {
        myScale = d3.scaleLinear()
            .domain(domain)
            .range(range);

    }
    else if (scaleType.startsWith("pow")) {
        const exponent = +scaleType.replace("pow", "");
        myScale = d3.scalePow()
            .exponent(exponent)
            .domain(domain)
            .range(range);
    }
    else if (scaleType.startsWith("sqrt")) {
        const exponent = +scaleType.replace("sqrt", "");
        myScale = d3.scaleSqrt()
            .domain(domain)
            .range(range)
            .exponent(1/exponent);

    } else if (scaleType === "log10") {
        console.log("DOMAIN", domain[0], domain[1])
        // const min = Math.max(domain[0], 1);
        const max = domain[1];
        myScale = d3.scaleLog()
            .domain([domain[0]+1, max+1])
            .range(range);
    } else if (scaleType === "time") {
        myScale = d3.scaleTime()
            .domain(domain.map(int2date))
            .range(range);
    } else {
        console.log("ERROR: scaleType not found");
    }
    myScale.clamp(true);
    return myScale;
}

function int2date(int) {
    return JLib.int2date(int);
}