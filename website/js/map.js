// Reusable d3.js map component
function map() {
    var width = 960,
        height = 500;
    var json = null;
    var selector = null;

    function my() {
        // selection.each( function (data, i) {
        //Define map projection
        var projection = d3.geoWinkel3()
            .scale(width / 8)
            .translate([width / 2, height / 2]);

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);

        console.log("width: " + width);
        console.log("height: " + height);

        //Create SVG element
        var svg = d3.select(selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var paths = svg.selectAll("path")
            .data(json.features)
            .join("path")
            .attr("fill", "steelblue")
            .style("stroke", "black")
            .attr("d", path);

        console.log("Map loaded!");

        return paths;
    };

    my.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return my;
    };

    my.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return my;
    };

    my.json = function (value) {
        if (!arguments.length) return json;
        json = value;
        return my;
    };

    my.selector = function (value) {
        if (!arguments.length) return selector;
        selector = value;
        return my;
    };

    return my;
}

// //Define what to do when panning or zooming
// var zooming = function (d) {

//     //Log out d3.event.transform, so you can see all the goodies inside
//     //console.log(d3.event.transform);

//     //New offset array
//     var offset = [d3.event.transform.x, d3.event.transform.y];

//     //Calculate new scale
//     var newScale = d3.event.transform.k * 2000;

//     //Update projection with new offset and scale
//     projection.translate(offset)
//         .scale(newScale);

//     //Update all paths and circles
//     svg.selectAll("path")
//         .attr("d", path);
// }

// function zooming(e) {
//     d3.select(map)
//         .attr("transform", e.transform);
// }

// //Then define the zoom behavior
// var zoom = d3.zoom()
//     .on("zoom", zooming);

// //The center of the country, roughly
// var center = projection([-97.0, 39.0]);

//Create a container in which all zoom-able elements will live
// var map = svg.append("g")
//     .attr("id", "map")
//     .call(zoom)  //Bind the zoom behavior
//     .call(zoom.transform, d3.zoomIdentity  //Then apply the initial transform
//         .translate(w / 2, h / 2)
//         .scale(0.25)
//         .translate(-center[0], -center[1]));

// //Create a new, invisible background rect to catch zoom events
// map.append("rect")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", w)
//     .attr("height", h)
//     .attr("opacity", 0);

// //Load in cities data
// d3.csv("us-cities.csv", function (data) {

//     map.selectAll("circle")
//         .data(data)
//         .enter()
//         .append("circle")
//         .attr("cx", function (d) {
//             return projection([d.lon, d.lat])[0];
//         })
//         .attr("cy", function (d) {
//             return projection([d.lon, d.lat])[1];
//         })
//         .attr("r", function (d) {
//             return Math.sqrt(parseInt(d.population) * 0.00004);
//         })
//         .style("fill", "yellow")
//         .style("stroke", "gray")
//         .style("stroke-width", 0.25)
//         .style("opacity", 0.75)
//         .append("title")			//Simple tooltip
//         .text(function (d) {
//             return d.place + ": Pop. " + formatAsThousands(d.population);
//         });

//     createPanButtons();

// });


// //Load in agriculture data
// d3.csv("us-ag-productivity.csv", function(data) {

//     //Set input domain for color scale
//     color.domain([
//         d3.min(data, function(d) { return d.value; }), 
//         d3.max(data, function(d) { return d.value; })
//     ]);

//     //Load in GeoJSON data
//     d3.json("us-states.json", function(json) {

//         //Merge the ag. data and GeoJSON
//         //Loop through once for each ag. data value
//         for (var i = 0; i < data.length; i++) {

//             var dataState = data[i].state;				//Grab state name
//             var dataValue = parseFloat(data[i].value);	//Grab data value, and convert from string to float

//             //Find the corresponding state inside the GeoJSON
//             for (var j = 0; j < json.features.length; j++) {

//                 var jsonState = json.features[j].properties.name;

//                 if (dataState == jsonState) {

//                     //Copy the data value into the JSON
//                     json.features[j].properties.value = dataValue;

//                     //Stop looking through the JSON
//                     break;

//                 }
//             }		
//         }

