// import React, { useState } from 'react';
import * as d3 from 'd3'
import { sliderBottom, sliderTop } from 'd3-simple-slider'
import { Button } from '@mantine/core';

// Setting up global applicatino state, stores variables for the current species, the names of the geojsons, and the current years. 
// Always updates as the user scrolls to allow functionality for different species, states, and years. 
const globalApplicationState = {
    // make this depend on what button is selected once implemented 
    all_data : null,
    current_species : ['eargre', 'amwpel'],
    current_states : ['ut_eg_geojsons', 'nv_eg_geojsons', 'mex_eg_geojsons', 'ca_eg_geojsons', 'az_eg_geojsons'],
    current_species_data : [''],
    current_year_selection : ''
}

// Defines the current species data based on the current species, storing a list of geojson data that displays the current species' state data for each state in May of 2023. 
globalApplicationState.current_species_data = [`birds/${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species[0]}_ut_9_2023`, 
`birds/${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species[0]}_nv_9_2023`,
`birds/${globalApplicationState.current_states[2]}/plot_${globalApplicationState.current_species[0]}_mx_9_2023`,
`birds/${globalApplicationState.current_states[3]}/plot_${globalApplicationState.current_species[0]}_ca_9_2023`,
`birds/${globalApplicationState.current_states[4]}/plot_${globalApplicationState.current_species[0]}_az_9_2023`]

// Constants for the page and height width. 
const pageWidth = window.innerWidth - 40 || document.documentElement.clientWidth || document.body.clientWidth;
const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

// Setups the HTML body. 
function setup() {
    const body = d3.select('body')
    body.style("background-color", "white"); 

    const opening = document.querySelector(".opening");




    const resizeObserver = new ResizeObserver(entries => {
        console.log(entries)
        entries.forEach(entry => {
            const { width, height } = entry.contentRect;
    
            
            // entry.target.style.height = "auto"; 
            // entry.target.style.fontSize = `${width / 20}px`; 
    
            console.log(`Resized: ${entry.target.tagName}, Width: ${width}, Height: ${height}`);
        });
    });
    

    const openingStoryline = document.querySelector(".opening_storyline");
    const storylineHeight = openingStoryline.offsetHeight;

    resizeObserver.observe(opening);
    
    let scrollProgress = 0; 
    window.addEventListener("wheel", (event) => {
        if (event.deltaY > 0) {
            scrollProgress = Math.min(scrollProgress + 10, 100); // Scroll down (capped at 100)
        } else {
            scrollProgress = Math.max(scrollProgress - 10, 0); // Scroll up (capped at 0)
        }
    
        // Trigger transitions
        if (scrollProgress >= 50) {
            // Make opening disappear 
            opening.style.opacity = 0;
            // Move and fade in openingStoryline
            openingStoryline.style.transform = `translateY(-${storylineHeight}px)`; // Adjust based on its height
            openingStoryline.style.opacity = 1;
        } else {
            opening.style.opacity = 1;
            // Reset openingStoryline position and opacity
            openingStoryline.style.transform = "translateY(0)";
            openingStoryline.style.opacity = 0;
        }
    });

    document.getElementById('grebe-button').addEventListener('click', function() {
        console.log('grebe button clicked');
        changeContent('grebe'); // Show Grebe content
    });
    
    document.getElementById('pelican-button').addEventListener('click', function() {
        changeContent('pelican'); // Show Pelican content
    });

    const grebeContent = document.querySelector('.grebe-content');
    const pelicanContent = document.querySelector('.pelican-content');
    
    // // Function to change content based on the button clicked
    function changeContent(birdType) {
        if (birdType === 'grebe' && pelicanContent.style.visibility != 'visible') {
            console.log('grebe change content function called');
            opening.style.display = 'none'; 
            openingStoryline.style.display = 'none'; 
            grebeContent.style.visibility = 'visible'; // Show the Grebe content
            grebeContent.style.opacity = 1; // Fade the Grebe content in
        } 
        else if (birdType === 'pelican') {
            opening.style.display = 'none'; 
            openingStoryline.style.display = 'none'; 
            grebeContent.style.display = 'none';
            pelicanContent.style.visibility = 'visible'; 
            pelicanContent.style.opacity = 1; 
      }
    }

    const projection = d3.geoAlbers()
    const path = d3.geoPath().projection(projection);
    const egMap = document.querySelector
    var svg = d3.select("#grebe-map svg");
    d3.json('birds/map_geojsons/us_states.geojson').then(function(geojson) {

        svg.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path) 
            .attr("fill", "lightblue")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);

    }).catch(function(error) {
        console.error("Error loading the GeoJSON file: ", error);
    });
    
    

    



























