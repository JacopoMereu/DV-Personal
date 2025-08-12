window.onload = main;

function main() {
    // Read the CSV file
    const filename = "[RAW DATA] ZTM - The State of AI Tools & Coding _ 2023 - Raw Data.csv"
    d3.csv(filename).then( handleData )

}

function handleData(data) {
    // group by the column "How long have you been in this profession?"
    console.log(data)
    const groupedData = d3.rollups(data,
            d=>d.length,
            d => d["How long have you been in this profession? "],
            d => d["How often do you use each of the following tools in your day-to-day job? [ChatGPT 3.5 (Free version)]"])
    // for each group d, check if the array (d[1]) contains the value "(blank)" and if so, remove that entry from d[1]
    .map(d => {
        const usageList = d[1].filter(usage => usage[0] !== "");
        return [d[0], usageList];
    })
    console.log(groupedData);


    // Example d in groupedData:
    // d[0] = '5-10 years'
    // d[1] = [
    //     [
    //         "Daily",
    //         232
    //     ],
    //     [
    //         "Tried it but don't use it",
    //         82
    //     ],
    //     [
    //         "Monthly",
    //         73
    //     ],
    //     [
    //         "",
    //         78
    //     ],
    //     [
    //         "Weekly",
    //         177
    //     ],
    //     [
    //         "Never tried it",
    //         14
    //     ]
    // ]

    const makeTable = (data) => {
        const body = d3.select("body");

        // Title
        body.append("p")
            .text("Grouped Data")
            .style("font-size", "20px")
            .style("font-weight", "bold");

        // Table with larger size
        const table = body.append("table")
            .style("border-collapse", "collapse")
            .style("border", "2px solid black")
            .style("font-size", "18px")
            .style("width", "80%");

        // Header row
        const header = table.append("tr")
            .style("background-color", "#f0f0f0");
        header.append("th").text("Profession Duration")
            .style("border", "1px solid black")
            .style("padding", "8px")
            .style('width', '10%')
        ;
        header.append("th").text("Usage Type")
            .style("border", "1px solid black")
            .style("padding", "8px")
            .style('width', '50%');
        header.append("th").text("Count")
            .style("border", "1px solid black")
            .style("padding", "8px")
            .style('width', '10%');

        // Add rows
        groupedData.forEach(([duration, usageList], index) => {
            usageList.forEach(([usageType, count], usageIndex) => {
                const row = table.append("tr");
                row.append("td").text(duration)
                    .style("border", "1px solid black")
                    .style("padding", "8px");
                row.append("td").text(usageType || "(blank)")
                    .style("border", "1px solid black")
                    .style("padding", "8px");
                row.append("td").text(count)
                    .style("border", "1px solid black")
                    .style("padding", "8px");
            });

            // Spacer row (empty) between professions
            if (index < groupedData.length - 1) {
                table.append("tr")
                    .append("td")
                    .attr("colspan", 3)
                    .style("height", "15px"); // gap size
            }
        });

        // Footer note
        body.append("p").text("Grouped Data displayed in a table.")
            .style("font-size", "16px");
    }
    // makeTable(groupedData);


    const makeGraphic = (groupedData) => {
        const usageTypes = [
            // "(blank)",
            "Never tried it",
            "Tried it but don't use it",
            "Monthly",
            "Weekly",
            "Daily",
        ];
        // Custom color mapping
        const colorMap = {
            "(blank)": "black",
            "Daily": "green",
            "Monthly": "#87CEFA",  // light blue
            "Weekly": "#20B2AA",   // blue-green (light sea green)
            "Tried it but don't use it": "darkorange",
            "Never tried it": "red"
        };

        // Prepare data
        const data = groupedData.map(([duration, usageList]) => {
            const obj = { duration };
            usageList.forEach(([type, count]) => {
                obj[type || "(blank)"] = count;
            });
            return obj;
        });

        const margin = { top: 40, right: 20, bottom: 60, left: 60 },
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Explicit sort order for durations
        const durationOrder = [
            "0-1 years",
            "1-2 years",
            "3-5 years",
            "5-10 years",
            "10+ years"
        ];

        // Scales
        const x = d3.scaleBand()
            .domain(durationOrder)
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.sum(usageTypes, k => d[k]))])
            .nice()
            .range([height, 0]);

        const color = d3.scaleOrdinal()
            .domain(usageTypes)
        //     .range(d3.schemeTableau10);
            .range(usageTypes.map(t => colorMap[t]));

        // Stack the data
        const stack = d3.stack().keys(usageTypes);
        const stackedData = stack(data);

        // Create tooltip div, initially hidden
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("padding", "6px 10px")
            .style("background", "rgba(0, 0, 0, 0.7)")
            .style("color", "white")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("font-size", "12px")
            .style("opacity", 0);

        // Draw bars with tooltip events
        svg.selectAll("g.layer")
            .data(stackedData)
            .join("g")
            .attr("class", "layer")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", d => x(d.data.duration))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .on("mouseover", (event, d) => {
                const usageType = d3.select(event.currentTarget.parentNode).datum().key;
                const count = d.data[usageType];
                tooltip
                    .style("opacity", 1)
                    .html(`<strong>${usageType}</strong><br/>Count: ${count}`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });
        ;

        // X Axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .style("font-weight", "bold")
        ;

        // Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Y Axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 15)   // position left, with some padding
            .attr("x", -height / 2)         // vertically centered
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text("# Developers");

        // Legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 150}, 0)`);

        usageTypes.forEach((type, i) => {
            const g = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`);
            g.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color(type));
            g.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .text(type);
        });
    }
    makeGraphic(groupedData);

}

