// import React, { useState } from 'react';
import * as d3 from 'd3'
import { sliderBottom } from 'd3-simple-slider'
import { Button } from '@mantine/core';

const globalApplicationState = {
    // make this depend on what button is selected once implemented 
    all_data : null,
    current_species : ['eargre', 'amwpel'],
    current_states : ['ut_eg_geojsons', 'nv_eg_geojsons', 'mex_eg_geojsons', 'ca_eg_geojsons', 'az_eg_geojsons'],
    current_species_data : [''],
    current_year_selection : ''
}

globalApplicationState.current_species_data = [`${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species[0]}_ut_3_2023`, 
`${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species[0]}_nv_5_2023`,
`${globalApplicationState.current_states[2]}/plot_${globalApplicationState.current_species[0]}_mx_5_2023`,
`${globalApplicationState.current_states[3]}/plot_${globalApplicationState.current_species[0]}_ca_5_2023`,
`${globalApplicationState.current_states[4]}/plot_${globalApplicationState.current_species[0]}_az_5_2023`]

const pageWidth = window.innerWidth - 40 || document.documentElement.clientWidth || document.body.clientWidth;
const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function setup() {
    const body = d3.select('body')
    body.style("background-color", "white");

    // const header = body.append('div')
    //     .attr('class', 'header')
    //     .attr("id", "header")
    //     .attr('height', 40)
    //     .style("z-index", "2000");

    // const headerSvg = header.append("svg")
    //     .attr('id', 'headerSvg')
    //     .attr("height", 40)
    //     .attr("width", pageWidth)

    // const text = d3.select("#headerSvg").append("text")
    //     .attr("class", "text title")
    //     .attr("fill", "black")
    //     .text("GSLBirdVis")
    //     .attr('y', 25)
    //     .attr('font-size', '30px')

    const maps_div = body.append('div')
        .attr('class', 'container')
        .attr("id", "migration_div")
        .attr('height', pageHeight + "px")
        .style("position", "fixed") 
        .style("right", "0px") 
        .style("width", pageWidth / 2 + "px")

    const margin = 25;

    const migrationSvg = maps_div.append('svg')
        .attr('id', 'migrationSvg')
        .style("position", "absolute") 
        .style("right", "0px")
        .style("height", pageHeight)
        .attr('position', 'fixed')
        .attr("width", pageWidth / 2)
        .style('margin', '20px')
        .style('margin-bottom', '190px')
        .attr("viewBox", `0 0 ${pageWidth / 2} ${pageHeight + margin}`)

    // const sliderSvg = body.append('svg')
    //     .attr('id', 'sliderSvg')
    //     .attr("height", pageHeight)
    //     .attr("width", pageWidth / 2)
    //     .style("position", "fixed") 
    //     .style("right", "0px") 

    const reveal_div = body.append('div')
        .attr('class', 'reveal')
        .attr('id', 'revealDiv')
        .style("position", "absolute") 
        .style("top", "5px") 
        .style("left", "0px") 
        .style("width", pageWidth / 2 + "px") 
        .style("height", pageHeight + "px") 
        .style("overflow", "hidden")
        .style("background-color", "#d3d3d3")
        .style('margin', '10px'); 

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
        // .attr('data-auto-animate', 'running')
        // .attr('id', 'animate_section')

    const opening2 = slides_div.append('section')
        .attr('data-auto-animate', '')
        .attr('data-auto-animate', 'running')
        // .attr('id', 'animate_section') 
        // .attr('data-state', "make-it-pop")
        // .style('position', 'relative')

    
    const title = document.createElement('p');
    const nextTitletextContent = 'THE TALE OF TWO BIRDS: \n FINDING THE FLIGHT OF \n LEAST RESISTANCE';
    const wrappedText = nextTitletextContent.split("\n").join("<br />");
    title.innerHTML = wrappedText;
    title.style.font = 'Bitstream Vera Sans Mono';
    title.style.fontStyle = 'Italic';
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
    postTitle.style.paddingLeft = '110px';
    postTitle.style.textOverflow = 'ellipsis'; 
    postTitle.style.fontWeight = 'bold';
    opening2.node().appendChild(postTitle);

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
    opening2.node().appendChild(info2);
    
    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'Start Flying';
    // buttonElement.setAttribute('data-mantine', 'Button')
    buttonElement.style.fontSize = '20px'; 
    buttonElement.style.position = 'unset';
    buttonElement.style.marginRight = '200px';
    buttonElement.style.backgroundColor = '#6082B6'; 
    buttonElement.style.color = 'white';
    buttonElement.style.width = '120px'; 
    buttonElement.style.height = '40px';   
    buttonElement.style.borderRadius = '20px'; 
    buttonElement.style.border = '2px solid white';
    opening2.node().appendChild(buttonElement);

    
    function navigateToNextSlide() {
        Reveal.next(); 
      }

        // Create a new section for the additional slide
    // const additionalSlide = slides_div.append('section')
    // //     .attr('data-auto-animate', 'running')
    //     .attr('data-auto-animate-id', 'additional_slide') // Unique ID for the new slide
    //     // .attr('data-auto-animate-restart', '') // Prevent auto-animate with the previous slide
    //     // .style('position', 'relative');

    // // // Add content to the new slide
    // const additionalTitle = document.createElement('p');
    // additionalTitle.textContent = 'Additional Slide Content';
    // // Add any additional content you want for the new slide
    // additionalSlide.node().appendChild(additionalTitle);


    buttonElement.addEventListener('click', navigateToNextSlide);


    // buttonElement.addEventListener('click', function() {  
    //     console.log('clicked')
    //     Reveal.next(3)
    // });

    // const gsl_title = document.createElement('p');
    // const gslTitletextContent = 'Bird reliance on GSL';
    // // const wrappedText = nextTitletextContent.split("\n").join("<br />");
    // gsl_title.innerHTML = gslTitletextContent;
    // gsl_title.style.font = 'Bitstream Vera Sans Mono';
    // gsl_title.style.fontStyle = 'Italic';
    // gsl_title.style.verticalAlign = 'center';
    // gsl_title.style.textAlign = 'left';
    // gsl_title.style.color = 'black';
    // gsl_title.style.fontSize = '70px';
    // gsl_title.style.paddingTop = '50px';
    // gsl_title.style.paddingLeft = '110px';
    // gsl_title.style.textOverflow = 'ellipsis'; 
    // gsl_title.style.fontWeight = 'bold';
    // gslSlide.node().appendChild(gsl_title);
        

    const utahLat = 39.3210; 
    const utahLong = -111.0937; 

    const projection = d3.geoAlbers()
        .translate([pageWidth / 4, pageHeight / 2])
    
    const customColorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 1]);

        function createColorLegend(colorScale) {
            const legendWidth = 50; 
            const legendHeight = 300; 
            const numTicks = 5; 
        
            const legendScale = d3.scaleLinear()
                .domain([0, 1])
                .range([legendHeight, 0]); 

            const legend = migrationSvg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(1130,730)"); 

            legend.selectAll("rect")
                .data(d3.range(0, 1.01, 0.01)) 
                .enter().append("rect")
                .attr("x", 0)
                .attr("y", d => legendScale(d))
                .attr("width", legendWidth)
                .attr("height", legendHeight / 100) 
                .style("fill", d => colorScale(d));
        
            const tickValues = d3.range(0, 1.01, 0.2); 
            const tickFormat = d3.format(".1f");
            const tickHeight = legendHeight / numTicks;
        
            legend.selectAll(".tick")
                .data(tickValues)
                .enter().append("line")
                .attr("class", "tick")
                .attr("x1", legendWidth)
                .attr("y1", d => legendScale(d))
                .attr("x2", legendWidth + 6) 
                .attr("y2", d => legendScale(d))
                .style("stroke", "black");
        
            legend.selectAll(".tick-label")
                .data(tickValues)
                .enter().append("text")
                .attr("class", "tick-label")
                .attr("x", legendWidth + 13) 
                .attr("y", d => legendScale(d))
                .attr("dy", "0.35em")
                .attr("text-anchor", "start")
                .style("font-size", "25px") 
                .text(d => tickFormat(d));
        }
        
        createColorLegend(customColorScale);

    const pathGenerator = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
        .scaleExtent([1, 8]) 
        .on('zoom', zoomed); 

    migrationSvg.call(zoom);

    function zoomed(event) {
        const { transform } = event;
        migrationSvg.attr("transform", transform)
        console.log(event)
    }

    const zoomIcon = migrationSvg.append("g")
        .attr("class", "zoom-icon")
        .attr("transform", "translate(-90, 580)")
        .classed("flip-horizontal", true);

   zoomIcon.append("image")
        .attr("xlink:href", "src/Untitled.jpeg") 
        .attr("width", 300) 
        .attr("height", 600) 
        .on("click", zoomIn) 
        .style("cursor", "pointer");

   
    function zoomIn() {
        migrationSvg.transition().duration(500)
            
    }
    

    function zoomToUtah() {
        const utahLat = 39.3210; 
        const utahLong = -111.0937; 
        const utahScale = 4.8;

        const [utBirdData, nvBirdData, mexBirdData, caBirdData, azBirdData, usStatesData, mexicoStatesData] = globalApplicationState.all_data 

        const center = d3.geoCentroid(usStatesData.features[21])
        console.log(usStatesData.features[21])
        projection.center(center).fitSize([pageWidth / 2, pageHeight], { ...usStatesData, features : [usStatesData.features[21]]})

        draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator)    
    }    

    // buttonElement.addEventListener('click', function() {
    //     zoomToUtah();
    //     console.log("Button clicked, zoomToArea function called.");
    // });


    console.log(globalApplicationState.all_data)
    
    Reveal.initialize({
        view: 'scroll',
        // center: 'false',
        scrollProgress: false,
        scrollLayout: 'full',
        backgroundTransition: 'slide',
        autoAnimateEasing: 'ease-out',
        // autoAnimateDuration: 1.5
    });

    // Reveal.on( 'slidechanged', event => {

    //     const val = event.currentSlide.className.split("-")[1].split(" ")[0]
    //     updateSpeciesData(val)
    //     updateMap(val);
    // } );

    const tooltip = migrationSvg.append("g")
        .attr("id", "tooltip")
        .style("opacity", 0); // Initially hide the tooltip

    // Add a rectangle background to the tooltip
    tooltip.append("rect")
        .attr("width", 50)
        .attr("height", 50)
        .style("fill", "white")
        .style("stroke", "#ccc")
        .style("stroke-width", 1)
        .style("border-radius", "10px")
        .style("box-shadow", "2px 2px 5px #1a1a1a");

    // Add text content to the tooltip
    tooltip.append("text")
        .attr("x", 10)
        .attr("y", 20)
        // .text("Tooltip Content");

    function draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator) {

        // const center = d3.geoCentroid(usStatesData.features[21])
        // projection.center(center).fitSize([pageWidth / 2, pageHeight], { ...usStatesData, features : [usStatesData.features[21]]})

        // migrationSvg.selectAll().remove();

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
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
            })
            .on("mousemove", function(d) {
                // Get mouse event coordinates
                let [x, y] = d3.pointer(d3.event);
        
                // Position tooltip near the mouse cursor
                tooltip.style("left", (x + 10) + "px") // Adjust left offset as needed
                    .style("top", (y - 10) + "px"); // Adjust top offset as needed
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
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
                    return value < 0.01 ? d3.interpolate("#FFFFFF", customColorScale(value))(0.1) : customColorScale(value);
                }
            });
        
        appendStateBoundaries(usStatesData, mexicoStatesData);
        updateSpeciesData(2023)
    }

    function updateSpeciesData(year) {
        globalApplicationState.current_species_data[0] = `${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species[0]}_ut_3_${year}`;
        globalApplicationState.current_species_data[1] = `${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species[0]}_nv_3_${year}`;
        globalApplicationState.current_species_data[2] = `${globalApplicationState.current_states[2]}/plot_${globalApplicationState.current_species[0]}_mex_3_${year}`;
        globalApplicationState.current_species_data[3] = `${globalApplicationState.current_states[3]}/plot_${globalApplicationState.current_species[0]}_ca_3_${year}`;
        globalApplicationState.current_species_data[4] = `${globalApplicationState.current_states[4]}/plot_${globalApplicationState.current_species[0]}_az_3_${year}`;
    }  


    // const slider = sliderBottom()
    //     .min(2004)
    //     .max(2023)
    //     .step(1)
    //     .width(pageWidth / 2.5) 
    //     .tickValues(d3.range(2004, 2024, 1)) 
    //     .tickFormat((d) => d) 
    //     .on('onchange', val => {
    //         updateSpeciesData(val)
    //         updateMap(val);
    //     });

    // sliderSvg.append('g')
    //     .attr('transform', 'translate(60,400)') 
    //     .attr("id", "slider_group")
    //     .call(slider)
    //     .attr('class', 'slider');

    // sliderSvg.selectAll(".tick line")
    //     .style("stroke-width", "2px") 
    //     .attr("y2", 10)
    //     .style("stroke", "black");

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
        globalApplicationState.all_data = data;
        console.log('UT Bird population observation data:', utBirdData);
        console.log('NV Bird population observation data:', nvBirdData);
        console.log('MEX Bird population observation data:', mexBirdData);
        console.log('CA Bird population observation data:', caBirdData)
        console.log('AZ Bird population observation data:', azBirdData)
        console.log('US States GeoJSON data:', usStatesData);
        console.log('Mexico States GeoJSON data:', mexicoStatesData);

        projection.fitSize([pageWidth / 2, pageHeight], {...usStatesData, features: [...usStatesData.features, ...mexicoStatesData.features]})

        usStates = usStatesData
        mexicoStates = mexicoStatesData

        draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator)
  
    })
    .catch(error => console.error('Error loading GeoJSON files:', error));

    // function updateMap(year: number) {

    //     migrationSvg.selectAll(".state-boundary, .mexico-state-boundary").remove();

    //     appendStateBoundaries(usStates, mexicoStates);

    //     fetch(`${globalApplicationState.current_species_data[0]}.geojson`)
    //         .then(response => response.json())
    //         .then(birdData => {
    //             // Remove existing bird observation paths
    //             migrationSvg.selectAll(".bird-observation").remove();
                
    //             // Append paths for bird observation data
    //             migrationSvg.selectAll(".bird-observation")
    //                 .data(birdData.features)
    //                 .enter().append("path")
    //                 .attr("class", "bird-observation")
    //                 .attr("d", pathGenerator)
    //                 .style("fill", d => {
    //                     if (d.properties.eargre === 'NA') {
    //                         return 'none'; // No data, same color as background
    //                     } else {
    //                         const value = +d.properties.eargre; // Convert to number
    //                         // Map values close to 0 to a color closer to the background
    //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
    //                     }
    //                 });
    //         })
    //         .catch(error => console.error('Error updating map:', error));

    //     fetch(`${globalApplicationState.current_species_data[1]}.geojson`)
    //         .then(response => response.json())
    //         .then(birdData => {
    //             // Remove existing bird observation paths
    //             migrationSvg.selectAll(".nv-bird-observation").remove();
                
    //             // Append paths for bird observation data
    //             migrationSvg.selectAll(".nv-bird-observation")
    //                 .data(birdData.features)
    //                 .enter().append("path")
    //                 .attr("class", "nv-bird-observation")
    //                 .attr("d", pathGenerator)
    //                 .style("fill", d => {
    //                     if (d.properties.eargre === 'NA') {
    //                         return 'none'; // No data, same color as background
    //                     } else {
    //                         const value = +d.properties.eargre; // Convert to number
    //                         // Map values close to 0 to a color closer to the background
    //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
    //                     }
    //                 });
    //         })
    //         .catch(error => console.error('Error updating map:', error));

    //     fetch(`${globalApplicationState.current_species_data[2]}.geojson`)
    //         .then(response => response.json())
    //         .then(birdData => {
    //             // Remove existing bird observation paths
    //             migrationSvg.selectAll(".mex-bird-observation").remove();
                
    //             // Append paths for bird observation data
    //             migrationSvg.selectAll(".mex-bird-observation")
    //                 .data(birdData.features)
    //                 .enter().append("path")
    //                 .attr("class", "mex-bird-observation")
    //                 .attr("d", pathGenerator)
    //                 .style("fill", d => {
    //                     if (d.properties.eargre === 'NA') {
    //                         return 'none'; // No data, same color as background
    //                     } else {
    //                         const value = +d.properties.eargre; // Convert to number
    //                         // Map values close to 0 to a color closer to the background
    //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
    //                     }
    //                 });
    //         })
    //         .catch(error => console.error('Error updating map:', error));  
            
    //     fetch(`${globalApplicationState.current_species_data[3]}.geojson`)
    //         .then(response => response.json())
    //         .then(birdData => {
    //             // Remove existing bird observation paths
    //             migrationSvg.selectAll(".ca-bird-observation").remove();
                
    //             // Append paths for bird observation data
    //             migrationSvg.selectAll(".ca-bird-observation")
    //                 .data(birdData.features)
    //                 .enter().append("path")
    //                 .attr("class", "ca-bird-observation")
    //                 .attr("d", pathGenerator)
    //                 .style("fill", d => {
    //                     if (d.properties.eargre === 'NA') {
    //                         return 'none'; // No data, same color as background
    //                     } else {
    //                         const value = +d.properties.eargre; // Convert to number
    //                         // Map values close to 0 to a color closer to the background
    //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
    //                     }
    //                 });
    //         })
    //         .catch(error => console.error('Error updating map:', error));  

    //     fetch(`${globalApplicationState.current_species_data[4]}.geojson`)
    //         .then(response => response.json())
    //         .then(birdData => {
    //             // Remove existing bird observation paths
    //             migrationSvg.selectAll(".az-bird-observation").remove();
                
    //             // Append paths for bird observation data
    //             migrationSvg.selectAll(".az-bird-observation")
    //                 .data(birdData.features)
    //                 .enter().append("path")
    //                 .attr("class", "az-bird-observation")
    //                 .attr("d", pathGenerator)
    //                 .style("fill", d => {
    //                     if (d.properties.eargre === 'NA') {
    //                         return 'none'; // No data, same color as background
    //                     } else {
    //                         const value = +d.properties.eargre; // Convert to number
    //                         // Map values close to 0 to a color closer to the background
    //                         return value < 0.01 ? d3.interpolate("white", customColorScale(value))(0.1) : customColorScale(value);
    //                     }
    //                 });
    //         })
    //         .catch(error => console.error('Error updating map:', error));  
            
    // }

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