//     // Append div designated for map visualizations
//     const maps_div = body.append('div')
//         .attr("id", "migration_div")
//         .attr('height', pageHeight + "px")
//         .style("position", "fixed") 
//         .style("right", "0px") 
//         .style("width", pageWidth / 2 + "px")
//         .style("z-index", "-1")


//     // Append svg onto map div 
//     const migrationSvg = maps_div.append('svg')
//         .attr('id', 'migrationSvg')
//         .style("height", pageHeight)
//         .attr('position', 'fixed')
//         .attr("width", pageWidth / 2)
//         .style('margin-top', 10)
//         .style('margin-bottom', '10px')

//     // Add class of paths for bird pixel projection onto U.S. map 
//     migrationSvg.append('g').attr('class', 'pathsG')
//     const projection = d3.geoAlbers()

//     // Create reveal div for the storyline 
//     const reveal_div = body.append('div')
//         .attr('id', 'revealDiv')
//         .style("width", pageWidth / 2.5 + "px") 
//         .style("height", 10000 + "px") 
//         .style("overflow", "hidden")
//         .style("background-color", "white")

    

//     // Focuses "bolds" text based on user scrolling position
//     function bringTextIntoFocus(element) {
//         element.style.opacity = '1'
//         // element.style.fontWeight = 'bold';
//         element.style.textShadow = '0.4px 0.4px 0.35px rgba(0,0,0,0.5)';
//     }
    
//     // UNfocuses "UNbolds" text based on user scrolling position
//     function turnTextOutOfFocus(element) {
//         element.style.fontWeight = 'normal';
//         element.style.opacity = '0.5';
//     }
    
//     // Checks to see if the text is within "view" based on user scrolling position 
//     function isInViewport(element) {
//         const bounding = element.getBoundingClientRect();
//         return (
//             bounding.top >= 0 &&
//             bounding.left >= 0 &&
//             bounding.bottom <= (window.innerHeight) &&
//             bounding.right <= (window.innerWidth) &&
//             (element === opening2 || bounding.top <= window.innerHeight) // Focus on opening2 or if the element is 60% visible
//         );
//     }    

//     // Set hasZoomed to false and change to true when user meets the scrolling position that triggers the utah zooming vis
//     let hasZoomed = false; 

//     // Adds event listener to scroll to trigger text focusing functions
//     window.addEventListener('scroll', () => {
//         const scrollPosition = window.scrollY;
//         const elements = document.querySelectorAll('.element')

//         elements.forEach(element => {
//             if (isInViewport(element)) {
//                 bringTextIntoFocus(element);
//             } else {
//                 turnTextOutOfFocus(element);
//             }
//         });

//         // Triggers zoomToUtah function (zooming into Utah vis) and changes state of hasZoomed
//         // if (scrollPosition>= textPosition && !hasZoomed) {
//         //     zoomToUtah();
//         //     hasZoomed = true; // Update variable
//         // }

//         // Reverts website to previous state before zooming into Utah vis
//         // Here might be where the boundary lines of the states are not being redrawn correctly
//         // else if (scrollPosition < textPosition && hasZoomed) {
//         //     const [utBirdData, nvBirdData, mexBirdData, caBirdData, azBirdData, usStatesData, mexicoStatesData] = globalApplicationState.all_data;
//         //     projection.fitSize([pageWidth / 2, pageHeight - 65], {...usStatesData, features: [...usStatesData.features, ...mexicoStatesData.features]});
//         //     // draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator);
//         //     zoomOut();
//         //     hasZoomed = false;
//         // }
//      });

        
//     const utahLat = 39.3210; 
//     const utahLong = -111.0937; 

