// import React, { useState } from 'react';
import * as d3 from 'd3'
import { sliderBottom, sliderTop } from 'd3-simple-slider'
import { Button } from '@mantine/core';

const globalApplicationState = {
    // make this depend on what button is selected once implemented 
    all_data : null,
    current_species : ['eargre', 'amwpel'],
    current_states : ['ut_eg_geojsons', 'nv_eg_geojsons', 'mex_eg_geojsons', 'ca_eg_geojsons', 'az_eg_geojsons'],
    current_species_data : [''],
    current_year_selection : ''
}

globalApplicationState.current_species_data = [`${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species[0]}_ut_5_2023`, 
`${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species[0]}_nv_5_2023`,
`${globalApplicationState.current_states[2]}/plot_${globalApplicationState.current_species[0]}_mx_5_2023`,
`${globalApplicationState.current_states[3]}/plot_${globalApplicationState.current_species[0]}_ca_5_2023`,
`${globalApplicationState.current_states[4]}/plot_${globalApplicationState.current_species[0]}_az_5_2023`]

const pageWidth = window.innerWidth - 40 || document.documentElement.clientWidth || document.body.clientWidth;
const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


function setup() {
    const body = d3.select('body')
    body.style("background-color", "white");

    const header = body.append('div')
        .attr('class', 'header')
        .attr("id", "header")
        .attr('height', '40px')
        .style('top', '0')
        .style('position', 'sticky')
        .attr('width', pageWidth)
        .style('border-bottom', '0.1rem solid')

    const maps_div = body.append('div')
        .attr("id", "migration_div")
        .attr('height', pageHeight + "px")
        .style("position", "fixed") 
        .style("right", "0px") 
        .style("width", pageWidth / 2 + "px")

    const migrationSvg = maps_div.append('svg')
        .attr('id', 'migrationSvg')
        .style("position", "absolute") 
        // .style("right", "0px")
        .style("height", pageHeight)
        .attr('position', 'fixed')
        .attr("width", pageWidth / 2)
        .style('margin-top', '60px')

    migrationSvg.append('g').attr('class', 'pathsG')

    const projection = d3.geoAlbers()
        // .translate([(pageWidth / 4), pageHeight / 9])
        // .scale(20000)


    const reveal_div = body.append('div')
        .attr('id', 'revealDiv')
        .style("width", pageWidth / 2.5 + "px") 
        .style("height", 10000 + "px") 
        .style("overflow", "hidden")
        .style("background-color", "white")

    const visName = header.append('div')
        .text('GSLBirdVis')
        .attr('weight', pageWidth)
        .style('transform', 'translateX(30px)')
        .style('color', 'black')
        .style('font-size', '50px')
        .style('font-family', 'Bitstream Vera Sans Mono')
        .style('font-weight', 'bold')
        .style('background-color', 'white')

    visName.append("button")
        .attr("width", 500)
        .attr("height", 50)
        .text("ABOUT") 
        .attr("rx", 10) // Border radius
        .style("fill", "#0F579F")
        .style("stroke", "white")
        .style('font-size', '30px')
        .style('font-weight', 'bold')
        .style("fill", "white")
        .style('transform', `translateX(2000px)`);

    const zoomButton = visName.append("button")
        .attr("width", 500)
        .attr("height", 50)
        .text("ZOOM") 
        .attr("rx", 10) // Border radius
        .style("fill", "#0F579F")
        .style("stroke", "white")
        .style('font-size', '30px')
        .style('font-weight', 'bold')
        .style("fill", "white")
        .on('click', zoomToUtah)
        // .style('transform', `translateX(2000px)`);
    
    
    const slides_div = reveal_div.append('div')

    // Append text to the opening div
    const title = slides_div.append('p')
        .text('THE TALE OF TWO BIRDS: FINDING THE FLIGHT OF LEAST RESISTANCE')
        .style('font', 'Bitstream Vera Sans Mono')
        .style('font-style', 'italic')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '2.7vw')
        .style('padding-top', '5vh')
        .style('padding-left', '5vw') 
        .style('font-weight', 'bold');

    const name= slides_div.append('p')
        .text('By ZOE EXELBERT')
        .style('font', 'Bitstream Vera Sans Mono')
        .style('font-style', 'italic')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1vw') 
        .style('padding-left', '5vw') 

    const opening = slides_div.append('p')
        .text('Bird migrations have evolved over time as a natural response to finding available resources and comfortable environments. However, climate change might be forcing these responses to occur more frequently, and perhaps unnaturally.')
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 
        .attr('class', 'element')

    const opening2 = slides_div.append('p')
        .text('Here we will explore the migrations of the Eared Grebe and the American White Pelican as they travel to the Great Salt Lake over the past 20 years.')
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 
        .attr('class', 'element')

        // Create a paragraph element
    const gifP = slides_div.append('p')
        .style('text-align', 'center');

    const gifPosition = gifP.node().getBoundingClientRect().top + window.scrollY;

    function bringTextIntoFocus(element) {
        element.style.opacity = '1';
    }
    
    function turnTextOutOfFocus(element) {
        element.style.fontWeight = 'normal';
        element.style.opacity = '0.5';
    }
    
    function isInViewport(element) {
        const bounding = element.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight) &&
            bounding.right <= (window.innerWidth)
        );
    }

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        const elements = document.querySelectorAll('.element')

        elements.forEach(element => {
            if (isInViewport(element)) {
                bringTextIntoFocus(element);
            } else {
                turnTextOutOfFocus(element);
            }
        });

        if (scrollPosition >= gifPosition) {
            zoomToUtah();
        }
    });

    // Create an image element
    const gif = gifP.append('img')
        .attr('src', 'src/error_404_animation_800x600.gif')
        // .style('max-width', '100%')  // Ensure the image scales to the container width
        // .style('max-height', '100%') // Ensure the image scales to the container height
        // .style('margin', 'auto');
        // .style('padding-left', '12vw')

    const earedGrebe = slides_div.append('p')
        .text('The Great Salt Lake hosts anywhere from 2 to 5 million Eared Grebes per year, which at times is almost the entire North American population. Grebes need to consume 28,000 adult brine shrimp each day at the GSL to survive.')
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 
        .attr('class', 'element')

    const egP = slides_div.append('p')
        .style('text-align', 'center')

    const egImg = egP.append('img')
        .attr('src', 'src/grebes.jpeg')
        .attr('width', `${pageWidth / 4}`)
        .style('padding-top', '2vh') 
        // .style('transform', 'translateX(400px)');

    const earedGrebe2 = slides_div.append('p')
        .text('This means that Grebes need to forage for 7-7.5 hours of foraging per day, which equates to about 1-2 brine shrimp consumed per second in order to meet their dietary needs.')
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 
        .attr('class', 'element')

    const earedGrebe3 = slides_div.append('p')
        .text('During what is called a fall-staging period, Grebes go through what is called "molting", which is where they shed their feathers to make way for newer, stronger ones.')
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 
        .attr('class', 'element')


    const egP2 = slides_div.append('p');

    const egImg2 = egP2.append('img')
        .attr('src', 'src/feathers.gif')
        .style('padding-left', '12vw')

    const earedGrebe4 = slides_div.append('p')
        .text('What Effects Can This Have?')
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '13vw') 
        .attr('class', 'element')

    const earedGrebe5 = slides_div.append('p')
        .text('**Animation with sliders? to show how when temperatures rises at GSL (Utah becomes red?), salinity rises, brine shrimp populations suffer, as a result eared grebe populations do.**')
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 

    const amp = slides_div.append('p')
        .text("The world's second largest colony of American White Pelicans exist on GSL's Gunnison Island. Fossil evidence suggest that this species has come to the GSL to nest for over 125,000 years.")
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 

    const amp2 = slides_div.append('p')
        .text("While Pelicans forage in freshwater wetlands surrounding the GSL, Gunnisoin Island hosts a safe environment for pelicans to breed and nest. (Point out island on map)")
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 

    const amp3 = slides_div.append('p')
        .text("**Animation with sliders? to show how when temperatures rise at GSL, lake levels drop, increasing predation access, leading to decreased nesting success, and as a result potentially decreased Pelican counts.**")
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 

    const amp4 = slides_div.append('p')
        .text("So what's been happening with these species over the past 20 years? **Button to trigger animation of migration, potentially with the option to switch species to see Grebe and Pelican animation separately?**")
        .style('font-family', 'Schotis Text Book')
        .style('vertical-align', 'center')
        .style('text-align', 'left')
        .style('color', 'black')
        .style('font-size', '1.3vw') 
        .style('padding-top', '2vh') 
        .style('padding-left', '5vw') 

        
    const utahLat = 39.3210; 
    const utahLong = -111.0937; 

    const customColorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 1]);

    function createColorLegend(colorScale) {
        const legendWidth = pageWidth / 30; 
        const legendHeight = pageHeight / 3; 
        const numTicks = 5; 
    
        const legendScale = d3.scaleLinear()
            .domain([0, 1])
            .range([legendHeight, 0]); 

        const legend = migrationSvg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${pageWidth / 2.25}, ${pageHeight / 2.1})`); 

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
            .style("stroke", "black")
            .style('font-weight', 'bold')

    
        legend.selectAll(".tick-label")
            .data(tickValues)
            .enter().append("text")
            .attr("class", "tick-label")
            .attr("x", legendWidth + 13) 
            .attr("y", d => legendScale(d))
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .style("font-size", "25px") 
            // .style('font-weight', 'bold')
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
        
        // Select the first path within the g element with class pathsG
        const firstPathInGroup = d3.select('.pathsG').select('path');
    
        // Apply the zoom transformation to the first path
        firstPathInGroup.attr("transform", transform);
    
        // Log the event for debugging
        console.log(event);
    }

    // function triggerZoom() {
    //     // Calculate the desired transformation (e.g., scale and translate)
    //     const transform = d3.zoomIdentity.scale(200).translate(100, 100); // Example transformation
        
    //     // Apply the transformation to your SVG element
    //     migrationSvg.transition().duration(500) // Optionally add a smooth transition
    //         .call(zoom.transform, transform);
    // }
    
    // function zoomed() {
    //     if (d3.event && d3.event.transform) {
    //         const { x, y, k } = d3.event.transform;
    
    //         // Coordinates of Utah
    //         const utahLat = 39.3210; 
    //         const utahLong = -111.0937; 
    
    //         // Calculate translation to center Utah
    //         const translateX = pageWidth / 2 - utahLong * k;
    //         const translateY = pageHeight / 2 - utahLat * k;
    
    //         // Apply the transformation
    //         d3.select('.map-container')
    //             .attr('transform', `translate(${translateX}, ${translateY}) scale(${k})`);
    //     }
    // }
    
    // function zoomIn() {
    //     migrationSvg.transition().duration(500)
    // }

    // function zoomToUtah() {
    //     const utahFeature = globalApplicationState.all_data[0].features.find(feature => feature.properties.name === "Utah");
    //     console.log(utahFeature)
    
    //     const utahBounds = pathGenerator.bounds(utahFeature);
    //     const utahCenter = pathGenerator.centroid(utahFeature);
    
    //     // Calculate the scale to fit Utah into the visualization
    //     const utahScale = 0.9 / Math.max(
    //         (utahBounds[1][0] - utahBounds[0][0]) / (pageWidth / 2),
    //         (utahBounds[1][1] - utahBounds[0][1]) / pageHeight
    //     );
    
    //     // Calculate the translate coordinates to center Utah
    //     const utahTranslate = [
    //         (pageWidth / 2) - (utahCenter[0] * utahScale),
    //         (pageHeight / 2) - (utahCenter[1] * utahScale)
    //     ];
    
    //     // Apply the zoom transform to zoom to Utah
    //     migrationSvg.transition().duration(750).call(
    //         zoom.transform,
    //         d3.zoomIdentity.translate(utahTranslate[0], utahTranslate[1]).scale(utahScale)
    //     );
    // }

    function zoomToUtah() {
        const utahLat = 39.3210; 
        const utahLong = -111.0937; 
        // const utahScale = 4.8;

        const [utBirdData, nvBirdData, mexBirdData, caBirdData, azBirdData, usStatesData, mexicoStatesData] = globalApplicationState.all_data 

        const center = d3.geoCentroid(usStatesData.features[21])
        console.log(usStatesData.features[21])
        projection.center(center).fitSize([pageWidth / 2, pageHeight], { ...usStatesData, features : [usStatesData.features[21]]})

        draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator)    
    }    

    // zoomButton.addEventListener('click', function() {
    //     zoomToUtah();
    //     console.log("Button clicked, zoomToArea function called.");
    // });
    
    // Reveal.on( 'slidechanged', event => {

    //     const val = event.currentSlide.className.split("-")[1].split(" ")[0]
    //     updateSpeciesData(val)
    //     updateMap(val);
    // } );


    function draw(utBirdData, azBirdData, nvBirdData, caBirdData, mexBirdData, usStatesData, mexicoStatesData, pathGenerator) {

        // const center = d3.geoCentroid(usStatesData.features[21])
        // projection.center(center).fitSize([pageWidth / 2, pageHeight], { ...usStatesData, features : [usStatesData.features[21]]})

        // migrationSvg.selectAll().remove();
        
        const pathsG = migrationSvg.select('.pathsG')
        console.log('in draw')
        pathsG.selectAll(".bird-observation")
            .data(utBirdData.features)
            .join(
                enter => {console.log('hello'); return enter.append("path")},
                update => {console.log('update?'); return update},
                exit => exit.remove()
            )
            .attr("class", "bird-observation")
            .transition().duration(4000)
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

        pathsG.selectAll(".nv-bird-observation")
            .data(nvBirdData.features)
            .join("path")
            .attr("class", "nv-bird-observation")
            .transition().duration(4000)
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
        pathsG.selectAll(".mex-bird-observation")
            .data(mexBirdData.features)
            .join("path")
            .attr("class", "mex-bird-observation")
            .transition().duration(4000)
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

        pathsG.selectAll(".ca-bird-observation")
            .data(caBirdData.features)
            .join("path")
            .attr("class", "ca-bird-observation")
            .transition().duration(4000)
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

        pathsG.selectAll(".az-bird-observation")
            .data(azBirdData.features)
            .join("path")
            .attr("class", "az-bird-observation")
            .transition().duration(4000)
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
        
        appendStateBoundaries(usStatesData, mexicoStatesData, pathGenerator);
        updateSpeciesData(2023)
    }

    function updateSpeciesData(year) {
        globalApplicationState.current_species_data[0] = `${globalApplicationState.current_states[0]}/plot_${globalApplicationState.current_species[0]}_ut_3_${year}`;
        globalApplicationState.current_species_data[1] = `${globalApplicationState.current_states[1]}/plot_${globalApplicationState.current_species[0]}_nv_3_${year}`;
        globalApplicationState.current_species_data[2] = `${globalApplicationState.current_states[2]}/plot_${globalApplicationState.current_species[0]}_mex_3_${year}`;
        globalApplicationState.current_species_data[3] = `${globalApplicationState.current_states[3]}/plot_${globalApplicationState.current_species[0]}_ca_3_${year}`;
        globalApplicationState.current_species_data[4] = `${globalApplicationState.current_states[4]}/plot_${globalApplicationState.current_species[0]}_az_3_${year}`;
    }  

    //  const sliderSvg = migrationSvg.append('svg')
    //     .attr('id', 'sliderSvg')
    //     .attr("height", pageHeight)
    //     .attr("width", pageWidth / 2)
    //     .style("position", "fixed") 
    //     .style("right", "0px") 

    // const slider = sliderBottom()
    //     .min(2004)
    //     .max(2023)
    //     .step(1)
    //     .width(pageWidth / 5) 
    //     .tickValues(d3.range(2004, 2024, -1)) 
    //     .tickFormat((d) => d) 
    //     // .on('onchange', val => {
    //     //     updateSpeciesData(val)
    //     //     updateMap(val);
    //     // });

    // sliderSvg.append('g')
    //     .attr('transform', `translate(60,${pageHeight / 1.1}) rotate(-90)`) 
    //     .attr("id", "slider_group")
    //     .call(slider)
    //     .attr('class', 'slider');

    // sliderSvg.selectAll('.tick text')
    //     .style('font-size', '100px')  // Change the font size as desired
    //     .attr('transform', 'rotate(-45)');

    // sliderSvg.selectAll(".tick line")
    //     .style("stroke-width", "2px") 
    //     .attr("y2", 10)
    //     .style("stroke", "black")
    //     .style('stroke-weight', '2px');

    let usStates;
    let mexicoStates;

    function appendStateBoundaries(usStatesData, mexicoStatesData, pathGenerator) {
        const pathsG = d3.select('.pathsG')
        console.log(pathsG)

        pathsG.selectAll(".state-boundary")
            .data(usStatesData.features)
            .join("path")
            .attr("class", "state-boundary")
            .transition().duration(4000)
            .attr("d", pathGenerator)
            .style("fill", "none") 
            .style("stroke", "black") 
            .style("stroke-width", 1); 
        pathsG.selectAll(".mexico-state-boundary")
            .data(mexicoStatesData.features)
            .join("path").transition()
            .attr("class", "mexico-state-boundary")
            .transition().duration(4000)
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

}

setup();