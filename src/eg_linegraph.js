function createEGLinegraph() {
    // Select the correct SVG element and set width/height
    const svgWidth = 700, svgHeight = 700;
    const margin = { top: 50, right: 80, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#grebe_linegraph")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load JSON data
    d3.json("birds/eg_geojsons/EG_Spring_Avgs.json")
        .then(data => {
            console.log("Loaded JSON Data:", data);

            const years = Object.keys(data.march_avg).filter(y => y !== "null"); // Extract available years
            let currentYearIndex = 0; // Start from the first year

            // Set up scales
            const xScale = d3.scaleBand()
                .domain(["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"])
                .range([0, width])
                .padding(0.1);

            const yScale = d3.scaleLinear().range([height, 0]);

            // Define the line generator
            const line = d3.line()
                .x(d => xScale(d.month) + xScale.bandwidth() / 2)
                .y(d => d.value !== null ? yScale(d.value) : null)
                .defined(d => d.value !== null); // Ignore null values

            // Add X Axis
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            // Add Y Axis
            const yAxis = svg.append("g").attr("class", "y-axis");

            // Add line path
            const path = svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", 2);

            // 🔹 **Fix: Move the Year Label outside the transformed group**
            const yearText = d3.select("#grebe_linegraph")
                .append("text")
                .attr("id", "year-label")
                .attr("x", svgWidth - 100)  // Adjusted for better visibility
                .attr("y", 100)  // Position near the top
                .attr("text-anchor", "middle")
                .style("font-size", "24px")
                .style("font-weight", "bold")
                .style("fill", "black");

            // Function to update graph for a specific year
            function updateGraph(year) {
                const dataset = [
                    { month: "January", value: null },
                    { month: "February", value: null },
                    { month: "March", value: data.march_avg[year] || 0 },
                    { month: "April", value: data.april_avg[year] || 0 },
                    { month: "May", value: data.may_avg[year] || 0 },
                    { month: "June", value: null },
                    { month: "July", value: null },
                    { month: "August", value: null },
                    { month: "September", value: null },
                    { month: "October", value: null },
                    { month: "November", value: null },
                    { month: "December", value: null }
                ];

                // Update Y scale domain dynamically
                const validValues = dataset.filter(d => d.value !== null);
                yScale.domain([0, d3.max(validValues, d => d.value)]).nice();

                // Update Y Axis
                yAxis.transition().duration(1000).call(d3.axisLeft(yScale));

                // Update Line
                path.datum(dataset)
                    .transition()
                    .duration(1000)
                    .attr("d", line);

                // 🔹 **Fix: Update Year Label Correctly**
                yearText.text(`Year: ${year}`);
            }

            // Cycle through years every 2 seconds
            function animateYears() {
                updateGraph(years[currentYearIndex]);
                currentYearIndex = (currentYearIndex + 1) % years.length;
                setTimeout(animateYears, 2000);
            }

            animateYears(); // Start animation
        })
        .catch(error => console.error("Error loading JSON:", error));
}
