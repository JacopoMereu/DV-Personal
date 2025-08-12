window.onload = main;

function main() {
    get_data();
}

function get_data() {
    d3.json('./data/data.json')
        .then(data => render_data(data))
        .catch(err => console.log(err));
}

const svgWidth = 650;
const svgHeight = 650;

const margin = {top: 40, right: 40, bottom: 40, left: 80}
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

    const get_link_label = d => `${d.source} -> ${d.target}`

    const linksG = gContainer
        .selectAll(null)
        .data(data.links)
        .join("g")
        .classed('link', true)

    // TODO Punto 1 (1/2)
    const scaleColorNodes = d => d.id % 2 === 0 ? "brown" : "pink"
    const scaleColorArcs = d => d.source > d.target ? "red" : "green" // TODO Punto 3 (1/2)

    const arcs = linksG
        .append("line")
        // .style("stroke", "lightgray")
        .style("stroke", scaleColorArcs) // TODO Punto 3 (2/2)

    // TODO Punto 2
    const count_incident_arcs = d => data.links.filter(link => link.source === d.id || link.target === d.id).length
    const get_radius = d => count_incident_arcs(d) * 6

    const arc_labels = linksG
        .append("text")
        .text(get_link_label)
        .style("font-size", 15)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "baseline")
        .style("user-select", "none")
        .style("font-style", "italic") // TODO Punto 4


    const nodesG = gContainer
        .selectAll(null)
        .data(data.nodes)
        .join("g")
        .classed('node', true)

    const nodes = nodesG
        .append("circle")
        // .attr("r", 20)
        .attr("r", get_radius) // TODO Punto 3
        .style("fill", "lightskyblue")
        .style("fill", scaleColorNodes) // TODO Punto 1 (2/2)

    const node_labels = nodesG
        .append("text")
        .text(d => d.id)
        .style("fill", "black")
        .style("font-size", 15)
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("user-select", "none")


    function get_simulation(data) {
        return d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink()
                .id(d => d.id)
                .links(data.links)
                .distance(100)
            )
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(chartWidth/2, chartHeight / 2))
    }

    function ticked() {
        arcs
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x )
            .attr("y2", d => d.target.y);

        nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)

        node_labels
            .attr("x", d => d.x)
            .attr("y", d => d.y)

        arc_labels
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2)
    }

    const simulation = get_simulation(data)
        .on("tick", ticked);

    nodesG.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();

        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0).restart();
        event.subject.fx = null;
        event.subject.fy = null;
    }
}