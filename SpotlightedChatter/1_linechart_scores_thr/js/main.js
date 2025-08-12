window.onload = main;

function main() {
    const data = get_our_data();
    // const data = get_state_of_the_art_data();

    render_data(data);
}

function get_our_data() {
    return [
        0.15987257997459126,
        0.061509052538676556,
        0.09753454159273534,
        0.03308189525240368,
        0.0411460789154281,
        0.10369373018615202,
        0.07223816269368133,
        0.09785355755438951,
        0.1008106713183381,
        0.059333244468482316,
        0.055143026008729,
        0.08694583223236185,
        0.08142249421155046,
        0.06475896223597921,
        0.04374099025678668,
        0.04906940880708455,
        0.10055192434294413,
        0.03611414916456457,
        0.07446743385235433,
        0.05858708690798975,
        0.05975296792863216,
        0.07337092829344061,
        0.05849261546450191,
        0.10115484860410962,
        0.05067970631293939,
        0.04898835618263697,
        0.08011208926322222,
        0.06366366575550575,
        0.06297227775186587,
        0.054979408565371646,
        0.0903413547230858,
        0.0680976462569165,
        0.05311089494593557,
        0.10055688048489919,
        0.08157082058241194,
        0.05350327332273175,
        0.051673197639030666,
        0.06404583821645327,
        0.07712009293655175,
        0.13418792553960368,
        0.07627089425682987,
        0.06006637469167175,
        0.09233889470724022,
        0.1017566326998216,
        0.0653369250053637,
        0.09844456675411717,
        0.12306583074498689,
        0.0350016058778182,
        0.1311666528668245,
        0.07700394049512982,
        0.05312682483280684,
        0.09729632167993829,
        0.0618902208363461,
        0.05296631027062226,
        0.07364330357572224,
        0.05943507739372067,
        0.0885210823128254,
        0.06917185997078623,
        0.0545772085512104,
        0.06526398613210405,
        0.09031998968880128,
        0.04397985192462672,
        0.046071727356858716,
        0.050917615823934836,
        0.057511415117648346,
        0.037903222756538235,
        0.071841697688934,
        0.05741367772035255,
        0.04926548510940865,
        0.07421848661779396,
        0.06772897466467498,
        0.04948881731783694,
        0.1166560374837391,
        0.1395010406606364,
        0.08266723445138924,
        0.049571978449805765,
        0.10891256287633855,
        0.10215657307244774,
        0.08294990922644008,
        0.10053653955941033,
        0.12701316739323032,
        0.14857140475725794,
        0.05078732925557439,
        0.03900554777245524,
        0.08768740469480507,
        0.09191942929467223,
        0.07635883491339712,
        0.08597010408865458,
        0.10921255090015336,
        0.08626661046976636
    ]
}

function get_state_of_the_art_data() {
    return [
        0.05545130936880305,
        0.0545772085512104,
        0.06526398613210405,
        0.05371075999394592,
        0.037903222756538235,
        0.06371301022451514,
        0.09808525797224066,
        0.10369373018615202,
        0.06411339232708257,
        0.104112811385496,
        0.06786077654263123,
        0.062426839551903646,
        0.07690885083170851,
        0.07760169094433533,
        0.08626661046976636,
        0.04189674226332385,
        0.05975296792863216
    ]
}

const svgWidth = 1000;
// const svgHeight = 600;
const svgHeight = 620;

