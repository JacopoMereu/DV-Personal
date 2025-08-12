window.onload = main;

function main() {
    randomize_data();
}

function randomize_data() {
    const data = get_data();
    render_data(data);
}
function get_data() {
    let data = [];
    let numItems = getRandomIntBetweenAandB(1, 7);

    for (let i = 0; i < numItems; i++) {
        data.push(40);
    }

    return data;
}

function render_data(data) {
    const prev = d3.select('#container')
        .selectAll('circle')
        .size();

    d3.select('#container')
        .selectAll('circle')
        .data(data)
        .join(
            function (enter) {
                return enter
                    .append('circle')
                    .style('fill', 'black')
                    // .style('opacity', 0.25);
            },
            function (update) {
                return update
                    .style('fill', 'red')
                    // .style('opacity', 1);
            }
        )
        .attr('cx', function (d, i) {
            return i * 100;
        })
        .attr('cy', 50)
        .attr('r', (d) => 0.5 * d)
        // .style('fill', 'orange');

    d3.select('p').text(`[PREV: ${prev}] | [CURR: ${data.length}]`);
}


/* Utils */
function getRandomIntBetweenAandB(a, b, b_inclusive = true) {
    // Math.random() -> [0, 1)
    // [0, 1) * (b - a + 1) -> [0, b - a + 1)
    // [0, b - a + 1) + a -> [a, b + 1) == [a, b] if b_inclusive == true
    const inc = b_inclusive ? 1 : 0;
    return Math.floor(Math.random() * (b - a + inc) + a);
}