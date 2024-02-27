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

    // Load GeoJSON data using fetch
    fetch('plot_eargre_long_lat_new2.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(geojsonData => {
            console.log('GeoJSON data:', geojsonData); // Check if GeoJSON data is printed in the console

            // Create a D3 projection
            const projection = d3.geoIdentity().scale(1300).fitSize([pageWidth / 2, pageHeight - 50], geojsonData);

            const colors = d3.scaleSequential(d3.interpolateBlues).domain([-0.5, 1]);            

            // Create a path generator
            const pathGenerator = d3.geoPath().projection(projection);

            // Append paths for each MultiPolygon
            migrationSvg.selectAll("path")
                .data(geojsonData.features)
                .enter().append("path")
                .attr("d", pathGenerator)
                .style("fill", d => d.properties.eargre !== 'NA' ? colors(d.properties.eargre) : 'lightgray')
                .style("stroke", "white");
        })
        .catch(error => console.error('Error loading GeoJSON file:', error));
}



setup();
