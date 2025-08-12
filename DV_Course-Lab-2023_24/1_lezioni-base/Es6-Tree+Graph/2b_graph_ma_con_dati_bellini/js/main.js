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
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    /** Esercizio: L'arco avrà un colore diverso in base al tipo di transazione:
     * 1. Ottieni i tipi di transazioni uniche
     * 2. Assegna un colore diverso ad ogni stringa univoca (scala ordinale) */
    // TODO Write here // 1
    // TODO Write here // 2

    const linksG = gContainer
        .selectAll(null)
        .data(data.links)
        .join("g")
        .classed('link', true)

    // TODO Guarda qui
    const arcs = linksG
        .append("line")
        .style("stroke", d => arc_color(d.transaction))
        .style("stroke-width", d => d.transaction === "handover" ? 2 : 4)
        .style("stroke-dasharray", d => d.transaction === "handover" ? 5 : 0)

    // 6
    const arc_labels = linksG
        .append("text")
        .text(d => d.transaction)
        .style("font-size", 15)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "baseline")
        .style("user-select", "none") // disable selection

    // 3
    const nodesG = gContainer
        .selectAll(null)
        .data(data.nodes)
        .join("g")
        .classed('node', true)

    // 3
    const nodes = nodesG
        .append("circle")
        .attr("r", 20)
        .style("fill", "white")
        .style("stroke", "black")

    // 4
    const node_labels = nodesG
        .append("text")
        .text(d => d.name)
        .style("fill", "black")
        .style("font-size", 15)
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("user-select", "none") // disable selection


    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        arcs
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
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

    // Let's list the force we want to apply on the network
    const simulation = get_simulation(data)
        .on("tick", ticked);

    // Add a drag behavior.
    nodesG.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0).restart();
        event.subject.fx = null;
        event.subject.fy = null;
    }
}

function get_simulation(data) {
    return d3.forceSimulation(data.nodes)             // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                       // This force provides links between nodes
            .id(d => d.id)                                        // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
            .distance(200)                                          // This is the length of the link
        )
        .force("charge", d3.forceManyBody().strength(-1000))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))     // This force translate nodes to the center of the svg area
        .force("x", d3.forceX(chartWidth / 2))
        .force("y", d3.forceY(chartWidth / 2))
}