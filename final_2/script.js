// note: uses maps.js scripts.

function createBrushableZoomableScatterplotMatrix(rawData) {
    d3.select("#chart").html("");
    d3.select("#legend").html("");

    // Dimensions of chart
    const width = 928;
    const height = width;
    const padding = 28;

    // Prep number columns
    const columns = ['AvgGDP', 'TotalMedals', 'Year'];
    const size = (width - (columns.length + 1) * padding) / columns.length + padding;

    // def cols and rows
    const x = columns.map(c => d3.scaleLinear()
        .domain(d3.extent(rawData, d => d[c]))
        .rangeRound([padding / 2, size - padding / 2])
    );
    const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]));
    
    // create  SVG
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-padding-2, -2, width + padding+4, height+4]); // Fixed viewBox to include right padding
    
    // global zooming: (Limit zoom scale from 0.5x to 5x)
    const globalZoomHandler = d3.zoom()
        .scaleExtent([0.5, 5])  
        .on("zoom", (event) => {
            scatterplotContainer.attr("transform", event.transform);
        });

    // overlay to capture zoom events
    svg.append("rect")
        .attr("class", "zoom-overlay")
        .attr("width", width + padding)
        .attr("height", height)
        .attr("opacity", 0)
        .call(globalZoomHandler);
            
    // // container for all zoomable   chart elements 
    // const scatterplotContainer = svg.append("g")
    //     .attr("class", "scatterplot-container");
    // scatterplotContainer.attr("transform", "translate(10, 10) scale(0.97)");
    // scatterplotContainer.append("style")
    //     .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    const scatterplotContainer = svg.append("g")
        .attr("class", "scatterplot-container")
        .attr("transform", "translate(10, 10) scale(0.97)");

    scatterplotContainer.append("style")
        .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    // Defining and adding axes::
    const axisx = d3.axisBottom()
        .ticks(6)
        .tickSize(size * columns.length);
    const xAxis = g => g.selectAll("g").data(x).join("g")
        .attr("transform", (d, i) => `translate(${i * size},0)`)
        .each(function (d) { return d3.select(this).call(axisx.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

    const axisy = d3.axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length);
    const yAxis = g => g.selectAll("g").data(y).join("g")
        .attr("transform", (d, i) => `translate(0,${i * size})`)
        .each(function (d) { return d3.select(this).call(axisy.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

    scatterplotContainer.append("g")
        .attr("class", "x-axis")
        .call(xAxis);
    scatterplotContainer.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    const cell = scatterplotContainer.append("g")
        .selectAll("g")
        .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
        .join("g")
        .attr("class", "cell")
        .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);
    
    // Add styling for brush extent outline
    // scatterplotContainer.append("style")
    //     .text(`
    //         .cell .brush .extent {
    //             stroke: #000;
    //             stroke-width: 5px;
    //         }
    //     `);

    // Add background lines 
    cell.append("rect")
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("stroke-width", (d, i) => {
            const [columnIndex, rowIndex] = d;
            return columnIndex === rowIndex ? 3 : 1; // Thicker border for diagonal cells
        }).attr("x", padding / 2 + 0.5)
        .attr("y", padding / 2 + 0.5)
        .attr("width", size - padding)
        .attr("height", size - padding);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("display", "none");

    // Brush 
    const brush = d3.brush()
        .extent([[0, 0], [size, size]])
        .on("start brush end", brushed);

    // Brush event handling:
    function brushed(event) {
        const selection = event.selection;

        cell.selectAll("circle").each(function (d) {
            const circle = d3.select(this);
            const cellData = this.parentNode.__data__;
            const i = cellData[0];
            const j = cellData[1];
            const cx = x[i](d[columns[i]]);
            const cy = y[j](d[columns[j]]);

            if (!selection) {
                circle.classed("hidden", false)
                    .attr("r", 3.5)
                    .attr("opacity", 1);

            } else {
                const [[x0, y0], [x1, y1]] = selection;
                if (cx >= x0 &&
                    cx <= x1 &&
                    cy >= y0 &&
                    cy <= y1) {
                    circle.classed("hidden", false)
                        .attr("r", 5)
                        .attr("opacity", 1);
                } else {
                    circle.classed("hidden", true)
                        .attr("r", 3.5)
                        .attr("opacity", 0.1);
                }
            }
        });
    }

    // OLD Plot points
    // cell.each(function ([i, j]) {
    //     const currentCell = d3.select(this);

    //     currentCell.selectAll("circle")
    //         .data(rawData.filter(d =>
    //             !isNaN(d[columns[i]]) &&
    //             !isNaN(d[columns[j]])
    //         ))
    //         .join("circle")
    //         .attr("cx", d => x[i](d[columns[i]]))
    //         .attr("cy", d => y[j](d[columns[j]]))
    //         .attr("r", 3.5)
    //         .attr("fill-opacity", 0.7)
    //         .attr("fill", d => {
    //             const continent = countryToContinentMap[d.Country] || 'Other';
    //             return continentColors[continent];
    //         })
    //         .on("mouseover", function (event, d) {
    //             const continent = countryToContinentMap[d.Country] || 'Other';
    //             tooltip.style("display", "block")
    //                 .html(`
    //                     <strong>Country:</strong> ${d.Country}<br>
    //                     <strong>Continent:</strong> ${continent}<br>
    //                     ${columns[i]}: ${d[columns[i]].toFixed(2)}<br>
    //                     ${columns[j]}: ${d[columns[j]].toFixed(2)}`)
    //                 .style("left", (event.pageX + 10) + "px")
    //                 .style("top", (event.pageY - 10) + "px");
    //         })
    //         .on("mouseout", function () {
    //             tooltip.style("display", "none");
    //         });

    //     // Brush on leading diagonal.
    //     if (i === j) {
    //         currentCell.call(brush);
    //     }
    // });

    
    // Plot points
    
    // Fixed for mouseover
    cell.each(function ([i, j]) {
        const currentCell = d3.select(this);
        
        // Store the column indices directly on the cell element
        currentCell.attr("data-x-index", i)
                .attr("data-y-index", j);

        currentCell.selectAll("circle")
            .data(rawData.filter(d =>
                !isNaN(d[columns[i]]) &&
                !isNaN(d[columns[j]])
            ))
            .join("circle")
            .attr("cx", d => x[i](d[columns[i]]))
            .attr("cy", d => y[j](d[columns[j]]))
            .attr("r", 3.5)
            .attr("fill-opacity", 0.7)
            .attr("fill", d => {
                const continent = countryToContinentMap[d.Country] || 'Other';
                return continentColors[continent];
            })
            .on("mouseover", function (event, d) {
            const continent = countryToContinentMap[d.Country] || 'Other';
            
            tooltip.style("display", "block")
                .html(`
                    <strong>Country:</strong> ${d.Country}<br>
                    <strong>Continent:</strong> ${continent}<br>
                    <strong>AvgGDP:</strong> ${d.AvgGDP}<br>
                    <strong>TotalMedals:</strong> ${d.TotalMedals}<br>
                    <strong>Year:</strong> ${d.Year}
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
                })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            });

        // Brush on leading diagonal.
        if (i === j) {
            currentCell.call(brush);
        }
    });
    // Labels for diagonal plots.
    scatterplotContainer.append("g")
        .style("font", "bold 14px sans-serif")
        .style("pointer-events", "none")
        .selectAll("text")
        .data(columns)
        .join("text")
        .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(d => {
        if (d === "AvgGDP") return "Average GDP Per Capita";
        if (d === "TotalMedals") return "Total Medals";
        return d;
    });

    // add svg to chart div in html
    document.getElementById("chart").appendChild(svg.node());

    // Key
    const legend = d3.select("#legend")
        .append("div")
        .attr("class", "legend");

    Object.entries(continentColors).forEach(([continent, color]) => {
        legend.append("div")
            .attr("class", "legend-item")
            .html(`
                <div class="legend-color" style="background-color: ${color}"></div>
                <div>${continent}</div>
            `);
    });
}

// Client data processing -> specific to this frontend only.
function processOlympicData(data) {
    // data.forEach(row => {
    //     row.Continent = countryToContinentMap[row. City] || 'Other';
    // });

    
    // Add continent to each record using hashmap.
    data.forEach(row => {
        row.Continent = countryToContinentMap[row.NOC] || 'Other';
    });

    // Grouping data with rollups
    const aggregatedData = d3.rollups(
        data.filter(row => row.Year >= 1984 && row.Year <= 2020),
        v => ({
            totalMedals: v.filter(d => d.Medal).length,
            avgGDP: d3.mean(v, d => d.GDP_per_capita),
            year: v[0].Year
        }),
        d => d.NOC
    ).map(([country, metrics]) => ({
        Country: country,
        TotalMedals: metrics.totalMedals,
        AvgGDP: metrics.avgGDP,
        Year: metrics.year
    }));

    createBrushableZoomableScatterplotMatrix(aggregatedData);
}

//loaded locallky
d3.csv("olympics_with_gdp_clean.csv")
    .then(processOlympicData)
    .catch(error => console.error('Error loading the CSV file:', error));