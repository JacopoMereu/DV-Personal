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
            d.Price = +d.Price;
        })
        loadedData.sort((a, b) => d3.ascending(a.Price, b.Price) || d3.ascending(a.ReleaseYear, b.ReleaseYear))
        return loadedData
    }


}

const svgWidth = 650;
const svgHeight = 500;

const margin = {top: 40, right: 60, bottom: 40, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log("DATA LOADED", data)
    // group the data by the Price
    const dataGrouped = d3.group(data, d => d.Price)
    console.log("DATA GROUPED", dataGrouped)

    const maxPrice = d3.max(data, d => d.Price)
    const minPrice = d3.min(data, d => d.Price)

    // Create the svg and the g container. There is a margin between the svg and the g container
    const svg = d3.select("body").append("svg");

    const gContainer = svg
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Create an horizontal scale for the Price
    const xScale = d3.scaleLinear()
        .domain([minPrice, maxPrice])
        .range([0, chartWidth])

    // draw an horizontal line for the price, with a vertical line for each data price.
    // Alternate the vertical line to be above and below the horizontal line to avoid overlapping
    const line = gContainer.append("line")
        .attr("x1", 0)
        .attr("x2", chartWidth)
        .attr("y1", chartHeight / 2)
        .attr("y2", chartHeight / 2)
        .attr("stroke", "black")
        .attr("stroke-width", 2)

    const isUp = (d,i) => i % 2 === 0
    const verticalLines = gContainer.selectAll(null)
        .data(dataGrouped)
        .join("line")
        .attr("x1", d => xScale(d[0]))
        .attr("x2", d => xScale(d[0]))
        .attr("y1", (d,i) => {
            const offset = 1
            if (isUp(d,i)) {
                return chartHeight / 2 + offset
            } else {
                return chartHeight / 2 - offset
            }
        })
        .attr("y2", (d,i) => {
            const offset = 10
            if (isUp(d,i)) {
                return chartHeight / 2 - offset
            } else {
                return chartHeight / 2 + offset
            }
        })
        .attr("stroke", "black")
        .attr("stroke-width", 2)

    // Add the text for the price
    const priceText = gContainer.selectAll(null)
        .data(dataGrouped)
        .join("text")
        .attr("x", d => xScale(d[0]))
        .attr("y", (d,i) => {
            const offset = 20
            if (isUp(d,i)) {
                return chartHeight / 2 - offset
            } else {
                return chartHeight / 2 + offset
            }
        })
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .text(d => d[0])
}