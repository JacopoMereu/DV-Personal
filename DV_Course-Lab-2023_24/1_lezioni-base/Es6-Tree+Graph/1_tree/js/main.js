window.onload = main;

function main() {
    get_data();
}

function get_data() {
    d3.json('./data/data.json')
        .then(data => render_data(data))
        .catch(err => console.log(err));
}

const svgWidth = 1000;
const svgHeight = 800;

const margin = {top: 40, right: 40, bottom: 40, left: 40}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log(data);

    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const gContainer = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
    // M2
    // .append('g')
    // .attr('transform', `translate(${chartWidth/2}, ${0})`);

    const reduce_fn = (group) => {
        // console.log("group", group);

        const opt =  2;
        if (opt === 1) {
            // return group.length
            return group.reduce((acc, curr) => acc + 1, 0)
        }
        else if (opt === 2) {
            // return d3.sum(group, d => d.Worldwide_Gross)
            return group.reduce((acc, curr) => acc + curr.Worldwide_Gross, 0)

        } else if (opt === 3) {
            return group.reduce((acc, curr) => Math.round((acc + curr.Worldwide_Gross)**0.9,2), 0)
        }
    }

    /** Esercizio: Usa d3.rollup per ottenere le operazioni viste nella presentazione (ogni punto sostituisce il precedente):
     *  1. Contare i film rilasciati da un distributor
     *  2. Contare i film rilasciati da un distibutor, per ogni genere
     *  3. Fare la somma degli incassi al botteghino dei film rilasciati da ogni Distributor **/
    //TODO Write here

    /** Esercizio: Stampiamo:
     * 1. Prima il numero di film totale
     * 2. Poi la somma degli incassi al botteghino **/
    let root = d3.hierarchy(groups); // https://d3js.org/d3-hierarchy/hierarchy
    console.log("Root", root);
    // TODO Write here
    // TODO Write here


    /** Esercizio: Che differenza c'è fra i 2 metodi? **/
    let treeLayout = d3.tree()
        // M1
        .size([chartWidth, chartHeight])
        // M2 // sito carino [https://observablehq.com/@nikita-sharov/d3-tree?collection=@nikita-sharov/interactivity]
        // .nodeSize([100, 300])
        // .separation((a, b) => a.parent === b.parent ? 1 : 0.2);

    /** Esercizio: Cosa succede a root prima e dopo aver invocato la funzione treeLayout? **/
    console.log("TreeLayout", treeLayout);
    console.log("Root [Before calling treeLayout]", root.copy());
    treeLayout(root) // modifica root, quindi non serve fare root = treeLayout(root)
    console.log("Root [After calling treeLayout]", root); // Nota: root è stato modificato, adesso i nodi hanno x e y


    /** Esercizio: Stampare nodes.links() nodes.descendants() **/
    // TODO Write here
    // TODO Write here


    // Links
    const areLinesStraight = true;
    if (areLinesStraight) {
        /** Esercizio: Creare gli archi per ogni nodo **/
        // TODO Write here
    }
    else {
        // Create d3.horizonal arcs
        gContainer
            .selectAll('path')
            .data(root.links())
            .join('path')
            .attr('d', d3.linkHorizontal()
                .x(d => d.x)
                .y(d => d.y))
            .attr('fill', 'none')
            .attr('stroke', 'lightgray');
    }

    /** Esercizio: Creare un cerchio per ogni nodo **/
    const get_node_x = 0 // TODO Write here
    const get_node_y = 0 // TODO Write here

    // Nodes
    gContainer
        .selectAll(null)
        .data(root.descendants())
        .join('circle')
        .attr('cx', get_node_x)
        .attr('cy', get_node_y)
        .attr('r', 7)
        .attr('fill', '#69b3a2')
        .attr('stroke', 'black')
        .attr('stroke-width',2);

    /** Esercizio: Creare un'etichetta per ogni nodo che spieghi il raggruppamento fatto **/
    // Labels
    // TODO Write here


    /** Esercizio: Creare un'etichetta che spieghi il valore generato dalla reduce **/
    // Leaf count labels
    // TODO Write here
}