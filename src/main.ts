// import React, { useState } from 'react';
import * as d3 from 'd3'
import { sliderBottom } from 'd3-simple-slider'
import { Button } from '@mantine/core';

const globalApplicationState = {
    // make this depend on what button is selected once implemented 
    current_species : ['eargre', 'amwpel'],
    current_states : ['ut_eg_geojsons', 'nv_eg_geojsons', 'mex_eg_geojsons', 'ca_eg_geojsons', 'az_eg_geojsons'],
    current_species_data : [''],
    current_year_selection : ''
}

globalApplicationState.current_species_data = [`${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species[0]}_2004`, 
`${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species[0]}_nv_2004`,
`${globalApplicationState.current_states[2]}/plot_${globalApplicationState.current_species[0]}_mex_2004`,
`${globalApplicationState.current_states[3]}/plot_${globalApplicationState.current_species[0]}_ca_2004`,
`${globalApplicationState.current_states[4]}/plot_${globalApplicationState.current_species[0]}_az_2004`]

const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function setup() {
    const body = d3.select('body')
    body.style("background-color", "white");

    // const header = body.append('div')
    //     .attr('class', 'header')
    //     .attr("id", "header");

    // const headerSvg = header.append("svg")
    //     .attr('id', 'headerSvg')
    //     .attr("height", 10)
    //     .attr("width", pageWidth);


    // const text = d3.select("#headerSvg").append("text")
    //     .attr("class", "text title")
    //     .attr("fill", "black")
    //     .text("Visualizing GSL Birds: Where are they going and why?");

    // const textWidth = text.node().getBBox().width;

    // text.attr("x", (pageWidth - textWidth) / 2)
    //     .attr("y", 25);

    const maps_div = body.append('div')
        .attr('class', 'container')
        .attr("id", "migration_div")
        .attr('height', pageHeight  + "px")
        .style("position", "fixed") 
        .style("right", "0px") 
        .style("width", pageWidth / 2 + "px")

    const migrationSvg = maps_div.append('svg')
        .attr('id', 'migrationSvg')
        .style("position", "absolute") 
        .style("right", "0px")
        .style("height", pageHeight)
        .attr('position', 'fixed')
        .attr("width", pageWidth / 2)
        // .attr('viewBox', `0 0 ${pageWidth / 2} ${pageHeight}`);

    const sliderSvg = body.append('svg')
        .attr('id', 'sliderSvg')
        .attr("height", pageHeight)
        .attr("width", pageWidth / 2)
        .style("position", "fixed") 
        .style("right", "0px") 

    const reveal_div = body.append('div')
        .attr('class', 'reveal')
        .attr('id', 'revealDiv')
        .style("position", "absolute") 
        .style("top", "5px") 
        .style("left", "0px") 
        .style("width", pageWidth / 2 + "px") 
        .style("height", pageHeight + "px") 
        .style("overflow", "hidden")
        .style("background-color", "#d3d3d3"); 

    const slides_div = reveal_div.append('div').attr('class', 'slides')

    // const opening_section = slides_div.append('section')
    //     .attr('data-auto-animate', 'running')
    //     .attr('data-background-iframe', 'https://tenor.com/view/living-color-tribe-edition-ayia-napa-living-color-tribe-edition-kaz-james-gif-26151239')
    //     .attr('data-background-interactive', '')

    // const opening = slides_div.append('section')
    //     .attr('data-auto-animate', 'running')
    //     .attr('id', 'animate_section')
    //     .attr('data-transition', 'fade-in')
    //     .append('h1')
    //     .style('color', 'black')
    //     .text('Navigating Bird Migrations in a Changing Climate')
    //     .style('font-size', '70px')
    //     .style('fill', 'black')
    //     .classed('fade-in', true); // Make sure to specify the fill color

    // opening.append('p').attr('class', 'fragment').text('Navigating Flight Paths');

    // const opening = slides_div.append('section')
    //     .attr('data-auto-animate', 'running')
    //     .attr('id', 'animate_section')
    //     .attr('data-transition', 'fade-in');

    // const pElement = document.createElement('p');
    // pElement.textContent = 'Navigating Bird Migrations in a Changing Climate';
    // pElement.style.color = 'black';
    // pElement.style.fontSize = '100px';
    // opening.node().appendChild(pElement);
    

    const opening = slides_div.append('section')
        .attr('data-auto-animate', '')
        .attr('data-auto-animate', 'running')
        .attr('id', 'animate_section')

    const opening2 = slides_div.append('section')
        .attr('data-auto-animate', '')
        .attr('data-auto-animate', 'running')
        .attr('id', 'animate_section2') 

    const title = document.createElement('p');
    const nextTitletextContent = 'THE TALE OF TWO BIRDS: \n FINDING THE FLIGHT OF \n LEAST RESISTANCE';
    const wrappedText = nextTitletextContent.split("\n").join("<br />");
    title.innerHTML = wrappedText;
    title.style.font = 'Bitstream Vera Sans Mono';
    title.style.fontStyle = 'Italic';
    title.style.animation = 'animate 2s linear forwards';
    title.style.animationFillMode = 'forwards';
    title.style.verticalAlign = 'center';
    title.style.textAlign = 'left';
    title.style.color = 'black';
    title.style.fontSize = '70px';
    title.style.paddingTop = '50px';
    title.style.paddingLeft = '110px';
    title.style.textOverflow = 'ellipsis'; 
    title.style.fontWeight = 'bold';
    opening.node().appendChild(title);

    const name = document.createElement('p');
    const nameContent = 'by: Zoe Exelbert';
    name.innerHTML = nameContent;
    name.style.font = 'Bitstream Vera Sans Mono';
    name.style.fontStyle = 'Italic';
    name.style.animation = 'animate 2s linear forwards';
    name.style.animationFillMode = 'forwards';
    name.style.verticalAlign = 'top';
    name.style.textAlign = 'left';
    name.style.color = 'black';
    name.style.fontSize = '40px';
    name.style.paddingLeft = '110px';
    name.style.textOverflow = 'ellipsis'; 
    // name.style.fontWeight = 'bold';
    opening.node().appendChild(name);


    const postTitle = document.createElement('p');
    const postTitleContent = 'THE TALE OF TWO BIRDS: \n FINDING THE FLIGHT OF \n LEAST RESISTANCE';
    const postTitleContentwrapped = postTitleContent.split("\n").join("<br />");
    postTitle.innerHTML = postTitleContentwrapped;
    postTitle.style.font = 'Bitstream Vera Sans Mono';
    postTitle.style.fontStyle = 'Italic';
    postTitle.style.animation = 'animate 2s linear forwards';
    postTitle.style.animationFillMode = 'forwards';
    postTitle.style.verticalAlign = 'top';
    postTitle.style.textAlign = 'left';
    postTitle.style.color = 'black';
    postTitle.style.fontSize = '70px';
    // postTitle.style.paddingTop = '50px';
    postTitle.style.paddingLeft = '110px';
    postTitle.style.textOverflow = 'ellipsis'; 
    postTitle.style.fontWeight = 'bold';
    opening2.node().appendChild(postTitle);

    const name2 = document.createElement('p');
    const name2Content = 'by: Zoe Exelbert';
    name2.innerHTML = name2Content;
    name2.style.font = 'Bitstream Vera Sans Mono';
    name2.style.fontStyle = 'Italic';
    name2.style.animation = 'animate 2s linear forwards';
    name2.style.animationFillMode = 'forwards';
    name2.style.verticalAlign = 'top';
    name2.style.textAlign = 'left';
    name2.style.color = 'black';
    name2.style.fontSize = '35px';
    name2.style.paddingLeft = '110px';
    name2.style.textOverflow = 'ellipsis'; 
    name2.style.fontWeight = 'bold';
    // opening2.node().appendChild(name2);


    const info = document.createElement('p');
    const infoContent = 'Bird migrations have evolved over time as a natural response \n to finding available resources and comfortable environments. \n However, climate change might be forcing these responses to \n occur more frequently, and perhaps unnaturally.';
    const infoContentwrapped = infoContent.split("\n").join("<br />");
    info.innerHTML = infoContentwrapped;
    info.style.font = 'Bitstream Vera Sans Mono';
    info.style.fontStyle = 'Italic';
    info.style.animation = 'animate 2s linear forwards';
    info.style.animationFillMode = 'forwards';
    info.style.verticalAlign = 'top';
    info.style.textAlign = 'left';
    info.style.color = 'black';
    info.style.fontSize = '20px';
    info.style.paddingLeft = '110px';
    info.style.textOverflow = 'ellipsis'; 
    // info.style.fontWeight = 'bold';
    // info.className = 'fade-in';    
    opening2.node().appendChild(info);

    const info2 = document.createElement('p');
    const info2Content = 'Here we will explore the migrations of the Eared Grebe and \n the American White Pelican as they travel to the Great Salt \n Lake over the past 20 years.';
    const info2Contentwrapped = info2Content.split("\n").join("<br />");
    info2.innerHTML = info2Contentwrapped;
    info2.style.font = 'Bitstream Vera Sans Mono';
    info2.style.fontStyle = 'Italic';
    info2.style.animation = 'animate 2s linear forwards';
    info2.style.animationFillMode = 'forwards';
    info2.style.verticalAlign = 'top';
    info2.style.textAlign = 'left';
    info2.style.color = 'black';
    info2.style.fontSize = '20px';
    info2.style.paddingLeft = '110px';
    info2.style.textOverflow = 'ellipsis'; 
    info.className = 'fade-in';    
    // info2.style.fontWeight = 'bold';
    opening2.node().appendChild(info2);
    
    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'Start Flying';
    // buttonElement.setAttribute('data-mantine', 'Button')
    buttonElement.style.fontSize = '14px'; 
    buttonElement.style.backgroundColor = 'blue'; 
    buttonElement.style.color = 'white';
    buttonElement.style.position = '150px';
    opening2.node().appendChild(buttonElement);

    const utahLat = 39.3210; 
    const utahLong = -111.0937; 

    const projection = d3.geoAlbers()
        // .center([utahLong, utahLat])
        .fitSize([pageWidth / 2, pageHeight], '')
        .center([0, 35.5]) 
        .translate([pageWidth / 4, pageHeight / 2])
    
    const customColorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([-0.5, 1]);

    const pathGenerator = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
        .scaleExtent([1, 8]) 
        .on('zoom', zoomed); 

    migrationSvg.call(zoom);

    // Define the zoom event handler function
    function zoomed(event) {
        // Get the current transformation
        const { transform } = event;
    
        // migrationSvg.selectAll('.bird-observation')
        //     .attr('transform', transform);
        
    }
    
    function zoomToUtah() {
        const utahLat = 39.3210; 
        const utahLong = -111.0937; 
        const utahScale = 4.8;
    
        // const [x, y] = projection([utahLong, utahLat]);
    
        // projection.scale(utahScale)
        //     .center([utahLong, utahLat])    
            // .translate([pageWidth / 4 - x * utahScale, pageHeight / 2 - y * utahScale]);
    
        migrationSvg.transition()
            .duration(3000)
            .attr('transform', `translate(${pageWidth / 2},${pageHeight / 2}) scale(${utahScale})`);
    }    

    buttonElement.addEventListener('click', function() {
        zoomToUtah();
        console.log("Button clicked, zoomToArea function called.");
    });


    Reveal.initialize({
        view: 'scroll',
        // center: 'false',
        scrollProgress: false,
        scrollLayout: 'full',
        // backgroundTransition: 'slide',
        autoAnimateEasing: 'ease-out',
        // autoAnimateDuration: 1.5
    });

    // Reveal.on( 'slidechanged', event => {

    //     const val = event.currentSlide.className.split("-")[1].split(" ")[0]
    //     updateSpeciesData(val)
    //     updateMap(val);
    // } );

    function updateSpeciesData(year) {
        globalApplicationState.current_species_data[0] = `${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species[0]}_${year}`;
        globalApplicationState.current_species_data[1] = `${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species[0]}_nv_${year}`;
        globalApplicationState.current_species_data[2] = `${globalApplicationState.current_states[2]}/plot_${globalApplicationState.current_species[0]}_mex_${year}`;
        globalApplicationState.current_species_data[3] = `${globalApplicationState.current_states[3]}/plot_${globalApplicationState.current_species[0]}_ca_${year}`;
        globalApplicationState.current_species_data[4] = `${globalApplicationState.current_states[4]}/plot_${globalApplicationState.current_species[0]}_az_${year}`;
    }  


    const slider = sliderBottom()
        .min(2004)
        .max(2023)
        .step(1)
        .width(pageWidth / 2.5) 
        .tickValues(d3.range(2004, 2024, 1)) 
        .tickFormat((d) => d) 
        .on('onchange', val => {
            updateSpeciesData(val)
            updateMap(val);
        });

    sliderSvg.append('g')
        .attr('transform', 'translate(60,400)') 
        .attr("id", "slider_group")
        .call(slider)
        .attr('class', 'slider');

    sliderSvg.selectAll(".tick line")
        .style("stroke-width", "2px") 
        .attr("y2", 10)
        .style("stroke", "black");

    let usStates;
    let mexicoStates;

    function appendStateBoundaries(usStatesData, mexicoStatesData) {
        migrationSvg.selectAll(".state-boundary")
            .data(usStatesData.features)
            .enter().append("path")
            .attr("class", "state-boundary")
            .attr("d", pathGenerator)
            .style("fill", "none") 
            .style("stroke", "black") 
            .style("stroke-width", 1); 
        migrationSvg.selectAll(".mexico-state-boundary")
            .data(mexicoStatesData.features)
            .enter().append("path")
            .attr("class", "mexico-state-boundary")
            .attr("d", pathGenerator)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", 1);
    }

    Promise.all([
        fetch(`${globalApplicationState.current_species_data[0]}.geojson`).then(response => response.json()),
        fetch(`${globalApplicationState.current_species_data[1]}.geojson`).then(response => response.json()),
        fetch(`${globalApplicationState.current_species_data[2]}.geojson`).then(response => response.json()),
        fetch(`${globalApplicationState.current_species_data[3]}.geojson`).then(response => response.json()),
        fetch(`${globalApplicationState.current_species_data[4]}.geojson`).then(response => response.json()),
        fetch('map_geojsons/us_states.geojson').then(response => response.json()), 
        fetch('map_geojsons/states.geojson').then(response => response.json()) 
    ])
    
    .then(data => {
        const [utBirdData, nvBirdData, mexBirdData, caBirdData, azBirdData, usStatesData, mexicoStatesData] = data;
        console.log('UT Bird population observation data:', utBirdData);
        console.log('NV Bird population observation data:', nvBirdData);
        console.log('MEX Bird population observation data:', mexBirdData);
        console.log('CA Bird population observation data:', caBirdData)
        console.log('AZ Bird population observation data:', azBirdData)
        console.log('US States GeoJSON data:', usStatesData);
        console.log('Mexico States GeoJSON data:', mexicoStatesData);

        projection.fitSize([pageWidth / 2, pageHeight], usStatesData)


        usStates = usStatesData
        mexicoStates = mexicoStatesData
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
        migrationSvg.selectAll(".nv-bird-observation")
            .data(nvBirdData.features)
            .enter().append("path")
            .attr("class", "nv-bird-observation")
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
        migrationSvg.selectAll(".mex-bird-observation")
            .data(mexBirdData.features)
            .enter().append("path")
            .attr("class", "mex-bird-observation")
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

        migrationSvg.selectAll(".ca-bird-observation")
            .data(caBirdData.features)
            .enter().append("path")
            .attr("class", "ca-bird-observation")
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

        migrationSvg.selectAll(".az-bird-observation")
            .data(azBirdData.features)
            .enter().append("path")
            .attr("class", "az-bird-observation")
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

        
        appendStateBoundaries(usStates, mexicoStates);
  
    })
    .catch(error => console.error('Error loading GeoJSON files:', error));


    function updateMap(year: number) {

        migrationSvg.selectAll(".state-boundary, .mexico-state-boundary").remove();

        appendStateBoundaries(usStates, mexicoStates);

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
                migrationSvg.selectAll(".nv-bird-observation").remove();
                
                // Append paths for bird observation data
                migrationSvg.selectAll(".nv-bird-observation")
                    .data(birdData.features)
                    .enter().append("path")
                    .attr("class", "nv-bird-observation")
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

        fetch(`${globalApplicationState.current_species_data[2]}.geojson`)
            .then(response => response.json())
            .then(birdData => {
                // Remove existing bird observation paths
                migrationSvg.selectAll(".mex-bird-observation").remove();
                
                // Append paths for bird observation data
                migrationSvg.selectAll(".mex-bird-observation")
                    .data(birdData.features)
                    .enter().append("path")
                    .attr("class", "mex-bird-observation")
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
            
        fetch(`${globalApplicationState.current_species_data[3]}.geojson`)
            .then(response => response.json())
            .then(birdData => {
                // Remove existing bird observation paths
                migrationSvg.selectAll(".ca-bird-observation").remove();
                
                // Append paths for bird observation data
                migrationSvg.selectAll(".ca-bird-observation")
                    .data(birdData.features)
                    .enter().append("path")
                    .attr("class", "ca-bird-observation")
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

        fetch(`${globalApplicationState.current_species_data[4]}.geojson`)
            .then(response => response.json())
            .then(birdData => {
                // Remove existing bird observation paths
                migrationSvg.selectAll(".az-bird-observation").remove();
                
                // Append paths for bird observation data
                migrationSvg.selectAll(".az-bird-observation")
                    .data(birdData.features)
                    .enter().append("path")
                    .attr("class", "az-bird-observation")
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
