window.onload = main;

function main() {
    // const data = get_our_data()
    const data = get_state_of_the_art_data();
    console.log('data', data)
    render_data(data);
}


function countElements(arr) {
    let counts = {};
    arr.forEach(function (element) {
        counts[element] = (counts[element] || 0) + 1;
    });

    let result = [];
    for (let key in counts) {
        result.push({label: key, count: counts[key]});
    }
    return result;
}

function get_our_data() {
    let data = [27, 23, 3, 5, 5, 3, 10, 7, 7, 6, 3, 3]
    // return data;
    return countElements(data)
}

function get_state_of_the_art_data() {
    let data = [22, 11, 11, 5, 14, 7, 7, 10, 8, 2, 5]
    // return data
    return countElements(data)
}

const svgWidth = 600;
// const svgHeight = 600;
const svgHeight = 620;

// const margin = {top: 40, right: 60, bottom: 40, left: 60}
const margin = {top: 40, right: 60, bottom: 50, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// Exercise from Lez2/2_data_binding/4
function render_data(data) {
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const key = 'label', value = 'count', orientation = 'vertical', sort = false
    render_bar_chart(svg, data, key, value, orientation, sort);


}

function render_bar_chart(svg, data, key, value, orientation, sort) {
    if (sort)
        data.sort((a, b) => d3.ascending(a[value], b[value]));

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // const orientation = 'vertical';
    const isVertical = orientation === 'vertical';
    let scaleX, scaleY;
    if (isVertical) {
        // scale-x
        scaleX = d3.scaleBand()
            .domain(data.map(d => d[key]))
            .range([0, chartWidth])
            .padding(0.1);
        // axis-x
        const gX = gContainer.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(scaleX))
        ;
        gX.append("text")
            .attr("fill", "#000")
            .attr("x", chartWidth / 2)
            // .attr("y", 30)
            .attr("y", 37)
            .attr("text-anchor", "middle")
            .text("QAs per cluster");
        //  scale-y
        scaleY = d3.scaleLinear()
            // .domain([0, d3.max(data, d => d[value])])
            .domain([0, 5])
            .range([chartHeight, 0])
        ;



        // bars
        const gContent = gContainer.append('g')
        gContent.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => scaleX(d[key]))
            .attr('y', d => scaleY(d[value]))
            .attr('width', scaleX.bandwidth())
            .attr('height', d => chartHeight - scaleY(d[value]))
            .attr('fill', d=>d[key]<5?'red':'#8eac95')
            // .on('mouseover', (evt, d) => { // https://github.com/d3/d3-selection/issues/263
            //     d3.select(evt.currentTarget)
            //         .attr('fill', 'orange');
            // })
            // .on('mouseout', (evt, d) => {
            //     d3.select(evt.currentTarget).attr('fill', 'steelblue');
            // })
            .append('title')
            .text(d => d[value])
        ;
        // axis-y
        const gY = gContainer.append('g')
            .call(d3.axisLeft(scaleY).ticks(5).tickSize(-chartWidth))
        gY
            .selectAll('line')
            .attr('stroke', 'lightgrey')
            .attr('stroke-dasharray', '10, 2');
        gY.append("text")
            .attr("fill", "#000")
            // .attr("transform", "rotate(-90)")
            // .attr("y", -10)
            .attr("y", -15)
            .attr("x", 10)
            .attr("text-anchor", "middle")
            .text("Cluster counts")
    } else {
        // scale-x
        scaleX = d3.scaleBand()
            .domain(data.map(d => d[key]))
            .range([0, chartHeight])
            .padding(0.1);
        // axis-x
        gContainer.append('g')
            .attr('transform', `translate(0, ${0})`)
            .call(d3.axisLeft(scaleX));
        //  scale-y
        scaleY = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[value])])
            .range([0, chartWidth]);
        // axis-y
        gContainer.append('g')
            .call(d3.axisTop(scaleY)
                    .ticks(null, ".2s")
                    .tickSize(-chartHeight)
                // .tickFormat(d3.format(".2s"))
                // .tickFormat(d=> d/1000000 + 'M')
            )
            .selectAll('line')
            .attr('stroke', 'lightgrey')
            .attr('stroke-dasharray', '10, 2')
        // bars
        gContainer.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('y', d => scaleX(d[key]))
            .attr('x', d => 0)
            .attr('height', scaleX.bandwidth())
            .attr('width', d => scaleY(d[value]))
            .attr('fill', 'steelblue')
            .on('mouseover', (evt, d) => { // https://github.com/d3/d3-selection/issues/263
                d3.select(evt.currentTarget)
                    .attr('fill', 'orange');
            })
            .on('mouseout', (evt, d) => {
                d3.select(evt.currentTarget).attr('fill', 'steelblue');
            })
            .append('title')
            .text(d => d[value])
        ;
    }
}