window.onload = main;

function main() {
    get_data();
}

function get_data() {
     /**
     * Esercizio:
     * 1. age, bmi, children, charges sono delle stringhe, dobbiamo convertirle in numeri
     */
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
        .then(loadedData => render_data(preprocess_data(loadedData)))
        .catch(error => {console.error('SONO IL CATCH ECCO L\'ERRORE', error)});
}

const svgWidth = 1000;
const svgHeight = 500;

const margin = {top: 40, right: 60, bottom: 40, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log("DATA LOADED", data)

    // DATA LOADED (1338) [{"age": "19", "sex": "female", "bmi": "27.9", "children": "0", "smoker": "yes", "region": "southwest", "charges": "16884.924"}, ...]
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

    /**
     * Esercizio:
     * 1. Creare una scala lineare (d3.scaleLinear) per mappare var1 alla posizione x del chart
     */
    // scaleX will help us to map the date to the x position of the chart
    const scaleX = d3.scaleLinear()
        .domain(d3.extent(data, d => d[var1]))
        // .domain([0, d3.max(data, d => d[var1])])
        .range([0, chartWidth])
        .nice()

    /**
     * Esercizio:
     * 1. Creare una scala lineare (d3.scaleLinear) per mappare var2 alla posizione y del chart
     */
    // scaleY will help us to map the value to the y position of the chart
    const scaleY = d3.scaleLinear()
            .domain(d3.extent(data, d => d[var2]))
            .range([chartHeight, 0])
            .nice()


     // Create the axes

    /**
     * Esercizio:
     * 1. Disegnare l'asse x (d3.axisBottom) con la scala scaleX e dagli var1 come label
     */
    // AXIS X
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX))
        // Add the label
        .append("text")
        .attr("fill", "black")
        .attr("x", chartWidth)
        .attr("y", "-5px")
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')
        .text(var1.toUpperCase())


    // AXIS Y
    /**
     * Esercizio:
     * 1. Disegnare l'asse y (d3.axisLeft) con la scala scaleY e dagli var2 come label
     */
    gContainer.append("g")
        .call(d3.axisLeft(scaleY))
        // Add the label
        .append("text")
        .attr("fill", "black")
        .attr('x', 0) // Volendo si può cancellare in quanto è la posizione di default
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr('dominant-baseline', 'text-after-edge')
        .text(var2.toUpperCase())

    /**
     * Esercizio:
     * 1. Crea la funzione handleX che mappa il valore di var1 alla posizione x del chart
     * 2. Crea la funzione handleY che mappa il valore di var2 alla posizione y del chart
     */
    // Do a scatterplot
    const handleX = (d) => scaleX(d[var1])

    const handleY = (d) => scaleY(d[var2])

    gContainer
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", handleX)
        .attr("cy", handleY)
        .attr("fill", "red")
        .attr('stroke', 'black')
        .attr("r", 3) // TODO Comment this line to see the effect
        // .attr("r", (_,i)=> JLib.get_random_int_between_A_and_B(1, 5)) // TODO De-comment this line to see the effect
        // .attr('opacity', 0.5) // TODO De-comment this line to see the effect
}