//         //Bind data and create one path per GeoJSON feature
//         map.selectAll("path")
//            .data(json.features)
//            .enter()
//            .append("path")
//            .attr("d", path)
//            .style("fill", function(d) {
//                    //Get data value
//                    var value = d.properties.value;

//                    if (value) {
//                        //If value exists…
//                        return color(value);
//                    } else {
//                        //If value is undefined…
//                        return "#ccc";
//                    }
//            });

//         //Load in cities data
//         d3.csv("us-cities.csv", function(data) {

//             map.selectAll("circle")
//                .data(data)
//                .enter()
//                .append("circle")
//                .attr("cx", function(d) {
//                    return projection([d.lon, d.lat])[0];
//                })
//                .attr("cy", function(d) {
//                    return projection([d.lon, d.lat])[1];
//                })
//                .attr("r", function(d) {
//                     return Math.sqrt(parseInt(d.population) * 0.00004);
//                })
//                .style("fill", "yellow")
//                .style("stroke", "gray")
//                .style("stroke-width", 0.25)
//                .style("opacity", 0.75)
//                .append("title")			//Simple tooltip
//                .text(function(d) {
//                     return d.place + ": Pop. " + formatAsThousands(d.population);
//                });

//             createPanButtons();

//         });


//     });

// });

// //Create panning buttons
// var createPanButtons = function () {

//     //Create the clickable groups

//     //North
//     var north = svg.append("g")
//         .attr("class", "pan")	//All share the 'pan' class
//         .attr("id", "north");	//The ID will tell us which direction to head

//     north.append("rect")
//         .attr("x", 0)
//         .attr("y", 0)
//         .attr("width", w)
//         .attr("height", 30);

//     north.append("text")
//         .attr("x", w / 2)
//         .attr("y", 20)
//         .html("&uarr;");

//     //South
//     var south = svg.append("g")
//         .attr("class", "pan")
//         .attr("id", "south");

//     south.append("rect")
//         .attr("x", 0)
//         .attr("y", h - 30)
//         .attr("width", w)
//         .attr("height", 30);

//     south.append("text")
//         .attr("x", w / 2)
//         .attr("y", h - 10)
//         .html("&darr;");

//     //West
//     var west = svg.append("g")
//         .attr("class", "pan")
//         .attr("id", "west");

//     west.append("rect")
//         .attr("x", 0)
//         .attr("y", 30)
//         .attr("width", 30)
//         .attr("height", h - 60);

//     west.append("text")
//         .attr("x", 15)
//         .attr("y", h / 2)
//         .html("&larr;");

//     //East
//     var east = svg.append("g")
//         .attr("class", "pan")
//         .attr("id", "east");

//     east.append("rect")
//         .attr("x", w - 30)
//         .attr("y", 30)
//         .attr("width", 30)
//         .attr("height", h - 60);

//     east.append("text")
//         .attr("x", w - 15)
//         .attr("y", h / 2)
//         .html("&rarr;");

//     //Panning interaction

//     d3.selectAll(".pan")
//         .on("click", function () {

//             //Get current translation offset
//             var offset = projection.translate();

//             //Set how much to move on each click
//             var moveAmount = 50;

//             //Which way are we headed?
//             var direction = d3.select(this).attr("id");

//             //Modify the offset, depending on the direction
//             switch (direction) {
//                 case "north":
//                     offset[1] += moveAmount;  //Increase y offset
//                     break;
//                 case "south":
//                     offset[1] -= moveAmount;  //Decrease y offset
//                     break;
//                 case "west":
//                     offset[0] += moveAmount;  //Increase x offset
//                     break;
//                 case "east":
//                     offset[0] -= moveAmount;  //Decrease x offset
//                     break;
//                 default:
//                     break;
//             }

//             //Update projection with new offset
//             projection.translate(offset);

//             //Update all paths and circles
//             svg.selectAll("path")
//                 .transition()
//                 .attr("d", path);

//             svg.selectAll("circle")
//                 .transition()
//                 .attr("cx", function (d) {
//                     return projection([d.lon, d.lat])[0];
//                 })
//                 .attr("cy", function (d) {
//                     return projection([d.lon, d.lat])[1];
//                 });

//         });

// };