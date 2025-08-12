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
    /**
     * Esercizio:
     * 1. Crea un gruppo per ogni link.
     * 2. Crea un gruppo per ogni nodo.
     * 3. Aggiungi un cerchio per ogni nodo. fill: lightskyblue, r: 20
     * 4. Aggiungi un testo per ogni nodo. font-size: 15, text-anchor: middle, alignment-baseline: central
     * 5. Aggiungi una linea per ogni link.
     * 6. Aggiungi un testo per ogni link.
     */
    // 1
    const linksG = gContainer
        .selectAll(null)
        .data(data.links)
        .join("g")
        .classed('link', true)

    // 2
    const arcs = linksG
        .append("line")
        .style("stroke", "lightgray")

    // 6
    const arc_labels = linksG
        .append("text")
        .text(get_link_label)
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
        .style("fill", "lightskyblue")

    // 4
    const node_labels = nodesG
        .append("text")
        .text(d => d.id)
        .style("fill", "black")
        .style("font-size", 15)
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("user-select", "none") // disable selection


    // This function returns a simulation with the data passed as argument.
    function get_simulation(data) {
        return d3.forceSimulation(data.nodes)             // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()                       // This force provides links between nodes
                .id(d => d.id)                                        // This provide  the id of a node
                .links(data.links)                                    // and this the list of links
                .distance(200)                                          // This is the length of the link
            )
            .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter(chartWidth/2, chartHeight / 2))     // This force translate nodes so that their mean is the center of the svg area
            .force("x", d3.forceX(chartWidth/2)) // this force force the points towards the position assigned (cx)
            .force("y", d3.forceY(chartWidth/2)) // this force force the points towards the position assigned (cy)
    }

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        /**
         * After passing the data to the simulation, the simulation will calculate the new position of the nodes and links.
         * Each node will now have the properties x, y, vx, and vy.
         * */


        /**
         * Esercizio: Aggiorna il rendering della posizione di ogni nodo e link.
         * 1. Aggiorna la posizione di ogni link.
         * 2. Aggiorna la posizione di ogni nodo.
         * 3. Aggiorna la posizione di ogni testo del nodo.
         * 4. Aggiorna la posizione di ogni testo del link.
         */
        // 1
        arcs
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x )
            .attr("y2", d => d.target.y);

        // 2
        nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)

        // 3
        node_labels
            .attr("x", d => d.x)
            .attr("y", d => d.y)

        // 4
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


    /**
     * event.active is 0 when the drag starts or ends. 1 when during the drag. [https://d3js.org/d3-drag#drag-events]
     *
     * alphaTarget changes the current alpha value to the target value over the course of the next animation frame. [https://d3js.org/d3-force/simulation#simulation_alphaTarget]
     * alpha determines the "temperature" of the simulation. By default, it decreases slowly over time, leading to a slow cooling of the system. [https://d3js.org/d3-force/simulation#simulation_alpha]
     *
     * fx, fy: fixed position. At the end of the tick, if a node has a defined fx and fy, the node will be moved to that position.
     * if the fx and fy are null, the node will be "unfixed" and the simulation will move it. [https://d3js.org/d3-force/simulation#simulation_nodes]
     * */
    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart(); // what the documentation says
        // simulation.alphaTarget(0.3).restart(); // but you can simply do this

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