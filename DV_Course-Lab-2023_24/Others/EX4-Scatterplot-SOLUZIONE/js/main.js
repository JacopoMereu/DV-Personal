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

    d3.csv('./data/insurance.csv')
        .then(loadedData => render_data(preprocess_data(loadedData)))
        .catch(error => {
            console.error('SONO IL CATCH ECCO L\'ERRORE', error)
        });
}

const svgWidth = 1000;
const svgHeight = 500;

const margin = {top: 40, right: 60, bottom: 40, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    // age,sex,bmi,children,smoker,region,charges
    console.log("DATA LOADED", data)
    const numericKeys = ["age", "bmi", "children", "charges"]
    const categoricalKeys = ["sex", "smoker", "region"]

    const var1 = "age"
    const var2 = "charges"

    const var1_is_numeric = numericKeys.includes(var1)
    const var2_is_numeric = numericKeys.includes(var2)

    console.log("VAR1", var1)
    console.log("VAR2", var2)
    ///////////////////////////

    const svg = d3.select("body").append("svg");

    const gContainer = svg
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const scaleX = d3.scaleLinear()
        .domain(d3.extent(data, d => d[var1]))
        .range([0, chartWidth])
        .nice()

    const scaleY = d3.scaleLinear()
        .domain(d3.extent(data, d => d[var2]))
        .range([chartHeight, 0])
        .nice()


    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX))
        .call(
            g => g.append("text")
                .style("fill", "black")
                .attr("x", chartWidth)
                .attr("y", 0)
                .style("text-anchor", "start")
                .style('dominant-baseline', 'text-after-edge')
                .text(var1.toUpperCase())
                // TODO Punto 4 (1/2)
                .style('font-weight', 'bold')
        )


    gContainer.append("g")
        .call(d3.axisLeft(scaleY))
        .call(g => g.append("text")
            .attr("fill", "black")
            .attr('x', 0)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .attr('dominant-baseline', 'text-after-edge')
            .text(var2.toUpperCase())
            // TODO Punto 4 (2/2)
            .style('font-weight', 'bold')
        )

    const handleX = (d) => scaleX(d[var1])
    const handleY = (d) => scaleY(d[var2])

    // TODO Punto 1 (1/2)
    const bmiScale = d3.scalePow().exponent(6)
        .domain(d3.extent(data, d => d.bmi))
        .range([3, 20])

    // TODO Punto 3 (1/2)
    const smokerScale = d3.scaleOrdinal()
        .domain(["yes", "no"])
        .range(["red", "green"])

    gContainer
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", handleX)
        .attr("cy", handleY)
        .attr("r", d => bmiScale(d.bmi)) // TODO Punto 1 (2/2)
        .style("fill", d => smokerScale(d.smoker)) // TODO Punto 3 (2/2)
        .style('stroke', 'black')
        // TODO Punto 2
        .append('title')
        .text(d => `BMI: ${d.bmi}`)
}