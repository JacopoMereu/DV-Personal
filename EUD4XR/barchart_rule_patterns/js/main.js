window.onload = main;

function main() {
    get_data();
}

function get_data() {
    const P = data => {
        data.forEach(d => {
            d.Count = +d.Count;
        })
        return data;
    }
    // d3.csv('./data/df1.csv')
    // d3.csv('./data/df2.csv')
    d3.csv('./data/df3.csv')
        .then(data => render_data(P(data)))
}

const svgWidth = 1500;
const svgHeight = 850;

const margin = {top: 40, right: 40, bottom: 40, left: 100}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// Exercise from Lez2/2_data_binding/3
function render_data(data) {
    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const key = 'Type', value = 'Count', sort = true, isVertical = !true
    render_bar_chart(svg, data, key, value, sort, isVertical);
}

function render_bar_chart(svg, data, key, value, sort, isVertical) {
    // The usual pattern for creating a group element and translating it to the margin
    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    if (sort)
        // data.sort((a, b) => d3.ascending(a[value], b[value]));
        data.sort((a, b) => d3.descending(a[value], b[value]));

    const xRange = isVertical ? [0, chartWidth] : [0, chartHeight]
    const yRange = isVertical ? [chartHeight, 0] : [0, chartWidth]

    // scale-x
    const scaleX = d3.scaleBand()
            .domain(data.map(d => d[key]))
            .range(xRange)
            .padding(0.2)
            // .paddingInner(0.9)
            // .paddingOuter(1)



        //  scale-y
    const scaleY = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[value])])
            .range(yRange)
            .nice();

    // axis-x
    gContainer.append('g')
        .attr('transform', `translate(0, ${0})`)
        .call(g => {
            if (isVertical) {
                d3.axisTop(scaleX)(g)
            } else {
                d3.axisTop(scaleY)
                    // .ticks(null, ".2s")
                    .ticks(null, ".0s")
                    // .tickFormat(d3.format(".2s"))
                    // .tickFormat(d=> d/1000000 + 'M')
                    .tickSize(-chartWidth)(g)
            }
        })
        .call(g => g.selectAll('line')
            .attr('stroke', 'lightgrey')
            .attr('stroke-dasharray', '10, 2')
        )
        .call(g => g.selectAll('text')
            .style('font-size', '2em')
        )
    ;

    // axis-y
    gContainer.append('g')
        .call(g => {
                if (isVertical) {
                    d3.axisLeft(scaleY)
                        // .tickFormat(d3.format(".2s"))
                        // .tickFormat(d=> d/1000000 + 'M')
                        .tickSize(-chartWidth)(g)

                } else {
                    d3.axisLeft(scaleX)(g)
                }
            }
        )
        .call(g => g.selectAll('line')
            .attr('stroke', 'lightgrey')
            .attr('stroke-dasharray', '10, 2')
        )
        .call(g => g.selectAll('text')
            .style('font-size', '2em')
        )
    ;


    /** Esercizio: Definire le funzioni get_x, get_y, get_width, get_height
     * sfruttando scaleX e scaleY */
    const get_x = (d, i) => isVertical ? scaleX(d[key]) : 0
    const get_y = (d, i) => isVertical ? scaleY(d[value]) : scaleX(d[key])
    const get_width = (d, i) => isVertical ? scaleX.bandwidth() : scaleY(d[value])
    const get_height = (d, i) => isVertical ? chartHeight - get_y(d, i) : scaleX.bandwidth()

    const color = "#a02a35"
    /** Esercizio: Definire le funzioni on mouseover e mouseout:
     * Quando il mouse va sul rettangolo, cambiagli il colore in orange
     * Quando il mouse ESCE dal rettangolo, cambiagli il colore in steelblue */
    const on_mouseover = (evt, d) => { // https://github.com/d3/d3-selection/issues/263
        d3.select(evt.currentTarget)
            .attr('fill', 'orange');
    }
    const on_mouseout = function (evt, d) {
        d3.select(this)
            .attr('fill', color);
    }

    // bars
    /** Esercizio: aggiungere un elemento di tipo "title" e dargli la popolazione come testo */
    gContainer.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', get_x)
        .attr('y', get_y)
        .attr('width', get_width)
        .attr('height', get_height)
        .attr('fill', color)
        .on('mouseover', on_mouseover)
        .on('mouseout', on_mouseout)
        .append('title')
        .text(d => d3.format(".2s")(d[value]));
}