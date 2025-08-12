window.onload = main;

function main() {
    add_next(); // Insert the first element
}

// METODO 1
// let lIdx = 0;
// function add_next() {
//     const data = get_data(lIdx);
//     render_data(data);
//     lIdx += 1;
// }

// METODO 2
const add_next = (() => {
    let i = 0;

    return function () {
        const data = get_data(i);
        render_data(data);
        i += 1;
    }
})();


function get_data(i) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // num2char(idx) -> ['A', 'Z'] := ['A', 'B', 'C', ..., 'Z']
    if (num2char(i) > 'Z') return;

    return letters.slice(0, i + 1).reverse();
}

function render_data(data) {

    d3.select('#container')
        .selectAll('div')
        .data(data, function (d) {return d})
        // .data(data) // See the difference
        .join('div')
        .transition()
        .style('left', function (d, i) {
            return i * 50 + 'px';
        })
        .text(function (d) {
            return d;
        });

}


/* Utils */
function char2num(char) {
    return char.charCodeAt(0);
}

function num2char(num) {
    const c = String.fromCharCode(char2num('A') + (num - 1));
    if (c < 'A' || c > 'Z') return '';
    return c;
}