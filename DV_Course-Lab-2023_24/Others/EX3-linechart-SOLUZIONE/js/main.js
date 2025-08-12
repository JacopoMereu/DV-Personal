window.onload = main;

function main() {
    get_data();
}

function get_data() {
    d3.csv('./data/data.csv')
        .then(loadedData => {
            render_data(preprocess_data(loadedData))
        })
        .catch(error => console.error('SONO IL CATCH ECCO L\'ERRORE', error));

    const preprocess_data = (loadedData) => {
        const our_string_format = '%Y-%m-%d'
        const timeParser = d3.timeParse(our_string_format);
        return loadedData
            .map(o => ({...o, 'date': timeParser(o['date']), 'value': +o['value']}))
            .filter((o, i) => {
                // Don't worry about this, it's just to avoid having too many points. It's not important for the exam
                if (i === 0) return true;
                const previous = loadedData[i - 1];
                const valueDifference = Math.abs(o.value - previous.value);
                const relativeTh = previous.value * 0.1;
                const absoluteTh = 500;
                return valueDifference > relativeTh || valueDifference > absoluteTh;
            });
    }


}

const svgWidth = 1400;
const svgHeight = 900;

const margin = {top: 40, right: 60, bottom: 40, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const gContainer = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    const scaleX = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, chartWidth])
        .nice()

    const scaleY = d3.scaleLinear()
        .domain(d3.extent(data, d => d.value))
        .range([chartHeight, 0])
        .nice()

    gContainer
        .append("path")
        .datum(data)
        .attr("fill", "none")
        // TODO Punto 5
        // .attr("stroke", "lightskyblue")
        .attr("stroke", "black")
        .attr("d", d3.line()
            .x(d => scaleX(d.date))
            .y(d => scaleY(d.value))
        )


    gContainer.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(scaleX));


    gContainer.append("g")
        .call(
            d3.axisLeft(scaleY)
                // Commento presente solo nella soluzione: https://d3js.org/d3-format#formatSpecifier
                .tickFormat(d3.format(".2s")) // TODO Punto 2
                .ticks(5) // TODO Punto 3
        )
        // TODO 1
        .call(g => g.append('text')
            .style('fill', 'black')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('alignment-baseline', 'after-edge')
            .attr('y', -margin.top/3)
            .text("Value")
        )

    // TODO Punto 4
    gContainer
        .selectAll(null)
        .data(data)
        .join("circle")
        .attr("cx", d => scaleX(d.date))
        .attr("cy", d => scaleY(d.value))
        .attr("r", 5)
        .attr("fill", "red")
}