window.onload = main;

function main() {
    get_data()
}

function get_data() {
    d3.json('./data/data.json').then(data => {
        render_data(data)
    }).catch(err => {
        console.error(err)
    })
}

const svgWidth = 650;
const svgHeight = 650;

const margin = {top: 40, right: 40, bottom: 40, left: 80}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    const plot  = Plot.barX(data, {
        x: "frequency",
        y: "letter",
        fill: (d, i) => d.frequency > 0.05 ? "steelblue" : "darkgray",
        // fill: (d, i) => d3.schemeCategory10[i % 10],
    }).plot()
    d3.select('#myplot').node().append(plot);
}