window.onload = main;

function main() {
    get_data();
}

function get_data() {
    const P = data => {
        // map the string attribute "letter", which is in the format "fr(^<word>)", into "<word>"
        const extract_letter = d => d.letter.split('^')[1].split(')')[0];
        return data.map(d => ({letter: extract_letter(d), frequency: +d.frequency}))

    };
    d3.json('./data/data.json')
        .then(data => render_data(P(data)));
}

const svgWidth = 1900;
const svgHeight = 900;

const margin = {top: 60, right: 50, bottom: 30, left: 70}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const key = 'letter', value = 'frequency', sort = true
    render_lollipop_chart(svg, data, key, value, sort);
}

function render_lollipop_chart(svg, data, key, value, sort) {
    console.log("DATA", data)
    if (sort)
        data.sort((a, b) => d3.ascending(a[value], b[value]));
        // data.sort((a, b) => d3.descending(a[value], b[value]));

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // scale-y
    const scaleY = d3.scaleBand()
        .domain(data.map(d => d[key]))
        .range([0, chartHeight])
        .padding(0);

    //  scale-X
    const scaleX = d3.scaleSqrt().exponent(1/4)
        // .domain([0, d3.max(data, d => d[value])])
        .domain([0, 1])
        .range([0, chartWidth])
        .nice();

    // make a function that changes the stroke style based on the length of the letter:
    // length 2 = solid, length 3 = dashed, length 4 = dotted
    const scaleColorLine = d3.scaleOrdinal()
        .domain([1, 2, 3])
        .range(['0', '30 8', '2']);

    // axis-x
    gContainer.append('g')
        .call(d3.axisTop(scaleX)
            // .ticks(null, ".2%")
            // .ticks(6)
            .tickValues([0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1])
            .tickFormat(d3.format(".3"))
            .tickSize(-chartHeight)
        )
        .call(g => g.selectAll('line')
            .attr('stroke', 'lightgrey')
            .attr('stroke-dasharray', '10, 2')
        )
        .call(
            g => g.append('text')
                .attr('x', chartWidth/2)
                .attr('y', -margin.top/2)
                .attr('fill', 'black')
                .attr('font-size', '1.2em')
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text('Frequency')
        )
    // axis-Y
    gContainer.append('g')
        .call(d3.axisLeft(scaleY));


    // linea di riferimento per l'asse x
    const verticalRedLine = gContainer.append('line')
        .attr('y1', 0)
        .attr('x1', scaleX(0))
        .attr('y2', chartHeight)
        .attr('x2', scaleX(0))
        .attr('stroke', 'red')
        .attr('stroke-width', 3)
        .classed('vertical-line', true)
        .style('opacity', 0);

    /////////////////////
    const getX = (d) => scaleX(d[value]);
    const getY = (d) => scaleY(d[key]);
    // a letter is in the middle of the rect
    const getYofLetter = (d) => getY(d) + scaleY.bandwidth() / 2;

    // lines that represent the body of the lollipop
    gContainer.selectAll(null)
        .data(data)
        .join('line')
        .attr('y1', getYofLetter)
        .attr('x1', d => scaleX(0))
        .attr('y2', getYofLetter)
        .attr('x2', getX)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', d=>{
            console.log(d[key].length)
            return scaleColorLine(d[key].length)
        })

    // circles that represent the head of the lollipop. It shouldn't be larger than the rect i.e
    // 2r = width of the rect => r = width of the rect / 2
    const radiusScale = d3.scaleSqrt().exponent(1/8)
        .domain([0, d3.max(data, d => d[value])])
        .range([1, scaleY.bandwidth() / 2]);
    // const getRadius = (d) => radiusScale(d[value]);
    const getRadius = (d) => {
        // if the value is 0, the radius should be something visible
        return d[value] === 0 ? 5 : radiusScale(d[value]);
    }
    const get_circle_color = (d) => d[value] === 0 ? 'black' : 'red';
    gContainer.selectAll(null)
        .data(data)
        .join('circle')
        .attr('cy', getYofLetter)
        .attr('cx', getX)
        .attr('r', getRadius)
        .style('opacity', 1)
        // .attr('fill', 'red')
        .attr('fill', get_circle_color)

    // useful rectangle for onhover
    gContainer.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('y', getY)
        .attr('x', d => 0)
        .attr('height', scaleY.bandwidth())
        .attr('width', d => chartWidth)
        .attr('fill', 'steelblue')
        .attr('fill-opacity', 0.1)
        .on('mouseover', (evt, d) => { // https://github.com/d3/d3-selection/issues/263
            const x = getX(d);
            verticalRedLine.attr('x1', x).attr('x2', x).style('opacity', 1);
            d3.select(evt.currentTarget).attr('fill', 'orange');
        })
        .on('mouseout', (evt, d) => {
            verticalRedLine.style('opacity', 0);
            d3.select(evt.currentTarget).attr('fill', 'steelblue');
        })
        .append('title')
        .text(d => d3.format(".2%")(d[value]));
}
