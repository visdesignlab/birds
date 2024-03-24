import * as d3 from 'd3'
import { sliderBottom } from 'd3-simple-slider'

const globalApplicationState = {
    current_species : 'eargre',
    current_states : ['ut_eg_geojsons', 'nm_eg_geojsons'],
    current_species_data : [''],
    current_year_selection : ''
}

globalApplicationState.current_species_data = [`${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species}_2004`, `${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species}_nm_2004`]
console.log(globalApplicationState.current_species_data)

const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function setup() {
    const body = d3.select('body')
    body.style("background-color", "white");

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

    // const button = d3.select("#header").append("button")
    //     .attr("class", "btn btn-primary")
    //     .text('Hello World')

    // Calculate the text width
    const textWidth = text.node().getBBox().width;

    // Center the text horizontally
    text.attr("x", (pageWidth - textWidth) / 2)
        .attr("y", 25);

    const maps_div = body.append('div')
        .attr('class', 'container')
        .attr("id", "migration_div")
        .attr('height', pageHeight + 1000)
        .style("left", pageWidth / 2 + "px"); ;

    const migrationSvg = maps_div.append('svg')
        .attr('id', 'migrationSvg')
        .attr("height", pageHeight - 50)
        .attr("width", pageWidth / 2);

    // Append SVG for the slider
    const sliderSvg = body.append('svg')
        .attr('id', 'sliderSvg')
        .attr("height", pageHeight - 50)
        .attr("width", pageWidth / 2)
        .style("position", "absolute") 
        .style("top", "50px") 
        .style("left", "0px") 

    const reveal_div = body.append('div')
        .attr('class', 'reveal')
        .attr('id', 'revealDiv')
        .style("position", "absolute") 
        .style("top", "50px") 
        .style("left", pageWidth / 2 + "px") 
        .style("width", pageWidth / 2 + "px") 
        .style("height", pageHeight - 50 + "px") 
        .style("overflow", "auto")
        .style("background-color", "white"); 

    const slides_div = reveal_div.append('div').attr('class', 'slides')
        // .style("background-color", "white")

    const animate_section = slides_div.append('section')
        .attr('data-auto-animate', '')
        .append('h1').style('color', 'black').text('How is El Nino affecting the American White Pelican?').style('font-size', '100px').style('fill', );

    const animate_section2 = slides_div.append('section')
        .attr('data-auto-animate', '')
        // .attr('data-auto-animate-id', 'two')
        // .append('h1').text('How is El Nino affecting the American White Pelican?').style('font-size', '100px')
        .append('h1').style('color', 'black').text('Lets Find Out').style('font-size', '100px');

    Reveal.initialize();

    function updateSpeciesData(year) {
        globalApplicationState.current_species_data[0] = `${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species}_${year}`;
        globalApplicationState.current_species_data[1] = `${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species}_nm_${year}`;
        console.log(globalApplicationState.current_species_data);
    }  

    // Create the slider
    const slider = sliderBottom()
        .min(2004)
        .max(2023)
        .step(1)
        .width(pageWidth / 2.5) // Adjust the width as needed
        .tickValues(d3.range(2004, 2024, 1)) // Include all years as tick values
        .tickFormat((d) => d) // Tick values range from 2004 to 2023
        .on('onchange', val => {
            updateSpeciesData(val)
            updateMap(val);
        });

    // Append the slider to the slider SVG
    sliderSvg.append('g')
        .attr('transform', 'translate(60,400)') // Adjust positioning as needed
        .attr("id", "slider_group")
        .call(slider)
        .attr('class', 'slider');

    // Select all ticks and style them
    sliderSvg.selectAll(".tick line")
        .style("stroke-width", "2px") // Adjust stroke width as needed
        .attr("y2", 10)
        .style("stroke", "black");

    // Create a D3 projection focusing on the US and Mexico
    const projection = d3.geoAlbers()
    .center([-2, 28])  // Center the map around the desired area
    .scale(900)
    .translate([pageWidth / 4, pageHeight / 2]);

    // Define custom color scale for bird observation data
    const customColorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([-0.5, 1]);

    // Create a path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Load GeoJSON data for the entire United States and Mexico
    Promise.all([
        fetch(`${globalApplicationState.current_species_data[0]}.geojson`).then(response => response.json()),
        fetch(`${globalApplicationState.current_species_data[1]}.geojson`).then(response => response.json()),
        fetch('map_geojsons/us_states.geojson').then(response => response.json()), 
        fetch('map_geojsons/states.geojson').then(response => response.json()) 
    ])
    
    .then(data => {
        const [utBirdData, nmBirdData, usStatesData, mexicoStatesData] = data;
        console.log('UT Bird population observation data:', utBirdData);
        console.log('NM Bird population observation data:', nmBirdData);
        console.log('US States GeoJSON data:', usStatesData);
        console.log('Mexico States GeoJSON data:', mexicoStatesData);

        // Append paths for US state boundaries
        migrationSvg.selectAll(".state-boundary")
            .data(usStatesData.features)
            .enter().append("path")
            .attr("class", "state-boundary")
            .attr("d", pathGenerator)
            .style("fill", "none") // No fill for state borders
            .style("stroke", "black") // Border color
            .style("stroke-width", 1); // Border width

        // Append paths for Mexico state boundaries
        migrationSvg.selectAll(".mexico-state-boundary")
            .data(mexicoStatesData.features)
            .enter().append("path")
            .attr("class", "mexico-state-boundary")
            .attr("d", pathGenerator)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", 1);

        // Append paths for bird observation data
        migrationSvg.selectAll(".bird-observation")
            .data(utBirdData.features)
            .enter().append("path")
            .attr("class", "bird-observation")
            .attr("d", pathGenerator)
            .style("fill", d => {
                if (d.properties.eargre === 'NA') {
                    return 'none'; // No data, same color as background
                } else {
                    const value = +d.properties.eargre; // Convert to number
                    // Map values close to 0 to a color closer to the background
                    return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
                }
            });
        migrationSvg.selectAll(".nm-bird-observation")
            .data(nmBirdData.features)
            .enter().append("path")
            .attr("class", "nm-bird-observation")
            .attr("d", pathGenerator)
            .style("fill", d => {
                if (d.properties.eargre === 'NA') {
                    return 'none'; // No data, same color as background
                } else {
                    const value = +d.properties.eargre; // Convert to number
                    // Map values close to 0 to a color closer to the background
                    return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
                }
            });
    })
    .catch(error => console.error('Error loading GeoJSON files:', error));

    function updateMap(year: number) {
        // Fetch GeoJSON data for the specified year
        fetch(`${globalApplicationState.current_species_data[0]}.geojson`)
            .then(response => response.json())
            .then(birdData => {
                // Remove existing bird observation paths
                migrationSvg.selectAll(".bird-observation").remove();
                
                // Append paths for bird observation data
                migrationSvg.selectAll(".bird-observation")
                    .data(birdData.features)
                    .enter().append("path")
                    .attr("class", "bird-observation")
                    .attr("d", pathGenerator)
                    .style("fill", d => {
                        if (d.properties.eargre === 'NA') {
                            return 'none'; // No data, same color as background
                        } else {
                            const value = +d.properties.eargre; // Convert to number
                            // Map values close to 0 to a color closer to the background
                            return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
                        }
                    });
            })
            .catch(error => console.error('Error updating map:', error));

        fetch(`${globalApplicationState.current_species_data[1]}.geojson`)
            .then(response => response.json())
            .then(birdData => {
                // Remove existing bird observation paths
                migrationSvg.selectAll(".nm-bird-observation").remove();
                
                // Append paths for bird observation data
                migrationSvg.selectAll(".nm-bird-observation")
                    .data(birdData.features)
                    .enter().append("path")
                    .attr("class", "nm-bird-observation")
                    .attr("d", pathGenerator)
                    .style("fill", d => {
                        if (d.properties.eargre === 'NA') {
                            return 'none'; // No data, same color as background
                        } else {
                            const value = +d.properties.eargre; // Convert to number
                            // Map values close to 0 to a color closer to the background
                            return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
                        }
                    });
            })
            .catch(error => console.error('Error updating map:', error));
    }

    // Slider for months when needed below:


    // const sliderSvg = body.append('svg')
    // .attr('id', 'sliderSvg')
    // .attr("height", 50)
    // .attr("width", pageWidth / 2)
    // .style("position", "absolute") // Position absolutely
    // .style("top", "0px") // Adjust top position as needed
    // .style("left", "0px"); // Position it on the left side

// Create the slider
    // const slider = d3.sliderHorizontal()
    //     .min(1) // January is represented as 1
    //     .max(12) // December is represented as 12
    //     .step(1)
    //     .width(pageWidth / 3) // Adjust the width as needed
    //     .tickValues(d3.range(1, 13, 1)) // Include all months as tick values
    //     .tickFormat((d) => {
    //         const months = [
    //             'January', 'February', 'March', 'April', 'May', 'June',
    //             'July', 'August', 'September', 'October', 'November', 'December'
    //         ];
    //         return months[d - 1]; // Adjust index to match months array
    //     });

    // // Append the slider to the slider SVG
    // sliderSvg.append('g')
    //     .attr('transform', 'translate(50,20)') // Adjust positioning as needed
    //     .attr("id", "slider_group")
    //     .call(slider)
    //     .attr('class', 'slider');

    // // Select all ticks and style them
    // sliderSvg.selectAll(".tick line")
    //     .style("stroke-width", "2px") // Adjust stroke width as needed
    //     .attr("y2", 10)
    //     .style("stroke", "black");


    




}

setup();