//     const customColorScale = d3.scaleSequential(d3.interpolateBlues)
//         .domain([0, 1]);

//     // Create color legend for pixel population count  
//     function createColorLegend(colorScale) {
//         const legendWidth = 40; 
//         const legendHeight = 180; 
//         const numTicks = 5; 
    
//         const legendScale = d3.scaleLinear()
//             .domain([0, 1])
//             .range([legendHeight, 0]); 

//         const legend = migrationSvg.append("g")
//             .attr("class", "legend")
//             .attr("transform", `translate(${legendWidth - 50}, ${pageHeight - legendHeight - 80})`); 

//         legend.selectAll("rect")
//             .data(d3.range(0, 1.01, 0.01)) 
//             .enter().append("rect")
//             .attr("x", 0)
//             .attr("y", d => legendScale(d))
//             .attr("width", legendWidth)
//             .attr("height", legendHeight / 100) 
//             .style("fill", d => colorScale(d));
    
//         const tickValues = d3.range(0, 1.01, 0.2); 
//         const tickFormat = d3.format(".1f");
//         const tickHeight = legendHeight / numTicks;
    
//         legend.selectAll(".tick")
//             .data(tickValues)
//             .enter().append("line")
//             .attr("class", "tick")
//             .attr("x1", legendWidth)
//             .attr("y1", d => legendScale(d))
//             .attr("x2", legendWidth + 6) 
//             .attr("y2", d => legendScale(d))
//             .style("stroke", "black")
//             .style('font-weight', 'bold')

    
//         legend.selectAll(".tick-label")
//             .data(tickValues)
//             .enter().append("text")
//             .attr("class", "tick-label")
//             .attr("x", legendWidth + 13) 
//             .attr("y", d => legendScale(d))
//             .attr("dy", "0.35em")
//             .attr("text-anchor", "start")
//             .style("font-size", "18px") 
//             // .style('font-weight', 'bold')
//             .text(d => tickFormat(d));
//     }
    
//     createColorLegend(customColorScale);
    
//     const pathGenerator = d3.geoPath().projection(projection);

//     const zoom = d3.zoom()
//         .scaleExtent([1, 8]) 
//         .on('zoom', zoomed); 

//     migrationSvg.call(zoom);
    
//     function zoomed(event) {
//         const { transform } = event;
//         // Select the first path within the g element with class pathsG
//         const firstPathInGroup = d3.select('.pathsG').select('path');
//         // Apply the zoom transformation to the first path
//         firstPathInGroup.attr("transform", transform);
//         // Log the event for debugging
//         console.log(event);
//     }


//     function zoomToUtah() {

//         const [utBirdData, nvBirdData, mexBirdData, caBirdData, azBirdData, usStatesData, mexicoStatesData] = globalApplicationState.all_data 
//         const center = d3.geoCentroid(usStatesData.features[21])
//         projection.center(center).fitSize([pageWidth / 2, pageHeight - 70], { ...usStatesData, features : [usStatesData.features[21]]})
//         appendStateBoundaries(usStatesData, mexicoStatesData, pathGenerator)
//         draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator)    
//     }    

//     function zoomOut() {

//         const [utBirdData, nvBirdData, mexBirdData, caBirdData, azBirdData, usStatesData, mexicoStatesData] = globalApplicationState.all_data;
//         projection.fitSize([pageWidth / 2, pageHeight - 65], {...usStatesData, features: [...usStatesData.features, ...mexicoStatesData.features]})
//         draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator)
//         appendStateBoundaries(usStatesData, mexicoStatesData, pathGenerator)
//     }
    


//     function draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator) {

//         // const center = d3.geoCentroid(usStatesData.features[21])
//         // projection.center(center).fitSize([pageWidth / 2, pageHeight], { ...usStatesData, features : [usStatesData.features[21]]})

//         // migrationSvg.selectAll().remove();
        
