window.onload = main;

function main() {
    get_data();
}

function get_data() {
    const preprocess_data = (loadedData) => {
        loadedData.forEach(d => {
            d.age = +d.age;
            d.bmi = +d.bmi;
            d.children = +d.children;
            d.charges = +d.charges;
        })
        return loadedData
    }

    // JS Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
    d3.csv('./data/insurance.csv')
        .then(loadedData => render_data(preprocess_data(loadedData))
        ).catch(error => {console.error('SONO IL CATCH ECCO L\'ERRORE', error)});
}

const svgWidth = 1000;
const svgHeight = 500;

const margin = {top: 40, right: 60, bottom: 40, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function onDropdownChange() {
    console.log("DROPDOWN CHANGED")
    d3.select('svg').remove()
    get_data()
}
function render_data(data) {
    console.log("DATA LOADED", data)
    // YYYY-MM-DD --> %Y-%m-%d
    // DATA LOADED (1338) [{"age": "19", "sex": "female", "bmi": "27.9", "children": "0", "smoker": "yes", "region": "southwest", "charges": "16884.924"}, ...]
    const numericKeys = ["age", "bmi", "children", "charges"]
    const categoricalKeys = ["sex", "smoker", "region"]

    const var1  = d3.select('#xSelect').property('value')
    const var2 = d3.select('#ySelect').property('value')
    console.log("VAR1", var1)
    console.log("VAR2", var2)
    /////////////////
    const var1_is_numeric = numericKeys.includes(var1)
    const var2_is_numeric = numericKeys.includes(var2)


    const svg = d3.select("body").append("svg");

    const gContainer = svg
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    // scaleX will help us to map the date to the x position of the chart
    const x_left = 20;
    let scaleX;
    if (var1_is_numeric) {
        console.log("VAR1 NUMERIC")
        scaleX = d3.scaleLinear()
            // .domain(d3.extent(data, d => d[var1]))
            .domain([0, d3.max(data, d => d[var1])])
            .range([0, chartWidth])
            .nice()
    } else {
        console.log("VAR1 CATEGORICAL")
        scaleX = d3.scaleBand()
            .domain(data.map(d => d[var1]))
            .range([0, chartWidth])
            .padding(0.1)
    }

    // scaleY will help us to map the value to the y position of the chart
    let scaleY;
    if (var2_is_numeric) {
        console.log("VAR2 NUMERIC")
        scaleY = d3.scaleLinear()
            .domain(d3.extent(data, d => d[var2]))
            .range([chartHeight, 0])
            .nice()

    } else {
        console.log("VAR2 CATEGORICAL")
        scaleY = d3.scaleBand()
            .domain(data.map(d => d[var2]))
            .range([chartHeight, 0])
    }

    // Create the axes
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX))
        .append("text")
        .attr("fill", "#000")
        .attr("x", chartWidth)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text(var1)


    gContainer.append("g")
        .call(d3.axisLeft(scaleY))
        .append("text")
        .attr("fill", "#000")
        .attr("y", -10)
        .attr("text-anchor", "end")
        .text(var2)

    // Do a scatterplot
    const handleX = (d) => {
        if (var1_is_numeric) {
            return scaleX(d[var1])
        }
        return scaleX(d[var1]) + scaleX.bandwidth() / 2
    }
    const handleY = (d) => {
        if (var2_is_numeric) {
            return scaleY(d[var2])
        }
        return scaleY(d[var2]) + scaleY.bandwidth() / 2
    }
    gContainer
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", handleX)
        .attr("cy", handleY)
        // .attr("r", (_,i)=> JLib.get_random_int_between_A_and_B(1, 5))
        .attr("r",3)
        .attr("fill", "red")
        .attr('stroke', 'black')
}