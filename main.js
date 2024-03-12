const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function setup() {
    const body = d3.select('body');

    const header = body.append('div')
        .attr('class', 'header')
        .attr("id", "header");

    const headerSvg = header.append("svg")
        .attr('id', 'headerSvg')
        .attr("height", 50)
        .attr("width", pageWidth);

    const text = d3.select("#headerSvg").append("text")
        .attr("class", "text title")
        .attr("fill", "black")
        .text("Visualizing GSL Birds: Where are they going and why?");

    // Calculate the text width
    const textWidth = text.node().getBBox().width;

    // Center the text horizontally
    text.attr("x", (pageWidth - textWidth) / 2)
        .attr("y", 25);

    const maps_div = body.append('div')
        .attr("id", "migration_div");

    const migrationSvg = maps_div.append('svg')
        .attr('id', 'migrationSvg')
        .attr("height", pageHeight - 50)
        .attr("width", pageWidth / 2);

    // Create a color scale
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([-0.5, 1]);

    // Create a color bar scale
    const colorBarSvg = body.append('svg')
        .attr('id', 'colorBarSvg')
        .attr("height", 200)
        .attr("width", 50)
        .style("position", "absolute") // Ensure the color scale is positioned correctly
        .style("bottom", "20px") // Adjust the bottom position as needed
        .style("left", "20px") // Adjust the left position as needed
        // .style("z-index", "999"); // Ensure the color scale appears above other elements

    const colorBar = d3.scaleLinear()
        .range(["white", "steelblue"])
        .domain([0, 1]);

    const colorValues = d3.range(0, 1.1, 0.2); // Define color values for ticks
    
    const colorBarAxis = d3.axisRight(colorBar)
        .tickValues(colorValues) // Set tick values
        .tickSize(10) // Adjust tick size
        .tickPadding(5) // Adjust padding between ticks and labels
        .tickFormat(d3.format(".1f")); // Format tick labels

    colorBarSvg.append("g")
        .attr("transform", "translate(25,40)")
        .call(colorBarAxis)
        .select(".domain").remove(); // Remove axis line

    // Add color gradient
    const defs = colorBarSvg.append("defs");
    const linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale(0));

    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(1));

    colorBarSvg.append("rect")
        .attr("width", 20)
        .attr("height", 200)
        .style("fill", "url(#linear-gradient)");

    // Load GeoJSON data for the entire United States and Mexico
    Promise.all([
        fetch('custom.geo.json').then(response => response.json()), 
        fetch('plot_eargre_2005.geojson').then(response => response.json())
    ])
    .then(data => {
        const [usMexicoData, birdData] = data;
        console.log('US-Mexico GeoJSON data:', usMexicoData);
        console.log('Bird population observation data:', birdData);

        // Create a D3 projection focusing on the US and Mexico
        const projection = d3.geoAlbers()
            .center([-10, 35])  // Center the map around the desired area
            .scale(2000)
            .translate([pageWidth / 4, pageHeight / 2]);

        const colors = d3.scaleSequential(d3.interpolateBlues).domain([-0.5, 1]);

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        // Append paths for US-Mexico map
        migrationSvg.selectAll(".custom")
            .data(usMexicoData.features)
            .enter().append("path")
            .attr("class", "custom")
            .attr("d", pathGenerator)
            .style("fill", "lightgray");

        // Append paths for bird observation data
        migrationSvg.selectAll(".bird-observation")
            .data(birdData.features)
            .enter().append("path")
            .attr("class", "bird-observation")
            .attr("d", pathGenerator)
            .style("fill", d => d.properties.eargre !== 'NA' ? colors(d.properties.eargre) : 'lightgray');
    })
    .catch(error => console.error('Error loading GeoJSON files:', error));
}

setup();