//         const pathsG = migrationSvg.select('.pathsG');

//         pathsG.selectAll(".bird-observation")
//             .data(utBirdData.features)
//             .join(
//                 enter => enter.append("path")
//                 .attr("class", "bird-observation")
//                 .attr("d", pathGenerator)
//                 .style("fill", "white"), // Start with white fill for all pixels
//             update => update,
//             exit => exit.remove()
//             )
//             .attr("class", "bird-observation")
//             .transition().duration(500)
//             .attr("d", pathGenerator)
//             .delay((d, i) => i * 3)
//             .style("fill", d => {
//                 if (d.properties.eargre === 'NA') {
//                     return 'white'; // No data, same color as background
//                 } else {
//                     const value = +d.properties.eargre; // Convert to number
//                     // Map values close to 0 to a color closer to the background
//                     return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//                 }
//             });

//             pathsG.selectAll(".nv-bird-observation")
//             .data(nvBirdData.features)
//             .join(
//                 enter => enter.append("path")
//                 .attr("class", "bird-observation")
//                 .attr("d", pathGenerator)
//                 .style("fill", "white"), // Start with white fill for all pixels
//             update => update,
//             exit => exit.remove()
//             )
//             .attr("class", "bird-observation")
//             .transition().duration(500)
//             .attr("d", pathGenerator)
//             .delay((d, i) => i * 3)
//             .style("fill", d => {
//                 if (d.properties.eargre === 'NA') {
//                     return 'none'; // No data, same color as background
//                 } else {
//                     const value = +d.properties.eargre; // Convert to number
//                     // Map values close to 0 to a color closer to the background
//                     return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//                 }
//             });
//         pathsG.selectAll(".mex-bird-observation")
//             .data(mexBirdData.features)
//             .join(
//                 enter => enter.append("path")
//                 .attr("class", "bird-observation")
//                 .attr("d", pathGenerator)
//                 .style("fill", "white"), // Start with white fill for all pixels
//             update => update,
//             exit => exit.remove()
//             )
//             .attr("class", "bird-observation")
//             .transition().duration(500)
//             .delay((d, i) => i * 3)
//             .attr("d", pathGenerator)
//             .style("fill", d => {
//                 if (d.properties.eargre === 'NA') {
//                     return 'none'; // No data, same color as background
//                 } else {
//                     const value = +d.properties.eargre; // Convert to number
//                     // Map values close to 0 to a color closer to the background
//                     return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//                 }
//             });

//         pathsG.selectAll(".ca-bird-observation")
//             .data(caBirdData.features)
//             .join(
//                 enter => enter.append("path")
//                 .attr("class", "bird-observation")
//                 .attr("d", pathGenerator)
//                 .style("fill", "white"), // Start with white fill for all pixels
//             update => update,
//             exit => exit.remove()
//             )
//             .attr("class", "bird-observation")
//             .transition().duration(500)
//             .delay((d, i) => i * 1.2)
//             .attr("d", pathGenerator)
//             .style("fill", d => {
//                 if (d.properties.eargre === 'NA') {
//                     return 'none'; // No data, same color as background
//                 } else {
//                     const value = +d.properties.eargre; // Convert to number
//                     // Map values close to 0 to a color closer to the background
//                     return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//                 }
//             });

//         pathsG.selectAll(".az-bird-observation")
//             .data(azBirdData.features)
//             .join(
//                 enter => enter.append("path")
//                 .attr("class", "bird-observation")
//                 .attr("d", pathGenerator)
//                 .style("fill", "white"), // Start with white fill for all pixels
//             update => update,
//             exit => exit.remove()
//             )
//             .attr("class", "bird-observation")
//             .transition().duration(500)
//             .delay((d, i) => i * 3)
//             .attr("d", pathGenerator)
//             .style("fill", d => {
//                 if (d.properties.eargre === 'NA') {
//                     return 'none'; // No data, same color as background
//                 } else {
//                     const value = +d.properties.eargre; // Convert to number
//                     // Map values close to 0 to a color closer to the background
//                     return value < 0.01 ? d3.interpolate("#FFFFFF", customColorScale(value))(0.1) : customColorScale(value);
//                 }
//             });
        
