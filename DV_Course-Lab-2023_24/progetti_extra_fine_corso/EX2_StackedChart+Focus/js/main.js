window.onload = main;

async function main() {
    const data = await get_data();
    render_data(data);
}

async function get_data() {
    return await d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv");
}

const svgWidth = 650;
const svgHeight = 700;

const margin = {top: 20, right: 20, bottom: 40, left: 50}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    /** data =
     * [
     *     {
     *         "group": "banana",
     *         "Nitrogen": "12",
     *         "normal": "1",
     *         "stress": "13"
     *     },
     *     {
     *         "group": "poacee",
     *         "Nitrogen": "6_NOP",
     *         "normal": "6_NOP",
     *         "stress": "33"
     *     },
     *     {
     *         "group": "sorgho",
     *         "Nitrogen": "11",
     *         "normal": "28",
     *         "stress": "12"
     *     },
     *     {
     *         "group": "triticum",
     *         "Nitrogen": "19",
     *         "normal": "6_NOP",
     *         "stress": "1"
     *     }
     * ]
     */

    /**
     * data.columns = ["group", "Nitrogen", "normal", "stress"]
     * category_name = "group"
     * subgroup_names = ["Nitrogen", "normal", "stress"]
     */
    const [maingroup_key, subgroup_keys] = [data.columns[0], data.columns.slice(1)];

    /*** groups = ["banana", "poacee","sorgho", "triticum"] */
    const groups = data.map(d => (d.group))

    /**
     * sums = [ 26, 45, 51, 26 ]
     * max_sum = 51
     * range = [0, 51 + ...]
     */
    const sum_per_bar = data.map(obj => d3.sum(subgroup_keys.map(subgroup_key => +obj[subgroup_key])));
    const max_sum = d3.max(sum_per_bar), bar_margin = 1;
    const range = [0, max_sum + bar_margin];

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroup_keys)
        .range(d3.schemeTableau10)

    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // scale-x
    const scaleX = d3.scaleBand()
        .domain(groups)
        .range([0, chartWidth])
        .padding(0.2);
    // axis-x
    gContainer.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(
            d3.axisBottom(scaleX)
                .tickSizeOuter(0)
        ).classed('x-axis', true);
    //  scale-y
    const scaleY = d3.scaleLinear()
        .domain(range)
        .range([chartHeight, 0]);
    // axis-y
    gContainer.append('g')
        .call(d3.axisLeft(scaleY)
            .tickSize(-chartWidth)
            .tickSizeOuter(0)
        ).classed('y-axis', true)

    /** We need to stack the data, d3 has a helper for that
     * stackedData = [
     *     [[0, 12], [0, 6_NOP], [0, 11], [0, 19]], // key: "Nitrogen"
     *     [[12, 13], [6_NOP, 12], [11, 39], [19, 25]], // key: "normal"
     *     [[13, 26], [12, 45], [39, 51], [25, 26]], // key: "stress"
     * ]
     */
    const stack = d3.stack().keys(subgroup_keys);
    const stackedData = stack(data)

    // Show the bars
    const groupG = gContainer.append("g")
        .selectAll(null)
        // Enter in the stack data = loop key per key = group per group
        // e.g. 'Nitrogen': [[0, 12], [0, 6_NOP], [0, 11], [0, 19]], key: "Nitrogen"
        .data(stackedData)
        .join("g")
        .attr("fill", subgroup => color(subgroup.key))
        .attr("class", d => "myRect " + d.key);


    // Create a rect for each subgroup
    const rects = groupG.selectAll(null)
        // enter a second time = loop subgroup per subgroup to add all rectangles
        // [0, 12], data = {"group": "banana", "Nitrogen": "12", "normal": "1", "stress": "13" }
        .data(d => d)
        .join("rect")
        .attr("x", d => scaleX(d.data.group))
        .attr("y", d => scaleY(d[1]))
        .attr("height", d => scaleY(d[0]) - scaleY(d[1]))
        .attr("width", scaleX.bandwidth())
        .on("mouseover", function (event, d) {
            const subGroupDatum = d3.select(this.parentNode).datum();
            const subgroupName = subGroupDatum.key;
            const groupName = d.data.group;
            const subgroupValue = d.data[subgroupName];
            console.log(`[mouseover] ${groupName} ${subgroupName} ${subgroupValue}`)

            // Reduce opacity of all rect to 0.2
            d3.selectAll(".myRect").style("opacity", 0.2)

            // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
            d3.selectAll("." + subgroupName).style("opacity", 1)
        })
        .on("mouseleave", function (event, d) { // When user do not hover anymore
            // Back to normal opacity: 1
            d3.selectAll(".myRect")
                .style("opacity", 1)
        })

    // Add a text for each rect
    const texts = groupG.selectAll(null)
        .data(d => d)
        .join("text")
        .text(function (d) {
            const k = d3.select(this.parentNode).datum().key
            return d.data[k]
        })
        .attr("x", d => scaleX(d.data.group) + scaleX.bandwidth() / 2)
        .attr("y", d => (scaleY(d[0]) + scaleY(d[1])) / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black")
}