window.onload = main;

function main() {
    get_data();
}

function get_data() {
    d3.csv("./data/headsets.csv")
        .then(loadedData => {
            render_data(preprocess_data(loadedData))
        })
        .catch(error => console.error('SONO IL CATCH ECCO L\'ERRORE', error));
    const preprocess_data = (loadedData) => {
        loadedData.forEach(d => {
            d.ReleaseYear = d3.timeParse("%Y")(d["ReleaseYear"]);
            d.FullReleaseDate = d3.timeParse("%Y-%m-%d")(d["FullReleaseDate"]);
            d.Price = +d.Price;
        })
        loadedData.sort((a, b) => d3.ascending(a.Price, b.Price) || d3.ascending(a.ReleaseYear, b.ReleaseYear))
        return loadedData
    }


}

const svgWidth = 1907;
const svgHeight = 1060;

const margin = {top: 40, right: 70, bottom: 70, left: 80}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log("DATA LOADED", data)

    const maxPrice = d3.max(data, d => d.Price) * 1.3
    const minPrice = d3.min(data, d => d.Price)

    // Create the svg and the g container. There is a margin between the svg and the g container
    const svg = d3.select("body").append("svg");

    const gContainer = svg
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    // get the year before the min year and the year after the max year
    const minYear = d3.timeYear.offset(d3.min(data, d => d.ReleaseYear), -1)
    const maxYear = d3.timeYear.offset(d3.max(data, d => d.ReleaseYear), 1)
    // Create the scales and the axes
    const xScale = d3.scaleTime()
        .domain([minYear, maxYear])
        .range([0, chartWidth])
        .nice()

    const yScale = d3.scalePow()
        .exponent(1 / 2)
        .domain([0, maxPrice])
        .range([chartHeight, 0])
        .nice()

    const xAxis = d3.axisBottom(xScale)

    const handValues = [0, 20, 150, 300, 600, 900, 1200, 1500, 1800, 2100]
    const yAxis = d3.axisLeft(yScale)
        .tickValues(handValues)
    // .tickValues(data.map(d => d.Price)) // make ticks exactly the date price
    const rightYAxis = d3.axisRight(yScale)
        // .tickValues(data.map(d => d.Price)) // make ticks exactly the date price
        .tickValues(handValues)


    const h = chartHeight / 2
    const l = -margin.left / 1.1
    const font_size_axis_label = '24px'
    const font_size_axis_tick = '20px'



    // Define the hybrid gradient. But instead of doing first half red and second half blue, we will do "upper right diagonal" red and "lower bottom diagonal" blue
    const hybridGradient = gContainer.append('defs')
        .append('linearGradient')
        .attr('id', 'hybridGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%')
    hybridGradient.append('stop')
        .attr('offset', '50%')
        .style('stop-color', '#f28e2b')
    hybridGradient.append('stop')
        .attr('offset', '50%')
        .style('stop-color', '#4e79a7')


    // Set the color scale for the type of headset
    // first 3 color of tableau10
    const schemeCustom = ['#4e79a7', '#f28e2b', '#e15759', 'url(#hybridGradient)']
    const typeColorScale = d3.scaleOrdinal()
        .domain(['tethered', 'standalone', 'adapter', 'hybrid'])
        // .range(d3.schemeTableau10)
        // Define the range with schemeTableau10, but Hybrid will be a linear gradient, half the color of tethered and half the color of standalone
        .range(schemeCustom)


    // Y AXIS RIGHT
    gContainer.append('g')
        .attr('transform', `translate(${chartWidth}, 0)`)
        .call(rightYAxis)
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').clone()
            .attr('x2', -chartWidth)
            .attr('stroke-opacity', 0.1)
        )
        .call(g => g.selectAll('.tick text')
                .style('font-size', font_size_axis_tick)
            // .attr('x', 4)
            // .attr('dy', -4)
        )

    // Y AXIS LEFT
    const doYLabelVertical = true
    const yAxisContainer = gContainer.append('g')
        .call(yAxis)
        // Y AXIS TICKS TEXT SIZE
        .call(g => g.selectAll('.tick text')
            .style('font-size', font_size_axis_tick))
        // Y AXIS LABEL
        .append('text')
        .text('PRICE (€)')
        .attr('x', doYLabelVertical ? l : 0 - margin.left / 2.5)
        .attr('y', doYLabelVertical ? h : 0)
        .attr('transform', doYLabelVertical ? `rotate(-90, ${l}, ${h})` : '')
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'text-before-edge')
        .style('fill', 'black')
        .style('font-size', font_size_axis_label)



    // AXIS X BOTTOM
    const xAxisContainer = gContainer.append('g')
        .attr('transform', `translate(0, ${chartHeight + 10})`)
        .call(xAxis)
        // AXIS X TICKS TEXT SIZE
        .call(g => g.selectAll('.tick text')
            .style('font-size', font_size_axis_tick)
        )
        // AXIS X LABEL
        .append('text')
        .text('RELEASE YEAR')
        .attr('x', chartWidth / 2)
        .attr('y', margin.bottom / 2.5)
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .attr('dominant-baseline', 'text-before-edge')
        .style('fill', 'black')
        .style('font-size', font_size_axis_label)

    // Vertical thin lines (for the grid)
    const yAxisContaienr = gContainer.append('g')
        .call(d3.axisTop(xScale))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').clone()
            .attr('y2', chartHeight)
            .attr('stroke-opacity', 0.1)
        )
        .call(g => g.selectAll('.tick text')
            .style('font-size', font_size_axis_tick))
    // .call(g => g.selectAll('.tick text')
    //     .attr('y', -8)
    //     .attr('dy', 4)
    // )

    // Get the coordinate x of the 2nd tick of the x axis
    draw_content(data, gContainer, typeColorScale, xScale, yScale)

    draw_legend(data, gContainer, typeColorScale, xScale, yScale)
}