//         appendStateBoundaries(usStatesData, mexicoStatesData, pathGenerator);
//         updateSpeciesData(2023)
//     }

//     function updateSpeciesData(year) {
//         globalApplicationState.current_species_data[0] = `${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species[0]}_ut_3_${year}`;
//         globalApplicationState.current_species_data[1] = `${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species[0]}_nv_3_${year}`;
//         globalApplicationState.current_species_data[2] = `${globalApplicationState.current_states[2]}/plot_${globalApplicationState.current_species[0]}_mex_3_${year}`;
//         globalApplicationState.current_species_data[3] = `${globalApplicationState.current_states[3]}/plot_${globalApplicationState.current_species[0]}_ca_3_${year}`;
//         globalApplicationState.current_species_data[4] = `${globalApplicationState.current_states[4]}/plot_${globalApplicationState.current_species[0]}_az_3_${year}`;
//     }  

//     //  const sliderSvg = migrationSvg.append('svg')
//     //     .attr('id', 'sliderSvg')
//     //     .attr("height", pageHeight)
//     //     .attr("width", pageWidth / 2)
//     //     .style("position", "fixed") 
//     //     .style("right", "0px") 

//     // const slider = sliderBottom()
//     //     .min(2004)
//     //     .max(2023)
//     //     .step(1)
//     //     .width(pageWidth / 5) 
//     //     .tickValues(d3.range(2004, 2024, -1)) 
//     //     .tickFormat((d) => d) 
//     //     // .on('onchange', val => {
//     //     //     updateSpeciesData(val)
//     //     //     updateMap(val);
//     //     // });

//     // sliderSvg.append('g')
//     //     .attr('transform', `translate(60,${pageHeight / 1.1}) rotate(-90)`) 
//     //     .attr("id", "slider_group")
//     //     .call(slider)
//     //     .attr('class', 'slider');

//     // sliderSvg.selectAll('.tick text')
//     //     .style('font-size', '100px')  // Change the font size as desired
//     //     .attr('transform', 'rotate(-45)');

//     // sliderSvg.selectAll(".tick line")
//     //     .style("stroke-width", "2px") 
//     //     .attr("y2", 10)
//     //     .style("stroke", "black")
//     //     .style('stroke-weight', '2px');

//     let usStates;
//     let mexicoStates;

//     migrationSvg.append("rect")
//         .attr("x", pageWidth / 2.7)  
//         .attr("y", pageHeight / 1.4)  
//         .attr("width", 20)  
//         .attr("height", 20)  
//         .style("fill", '#cadecb')
//         .style("stroke", "black") // Add border color
//         .style("stroke-width", 1);

//     migrationSvg.append("text")
//         .attr("x", pageWidth / 2.55)  
//         .attr("y", pageHeight / 1.38) 
//         .style('font-size', '15px')
//         .attr("alignment-baseline", "middle")
//         .text("Outside of ")
//         .append("tspan")
//         .attr("x", pageWidth / 2.55)  // Set the same x value as the main text
//         .text("Migration Route")
//         .attr("dy", "1.2em");

//     // Append a rectangle to use the pattern fill
//     migrationSvg.append("rect")
//         .attr("x", pageWidth / 2.7)  
//         .attr("y", pageHeight / 1.26)  
//         .attr("width", 20)  
//         .attr("height", 20) 
//         .style("fill", 'white')
//         .style("stroke", "black") // Add border color
//         .style("stroke-width", 1);

//     migrationSvg.append("text")
//         .attr("x", pageWidth / 2.55)  
//         .attr("y", pageHeight / 1.25) 
//         .style('font-size', '15px')
//         .attr("alignment-baseline", "middle")
//         .text("Pacific Flyway")
//         .append("tspan")
//         .attr("x", pageWidth / 2.55)  // Set the same x value as the main text
//         .text("Migration Route")
//         .attr("dy", "1.2em");

