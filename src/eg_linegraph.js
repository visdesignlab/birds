function createLinegraph(svg, path) {
    svg.selectAll("*").remove(); // Clears everything in the SVG

    // Define dimensions and margins
    const svgWidth = 700, svgHeight = 700;
    const margin = { top: 50, right: 80, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const g = svg
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load JSON data
    d3.json(path).then(data => {
        console.log("Loaded JSON Data:", data);

        const allYears = new Set([
            ...Object.keys(data.jan_avg || {}),
            ...Object.keys(data.feb_avg || {}),
            ...Object.keys(data.march_avg || {}),
            ...Object.keys(data.april_avg || {}),
            ...Object.keys(data.may_avg || {}),
            ...Object.keys(data.june_avg || {}),
            ...Object.keys(data.july_avg || {}),
            ...Object.keys(data.aug_avg || {}),
            ...Object.keys(data.sep_avg || {}),
            ...Object.keys(data.oct_avg || {}),
            ...Object.keys(data.nov_avg || {}),
            ...Object.keys(data.dec_avg || {})
        ]);
        
        const years = Array.from(allYears).filter(y => y !== "null").sort(); // Ensure sorted order
                let currentYearIndex = 0;

        // Extract all values across all years for fixed Y-scale
        const allValues = [];
        years.forEach(year => {
            allValues.push(data.jan_avg[year], data.feb_avg[year], data.march_avg[year], 
                           data.april_avg[year], data.may_avg[year], data.june_avg[year], 
                           data.july_avg[year], data.aug_avg[year], data.sep_avg[year], 
                           data.oct_avg[year], data.nov_avg[year], data.dec_avg[year]);
        });

        const yMax = d3.max(allValues.filter(v => v !== null)); // Find max value (ignoring nulls)

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"])
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, yMax])  // Fixed Y scale based on max value
            .range([height, 0])
            .nice(); // Ensures neat axis spacing

        // Define line generator
        const line = d3.line()
            .x(d => xScale(d.month) + xScale.bandwidth() / 2)
            .y(d => d.value !== null ? yScale(d.value) : null)
            .defined(d => d.value !== null); // Ignore null values

        // Add X Axis
        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add Y Axis (static)
        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale));

        // Group for faded lines
        const fadedLinesGroup = g.append("g");

        // Main animated line
        const path = g.append("path")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2);

        // Year Label in Center
        const yearText = g.append("text")
            .attr("id", "year-label")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "32px")
            .style("font-weight", "bold")
            .style("fill", "black");

        // Function to update graph for a specific year
        function updateGraph(year, isFirstYear = false) {
            const dataset = [
                { month: "January", value: data.jan_avg[year] || 0},
                { month: "February", value: data.feb_avg[year] || 0},
                { month: "March", value: data.march_avg[year] || 0},
                { month: "April", value: data.april_avg[year] || 0},
                { month: "May", value: data.may_avg[year] || 0},
                { month: "June", value: data.june_avg[year] || 0},
                { month: "July", value: data.july_avg[year] || 0},
                { month: "August", value: data.aug_avg[year] || 0},
                { month: "September", value: data.sep_avg[year] || 0},
                { month: "October", value: data.oct_avg[year] || 0},
                { month: "November", value: data.nov_avg[year] || 0},
                { month: "December", value: data.dec_avg[year] || 0}
            ];

            // Update animated line
            path.datum(dataset)
                .transition()
                .duration(500) // 🔹 Smooth transition over 1s
                .ease(d3.easeLinear)
                .attr("d", line);

            // Update year label
            yearText.text(`Year: ${year}`);

            // ** If not the first year, add previous line as faded **
            if (!isFirstYear) {
                fadedLinesGroup.append("path")
                    .datum(dataset)
                    .attr("fill", "none")
                    .attr("stroke", "lightgray")
                    .attr("stroke-width", 2)
                    .attr("opacity", 0.5)
                    .attr("d", line);
            }
        }

        // Cycle through years with animation
        function animateYears() {
            if (currentYearIndex >= years.length) return;
            const isFirstYear = currentYearIndex === 0;
            const currentYear = years[currentYearIndex];

            updateGraph(currentYear, isFirstYear);

            if (isFirstYear) {
                // ** Store the first year as a faded line after animation completes **
                setTimeout(() => {
                    fadedLinesGroup.append("path")
                        .datum([
                            { month: "January", value: data.jan_avg[currentYear] || 0 },
                            { month: "February", value: data.feb_avg[currentYear] || 0 },
                            { month: "March", value: data.march_avg[currentYear] || 0 },
                            { month: "April", value: data.april_avg[currentYear] || 0 },
                            { month: "May", value: data.may_avg[currentYear] || 0 },
                            { month: "June", value: data.june_avg[currentYear] || 0 },
                            { month: "July", value: data.july_avg[currentYear] || 0 },
                            { month: "August", value: data.aug_avg[currentYear] || 0 },
                            { month: "September", value: data.sep_avg[currentYear] || 0 },
                            { month: "October", value: data.oct_avg[currentYear] || 0 },
                            { month: "November", value: data.nov_avg[currentYear] || 0 },
                            { month: "December", value: data.dec_avg[currentYear] || 0 }
                        ])
                        .attr("fill", "none")
                        .attr("stroke", "lightgray")
                        .attr("stroke-width", 2)
                        .attr("opacity", 0.5)
                        .attr("d", line);
                }, 1000); // Wait for first year's animation to finish
            }

            currentYearIndex++;
            setTimeout(animateYears, 500); // Controls animation speed
        }

        animateYears(); // Start animation
    })
    .catch(error => console.error("Error loading JSON:", error));
}