function draw_content(data, gContainer, typeColorScale, xScale, yScale) {
    // Create the image
    let imageOptions = {
        width: 130,
        height: 102
    }
    // extends options with getY and getX
    imageOptions = {
        ...imageOptions,
        getY: d => yScale(d.Price) - imageOptions.height / 2,
        getX: d => xScale(d.ReleaseYear) - imageOptions.width / 2
    }

    // DRAW THE IMAGES
    gContainer.append('g').classed('images', true)
        .selectAll('image')
        .data(data)
        .join('image')
        .attr('x', imageOptions.getX)
        .attr('y', imageOptions.getY)
        .attr('width', imageOptions.width)
        .attr('height', imageOptions.height)
        .attr('xlink:href', d => d.Img_url)
        .attr('id', d => d.Name)
        .attr('class', d => d.Id)

    // CREATE THE BACKGROUND RECT WITHOUT RENDERING
    gContainer.append('g').classed('background', true)
        .selectAll(null)
        .data(data)
        .join('rect')
        .attr('fill', 'none')
        // .attr('fill', 'white')
        .attr('stroke', d => typeColorScale(d.Type))
        .attr('stroke-width', 3)
        .attr('id', d => d.Name)
        .attr('class', d => d.Id)



    // DRAW THE DEVICE NAME ON TOP OF THE IMAGE
    gContainer.append('g').classed('texts', true)
        .selectAll('text')
        .data(data)
        .join('text')
        .text(d => d.Name)
        .attr('x', d => imageOptions.getX(d) + imageOptions.width / 2)
        .attr('y', d => imageOptions.getY(d) - 10)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'hanging')
        .attr('class', d => d.Id)

    // DRAW A RECTANGLE AROUND THE TEXT AND THE IMAGE
    gContainer.selectAll('g.images image').each(function (d, i) {
        // get the bounding box of the text
        // const rect = gContainer.append('rect')
        //     .attr('fill', 'none')
        //     // .attr('fill', 'white')
        //     .attr('stroke', typeColorScale(d.Type))
        //     .attr('stroke-width', 3)
        //     .attr('id', d.Name)
        // .lower()
        const rect = d3.select(this.parentNode.parentNode).select('.background>rect.' + d.Id)
        console.log('RECT', rect.node())
        const text = gContainer.select(`text.${d.Id}`)
        const bbox_text = text.node().getBBox()

        const bbox_image = this.getBBox()
        const padding = 11

        const x = d3.min([bbox_image.x, bbox_text.x - 1]),
            y = d3.min([bbox_image.y, bbox_text.y]),
            width = d3.max([bbox_image.width, bbox_text.width + 1]),
            height = bbox_image.height + bbox_text.height + padding;

        rect.attr('x', x)
            .attr('y', bbox_image.y - padding)
            .attr('width', width)
            .attr('height', bbox_image.height + padding)
    })
}

function draw_legend(data, gContainer, typeColorScale, xScale, yScale) {
    // Make a legend on the top left corner for the type of headsets
    // The legend will have a line for each type of headset
    const x2ndTick = xScale(xScale.ticks()[1])
    // Get the last but one (the one previous of the last) tick of the y axis
    // const y2ndTick = yScale(yScale.ticks()[yScale.ticks().length - 3])
    const y2ndTick = yScale(yScale.ticks()[10])

    const extraMargin = 10

    const rect_sizes = {width: 20, height: 20, x: 0, y: 0}
    const font_size = 20


    const headsetTypes = data.map(d => d.Type)
    // const uniqueHeadsetTypes = Array.from(new Set(headsetTypes))
    const uniqueHeadsetTypes = ["adapter", "tethered", "standalone", "hybrid"]

    const longest_text = d3.max(uniqueHeadsetTypes, d => d.length)
    const legend = gContainer.append('g')
        .classed('legend', true)
        .attr('transform', `translate(${x2ndTick + extraMargin}, ${y2ndTick + 2 * extraMargin})`)
    // Rect inside the legend
    const boundingBoxLegend = legend.append('rect').style('fill', 'white')

    // LEGEND TITLE
    legend.append('text')
        .text("Type of headset")
        .attr('y', -rect_sizes.height * (3 / 2))
        .attr('x', rect_sizes.x)
        .attr('fill', 'black')
        .style('font-weight', 'bold')
        .style('font-size', font_size)
        .style('dominant-baseline', 'hanging')

    const legendGroups = legend.selectAll('g')
        .data(uniqueHeadsetTypes)
        .join('g')
        .attr('transform', (d, i) => `translate(${0}, ${i * 1.5 * rect_sizes.height})`)
        .attr('class', d => d)

    legendGroups
        .append('rect')
        .attr('x', rect_sizes.x)
        .attr('y', rect_sizes.y)
        .attr('width', rect_sizes.width)
        .attr('height', rect_sizes.height)
        .attr('fill', typeColorScale)

    // LEGEND TEXT
    legendGroups
        .append('text')
        .text(d => d)
        .attr('x', rect_sizes.width * (3 / 2))
        .attr('fill', 'black')
        .style('font-size', font_size)
        .attr('dominant-baseline', 'hanging')

    // Make the rect legend as big as the legend
    const bbox = legend.node().getBBox()
    boundingBoxLegend
        .attr('x', bbox.x - extraMargin)
        .attr('y', bbox.y - extraMargin)
        .attr('width', bbox.width + 2 * extraMargin)
        .attr('height', bbox.height + 2 * extraMargin)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
}