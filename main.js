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

    // Load GeoJSON data for the entire United States and Mexico
    Promise.all([
        fetch('custom.geo.json').then(response => response.json()), 
        fetch('plot_eargre_long_lat_new2.geojson').then(response => response.json())
    ])
    .then(data => {
        const [usMexicoData, birdData] = data;
        console.log('US-Mexico GeoJSON data:', usMexicoData);
        console.log('Bird population observation data:', birdData);

        // Create a D3 projection focusing on the US and Mexico
        const projection = d3.geoAlbers()
            .center([0, 25])  // Center the map around the desired area
            // .rotate([100, 0]) // Rotate the map to focus on the desired area
            .scale(1300)
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
