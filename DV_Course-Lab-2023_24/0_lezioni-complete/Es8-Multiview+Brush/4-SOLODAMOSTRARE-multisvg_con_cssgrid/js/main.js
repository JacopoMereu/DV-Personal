window.onload = main;

function main() {
    // color_divs();
    get_data();
}

function color_divs() {
    const divs = document.querySelectorAll('div');
    for (let i = 0; i < divs.length; i++) {
        divs[i].style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    }

}

function get_data() {
    const preprocessed_data = data => data.map(d => ({...d, time: +d.time, distance: +d.distance}))
    return d3.csv('./data/data.csv')
        .then(data => init_render(preprocessed_data(data)))
        .catch(err => console.log(err));
}

let difficultyFilter = ['Easy', 'Intermediate', 'Difficult'];
let original_data;
const config = {
    leftChart: {margin: {top: 40, right: 40, bottom: 40, left: 40}},
    rightChart: {margin: {top:40, right: 20, bottom: 40, left: 50}}
}

function init_render(data) {
    console.log("DATA LOADED", data)
    original_data = data;

    const svgBarChart = d3.select('svg#barchart')
    const svgScatterplot = d3.select('svg#scatterplot')
    const scaleColorDifficulty = d3.scaleOrdinal()
        .domain(['Easy', 'Intermediate', 'Difficult'])
        .range(["#29CD29", "#CDCD29", "#FF2929"])

    init_scatterplot(svgScatterplot, data, config.leftChart, scaleColorDifficulty, 'distance', 'time')
    init_histogram(svgBarChart, data, config.rightChart, scaleColorDifficulty, 'difficulty', true)

    d3.selectAll('.rects rect')
        .classed('clicked', d => difficultyFilter.includes(d[0]))

    function update_render(data) {
        console.log("NEW DATA", data)
        d3.select('svg > g.scatterplot').remove()
        init_scatterplot(svgBarChart, data, config.leftChart, scaleColorDifficulty, 'distance', 'time')
    }

    const on_click = function (evt, d) {
        console.log("D ", d)
        const isBarAlreadyClicked = difficultyFilter.includes(d[0]);
        if (isBarAlreadyClicked) {
            // remove key from array
            difficultyFilter = difficultyFilter.filter(x => x !== d[0])
        } else {
            // push key in array
            difficultyFilter.push(d[0])
        }
        // add/remove the class 'clicked' from the currect bar (rect)
        d3.select(this).classed('clicked', difficultyFilter.includes(d[0]))
        update_render(original_data.filter(d => difficultyFilter.includes(d.difficulty)))
    }
    d3.selectAll('.rects rect')
        .on('click', on_click)
}

function init_scatterplot(container, data, config, scaleColorDifficulty, key1, key2) {
    const chartWidth = container.style('width').split('px')[0] - config.margin.left - config.margin.right;
    const chartHeight = container.style('height').split('px')[0] - config.margin.top - config.margin.bottom;

    const gContainer = container
        .append('g')
        .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`)
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .classed('scatterplot', true)

    const scaleX = d3.scaleLinear()
        .domain([0, d3.max(original_data, d => d[key1])])
        .range([0, chartWidth])
        .nice()

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(original_data, d => d[key2])])
        .range([chartHeight, 0])
        .nice()

    // Create the axes
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(
            d3.axisBottom(scaleX)
                .ticks(5)
                .tickFormat(d => d + ' km')
                .tickPadding(5)
        )
        .append("text")
        .attr("x", chartWidth)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text(key1);


    gContainer.append("g")
        .classed('y-axis', true)
        .call(
            d3.axisLeft(scaleY)
                .tickSizeInner(-chartWidth)
                .tickPadding(10)
        )
        .append("text")
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')
        .text(key2)

    // Do a scatterplot
    const useSymbols = !true;
    if (!useSymbols) {
        gContainer
            .append("g")
            .selectAll(null)
            .data(data)
            .join("circle")
            .attr("cx", d => scaleX(d[key1]))
            .attr("cy", d => scaleY(d[key2]))
            .attr("r", 5)
            .attr("fill", d => scaleColorDifficulty(d.difficulty))
            .attr('stroke', 'black')
    }
    else {
        const scaleSymbols = d3.scaleOrdinal()
            .domain(["Easy", "Intermediate", "Difficult"])
            .range([
                d3.symbol().type(d3.symbolCircle),
                d3.symbol().type(d3.symbolSquare),
                d3.symbol().type(d3.symbolDiamond)
            ])

        gContainer.append('g').classed('circles', true)
            .selectAll(null)
            .data(data)
            .join('path')
            .attr('class', 'symbol')
            .attr('transform', d => `translate(${scaleX(d[key1])}, ${scaleY(d[key2])})`)
            .attr('d', d => scaleSymbols(d.difficulty)())
            .attr("fill", d => scaleColorDifficulty(d.difficulty))
    }
}


function init_histogram(container, data, config, scaleColorDifficulty, key, sort_bars) {
    console.log("RENDER BARCHART config", config)
    const chartWidth = container.style('width').split('px')[0] - config.margin.left - config.margin.right;
    const chartHeight = container.style('height').split('px')[0] - config.margin.top - config.margin.bottom;

    const gContainer = container
        .append('g')
        .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`)
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .classed('barchart', true)

    const aggregatedDataMap = d3.rollups(data, g => g.length, d => d.difficulty);
    // sort data
    if (sort_bars)
        aggregatedDataMap.sort((a, b) => d3.ascending(a[1], b[1]));
    console.log("AGGREGATED DATA", aggregatedDataMap)
    // scale-x
    const scaleX = d3.scaleBand()
        .domain(aggregatedDataMap.map(d => d[0]))
        .range([0, chartWidth])
        .padding(0.1);
    // axis-x
    gContainer.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(scaleX));

    //  scale-y
    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(aggregatedDataMap, d => d[1])])
        .range([chartHeight, 0])
        .nice();
    // axis-y
    gContainer.append('g')
        .call(d3.axisLeft(scaleY)
            // .ticks(null, "s")
            .tickSize(-chartWidth)
        )
        .append("text")
        .text("Trails")
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')


    const get_x = d => scaleX(d[0])
    const get_y = d => scaleY(d[1])
    const get_width = d => scaleX.bandwidth()
    const get_height = d => chartHeight - scaleY(d[1])

    // bars
    gContainer.append('g').classed("rects", true).selectAll('rect')
        .data(aggregatedDataMap)
        .join('rect')
        .attr('x', get_x)
        .attr('y', get_y)
        .attr('width', get_width)
        .attr('height', get_height)
        .attr('fill', d => scaleColorDifficulty(d[0]))
        .append('title')
        .text(d => d[1])
}