//     migrationSvg.append("text")
//         .attr("x", pageWidth / 2.8)
//         .attr("y", "10")
//         .style('font-size', '20px')
//         .attr("alignment-baseline", "middle")
//         .text("September 2023")
//         .style('font-family', 'Schotis Text Book')

//     function appendStateBoundaries(usStatesData, mexicoStatesData, pathGenerator) {
//         const pathsG = d3.select('.pathsG')

//         // Added this to first remoce the boundaries before redrawing them
//         pathsG.selectAll(".state-boundary").remove();
//         pathsG.selectAll(".mexico-state-boundary").remove();


//         pathsG.selectAll(".state-boundary")
//             .data(usStatesData.features)
//             .join("path")
//             .attr("class", "state-boundary")
//             .attr("d", pathGenerator)
//             .style("fill", d => {
//                 if (["California", "Utah", "Arizona", "Nevada", "Idaho", "Washington", "Oregon"].includes(d.properties.NAME)) {
//                     return "none"; 
//                 } else {
//                     return "#cadecb"; 
//                 }
//             })
//             .style("stroke", "black")
//             .style("stroke-width", 1);

//         pathsG.selectAll(".mexico-state-boundary")
//             .data(mexicoStatesData.features)
//             .join("path")
//             .attr("class", "mexico-state-boundary")
//             .attr("d", pathGenerator)
//             .style("fill", "none")
//             .style("stroke", "black")
//             .style("stroke-width", 1);
//     }

//     Promise.all([
//         fetch(`${globalApplicationState.current_species_data[0]}.geojson`).then(response => response.json()),
//         fetch(`${globalApplicationState.current_species_data[1]}.geojson`).then(response => response.json()),
//         fetch(`${globalApplicationState.current_species_data[2]}.geojson`).then(response => response.json()),
//         fetch(`${globalApplicationState.current_species_data[3]}.geojson`).then(response => response.json()),
//         fetch(`${globalApplicationState.current_species_data[4]}.geojson`).then(response => response.json()),
//         fetch('birds/map_geojsons/us_states.geojson').then(response => response.json()), 
//         fetch('birds/map_geojsons/states.geojson').then(response => response.json()) 
//     ])

//     .then(data => {
//         const [utBirdData, nvBirdData, mexBirdData, caBirdData, azBirdData, usStatesData, mexicoStatesData] = data;
//         globalApplicationState.all_data = data;
//         console.log('UT Bird population observation data:', utBirdData);
//         console.log('NV Bird population observation data:', nvBirdData);
//         console.log('MEX Bird population observation data:', mexBirdData);
//         console.log('CA Bird population observation data:', caBirdData)
//         console.log('AZ Bird population observation data:', azBirdData)
//         console.log('US States GeoJSON data:', usStatesData);
//         console.log('Mexico States GeoJSON data:', mexicoStatesData);

//         projection.fitSize([pageWidth / 2, pageHeight - 65], {...usStatesData, features: [...usStatesData.features, ...mexicoStatesData.features]})

//         usStates = usStatesData
//         mexicoStates = mexicoStatesData

//         draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator)
  
//     })
//     .catch(error => console.error('Error loading GeoJSON files:', error));

//     // function updateMap(year: number) {

//     //     migrationSvg.selectAll(".state-boundary, .mexico-state-boundary").remove();

//     //     appendStateBoundaries(usStates, mexicoStates);

//     //     fetch(`${globalApplicationState.current_species_data[0]}.geojson`)
//     //         .then(response => response.json())
//     //         .then(birdData => {
//     //             // Remove existing bird observation paths
//     //             migrationSvg.selectAll(".bird-observation").remove();
                
//     //             // Append paths for bird observation data
//     //             migrationSvg.selectAll(".bird-observation")
//     //                 .data(birdData.features)
//     //                 .enter().append("path")
//     //                 .attr("class", "bird-observation")
//     //                 .attr("d", pathGenerator)
//     //                 .style("fill", d => {
//     //                     if (d.properties.eargre === 'NA') {
//     //                         return 'none'; // No data, same color as background
//     //                     } else {
//     //                         const value = +d.properties.eargre; // Convert to number
//     //                         // Map values close to 0 to a color closer to the background
//     //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//     //                     }
//     //                 });
//     //         })
//     //         .catch(error => console.error('Error updating map:', error));