// const margin = {top: 40, right: 60, bottom: 40, left: 60}
const margin = {top: 30, right: 60, bottom: 50, left: 60}
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log("DATA LOADED", data)
    const textSize = 20;

    const svg = d3.select("body").append("svg");
    const gContainer = svg
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const extent = d3.extent(data, d => d); // [min, max]

    // scaleX will help us to map the date to the x position of the chart
    const scaleX = d3.scaleLinear()
        .domain([1, data.length+1 ])
        .range([0, chartWidth])

    // scaleY will help us to map the value to the y position of the chart
    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => d)])
        .range([chartHeight, 0])

    // Create the axes
    const gap_between_axes = 20
    gContainer.append("g")
        .attr("transform", `translate(${gap_between_axes}, ${chartHeight})`)
        .call(d3.axisBottom(scaleX).tickSizeOuter(-chartHeight))

        .append("text")
        .attr("fill", "#000")
        .attr("x", chartWidth / 2)
        // .attr("y", 30)
        .attr("y", 37)
        .attr("text-anchor", "middle")
        .text("Test number #")
    ;

    gContainer.append("g")
        .attr("transform", `translate(${-gap_between_axes}, ${0})`)
        .call(d3.axisLeft(scaleY))
        .append("text")
        .attr("fill", "#000")
        // .attr("transform", "rotate(-90)")
        .attr("y", -10)
        .attr("x", 0)
        .attr("text-anchor", "middle")
        .text("Score")


    const handleX = idx => scaleX(idx+1);
    const belowThreshold = d => d <= 0.10;

    const gContent = gContainer.append('g').attr('transform', `translate(25, 0)`)
    const thr = 0.10
    // Plot the line-chart
    // gContent.append('path')
    //     .datum(data)
    //     .attr('fill', 'none')
    //     .attr('stroke', '#8eac95')
    //     .attr('stroke-width', 1)
    //     .attr('stroke-linejoin', 'round')
    //     .attr('d', d3.line()
    //         .x((_, i) => handleX(i))
    //         .y(d => scaleY(d))
    //     )

    // Draw a circle for each data point
    gContent.selectAll(null)
        .data(data)
        .join('circle')
        .attr('cx', (_, i) => handleX(i))
        .attr('cy', d => scaleY(d))
        .attr('r', 5)
        .attr('fill', (d) => belowThreshold(d) ? '#8eac95' : 'red')

    // // Draw a little square for each data point
    // gContent.selectAll(null)
    //     .data(data)
    //     .join('rect')
    //     .attr('x', (_, i) => handleX(i) - 5)
    //     .attr('y', d => scaleY(d) - 5)
    //     .attr('width', 10)
    //     .attr('height', 10)
    //     .attr('fill', '#8eac95')

    // Add a small white rect behind each text
    gContent.selectAll(null)
        .data(data)
        .join('rect')
        .attr('x', (_, i) => handleX(i) - 10)
        .attr('y', d => scaleY(d) - 20)
        .attr('width', 20)
        .attr('height', 10)
        .attr('fill', d=>!belowThreshold(d)?'white':'none')
        // .attr('stroke', 'black')

    // Add a text label to each data point
    gContent.selectAll(null)
        .data(data)
        .join('text')
        .attr('x', (_, i) => handleX(i))
        .attr('y', d => scaleY(d) - 10)
        .text(d => !belowThreshold(d) ? d.toFixed(3):"")
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', 'black')
        .attr('dominant-baseline', 'text-after-edge')
        .attr('font-weight', 'bold')



    // Draw a red horizontal line at 0.10
    gContent.append('line')
        .attr('x1', 0)
        .attr('y1', scaleY(0.10))
        .attr('x2', chartWidth)
        .attr('y2', scaleY(0.10))
        .attr('stroke', 'red')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5')

    // Add a white background for the label
    const x_thr = 500
    gContent.append('rect')
        .attr('x', x_thr-10)
        .attr('y', scaleY(thr) - 20)
        .attr('width', 60)
        .attr('height', 10)
        .attr('fill', 'none')

    // Add a label for the red line
    gContent.append('text')
        .attr('x', x_thr)
        .attr('y', scaleY(thr) - 10)
        .text('threshold')
        .attr('fill', 'red')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')


    // Add a title
    // svg.append('text')
    //     .attr('x', svgWidth / 2)
    //     .attr('y', 30)
    //     .text('Cosine distance between the original and the generated text')
    //     .attr('text-anchor', 'middle')
    //     .attr('font-size', '20px')
    //     .attr('font-weight', 'bold')

}