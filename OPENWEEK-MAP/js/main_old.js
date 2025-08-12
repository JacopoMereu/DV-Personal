window.onload = main;

function main() {
    get_GeoJSON_data()
}

function get_GeoJSON_data() {
    Promise.all([
        d3.json("./data/europe.geojson"),  // Europe shape
        // d3.json("./data/world.geojson"),  // World shape
        d3.csv("./data/data_connectionmap2.csv") // Position of circles
    ])
        .then(([geo, connection]) => render_data(geo, connection))
        .catch(err => console.log(err));
}

const svgWidth = 1500;
const svgHeight = 930;

const margin = {top: 20, right: 20, bottom: 20, left: 20}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(dataGeo,data) {
    console.log("DATA LOADED", data)

    const svg = d3.select("body")
        .append("svg")
        .style('width', svgWidth)
        .style('height', svgHeight);

    svg.on("contextmenu", function(event){
        event.preventDefault()
        // toggle class "hidden" to show/hide scrollbars
        const b = d3.select('body');
        b.classed("hidden", !b.classed("hidden"));
    })
    const gContainer = svg
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Map and projection
    const projection = d3.geoEquirectangular()
        .fitSize([chartWidth, chartHeight], dataGeo)
        // .scale(600)
        // .translate([chartWidth/2, chartHeight/2])

// A path generator
    const path = d3.geoPath()
        .projection(projection)


    // Reformat the list of link. Note that columns in csv file are called long1, long2, lat1, lat2
    const link = []
    data.forEach(function(row){
        names = [row.name1, row.name2]
        source = [+row.long1, +row.lat1]
        target = [+row.long2, +row.lat2]
        text2_offset = [+row.text2dx, +row.text2dy]
        topush = {type: "LineString", coordinates: [source, target], names: names, text2_offset: text2_offset}
        link.push(topush)
    })

    // Draw the map
    gContainer
        .selectAll("path")
        .data(dataGeo.features)
        .join("path")
        .attr("fill", "#b8b8b8")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", 0)

    // Add the path
    gContainer.selectAll("myPath")
        .data(link)
        .join("path")
        .attr("d", function(d){ return path(d)})
        .style("fill", "none")
        .style("stroke", "#69b3a2")
        .style("stroke-width", 1)
        // .style("opacity", 0.1)

    // Draw the destination points of links as circle
    gContainer.selectAll(null)
        .data(link)
        .join("circle")
        .attr("cx", function(d){ return projection(d.coordinates[1])[0] })
        .attr("cy", function(d){ return projection(d.coordinates[1])[1] })
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .attr("stroke-width", 1)

    // Add a rect behind the destination points text
    gContainer.selectAll(null)
        .data(link)
        .join("rect")
        // .attr("x", d => projection(d.coordinates[1])[0] - 30)
        // .attr("y", d => projection(d.coordinates[1])[1] - 20)
        // .attr("width", 60)
        // .attr("height", 20)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("class", (d,i) => "rect" + i)
    // Add a text label for the destination points
    const texts = gContainer.selectAll(null)
        .data(link)
        .join("text")
        .attr("x", d => projection(d.coordinates[1])[0])
        .attr("y", d  => projection(d.coordinates[1])[1])
        .text(d => d.names[1])
        .attr("dy", (d,i)=> d.text2_offset[1]-7)
        .attr("dx", (d,i)=> d.text2_offset[0])
        .style("fill", "#69b3a2")
        .attr("class", (d,i) => "text" + i)

    // For each texts, get the bounding box, select the corresponding rect and update its position
    texts.each(function(d,i){
        const bbox = this.getBBox()
        gContainer.select(".rect" + i)
            .attr("x", bbox.x - 2)
            .attr("y", bbox.y - 2)
            .attr("width", bbox.width + 4)
            .attr("height", bbox.height + 4)
    })

    // Make a single red circle for Cagliari
    gContainer.append("circle")
        .attr("cx", projection([9.1167, 39.2238])[0])
        .attr("cy", projection([9.1167, 39.2238])[1])
        .attr("r", 7)
        .style("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
    // // Add a text label for Cagliari
    // gContainer.append("text")
    //     .attr("x", projection([9.1167, 39.2238])[0])
    //     .attr("y", projection([9.1167, 39.2238])[1])
    //     .text("Cagliari")
    //     .attr("dy", -10)
    //     .style("fill", "red")

}