//     //     fetch(`${globalApplicationState.current_species_data[1]}.geojson`)
//     //         .then(response => response.json())
//     //         .then(birdData => {
//     //             // Remove existing bird observation paths
//     //             migrationSvg.selectAll(".nv-bird-observation").remove();
                
//     //             // Append paths for bird observation data
//     //             migrationSvg.selectAll(".nv-bird-observation")
//     //                 .data(birdData.features)
//     //                 .enter().append("path")
//     //                 .attr("class", "nv-bird-observation")
//     //                 .attr("d", pathGenerator)
//     //                 .style("fill", d => {
//     //                     if (d.properties.eargre === 'NA') {
//     //                         return 'none'; // No data, same color as background
//     //                     } else {
//     //                         const value = +d.properties.eargre; // Convert to number
//     //                         // Map values close to 0 to a color closer to the background
//     //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//     //                     }
//     //                 });
//     //         })
//     //         .catch(error => console.error('Error updating map:', error));

//     //     fetch(`${globalApplicationState.current_species_data[2]}.geojson`)
//     //         .then(response => response.json())
//     //         .then(birdData => {
//     //             // Remove existing bird observation paths
//     //             migrationSvg.selectAll(".mex-bird-observation").remove();
                
//     //             // Append paths for bird observation data
//     //             migrationSvg.selectAll(".mex-bird-observation")
//     //                 .data(birdData.features)
//     //                 .enter().append("path")
//     //                 .attr("class", "mex-bird-observation")
//     //                 .attr("d", pathGenerator)
//     //                 .style("fill", d => {
//     //                     if (d.properties.eargre === 'NA') {
//     //                         return 'none'; // No data, same color as background
//     //                     } else {
//     //                         const value = +d.properties.eargre; // Convert to number
//     //                         // Map values close to 0 to a color closer to the background
//     //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//     //                     }
//     //                 });
//     //         })
//     //         .catch(error => console.error('Error updating map:', error));  
            
//     //     fetch(`${globalApplicationState.current_species_data[3]}.geojson`)
//     //         .then(response => response.json())
//     //         .then(birdData => {
//     //             // Remove existing bird observation paths
//     //             migrationSvg.selectAll(".ca-bird-observation").remove();
                
//     //             // Append paths for bird observation data
//     //             migrationSvg.selectAll(".ca-bird-observation")
//     //                 .data(birdData.features)
//     //                 .enter().append("path")
//     //                 .attr("class", "ca-bird-observation")
//     //                 .attr("d", pathGenerator)
//     //                 .style("fill", d => {
//     //                     if (d.properties.eargre === 'NA') {
//     //                         return 'none'; // No data, same color as background
//     //                     } else {
//     //                         const value = +d.properties.eargre; // Convert to number
//     //                         // Map values close to 0 to a color closer to the background
//     //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//     //                     }
//     //                 });
//     //         })
//     //         .catch(error => console.error('Error updating map:', error));  

//     //     fetch(`${globalApplicationState.current_species_data[4]}.geojson`)
//     //         .then(response => response.json())
//     //         .then(birdData => {
//     //             // Remove existing bird observation paths
//     //             migrationSvg.selectAll(".az-bird-observation").remove();
                
//     //             // Append paths for bird observation data
//     //             migrationSvg.selectAll(".az-bird-observation")
//     //                 .data(birdData.features)
//     //                 .enter().append("path")
//     //                 .attr("class", "az-bird-observation")
//     //                 .attr("d", pathGenerator)
//     //                 .style("fill", d => {
//     //                     if (d.properties.eargre === 'NA') {
//     //                         return 'none'; // No data, same color as background
//     //                     } else {
//     //                         const value = +d.properties.eargre; // Convert to number
//     //                         // Map values close to 0 to a color closer to the background
//     //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
//     //                     }
//     //                 });
//     //         })
//     //         .catch(error => console.error('Error updating map:', error));  
            
//     // }

}

setup();