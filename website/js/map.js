// Reusable d3.js map component
function map() {
    var map_id = null;
    var x = 0,
        y = 0;
    var width = 960,
        height = 500;
    var json = null;
    var allCountries = null;
    var mergeWithWals = false;
    var svg = null;
    var color_mapper = function (d) {
        return "steelblue";
    }
    var onClickBehavior = function (d, i) { }
    var onMouseOverBehavior = function (d, i) { }
    var onMouseOutBehavior = function (d, i) { }

    function my() {
        // selection.each( function (data, i) {
        //Define map projection
        var projection = d3.geoWinkel3()
            .fitExtent([[x, y], [x + width, y + height]], json)
        // .scale(width / 8)
        // .translate([x + width / 2, y + height / 2]);

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);

        // Merge the allCountries data and GeoJSON
        if (!mergeWithWals) {
            json = merge_official_lang_geojson(allCountries, json);
        }
        else {
            json = merge_wals_geojson(allCountries, json);
        }

        //Bind data and create one path per GeoJSON feature
        var countriesGroup = svg.append("g")
            .attr("id", map_id);
        var countries = countriesGroup.selectAll("path")
            .data(json.features)
            .join("path")
            // .attr("id", function (d, i) {    // Don't uncomment for now, it will break coloring
            //     return "country" + d.properties.ISO_A2;
            // })
            // .attr("class", "country")
            .attr("fill", color_mapper)
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .attr("d", path)
            .on("click", onClickBehavior)
            .on("mouseover", onMouseOverBehavior)
            .on("mouseout", onMouseOutBehavior);

        // console.log("Map loaded!");

        return countriesGroup;
    };

    my.map_id = function (value) {
        if (!arguments.length) return map_id;
        map_id = value;
        return my;
    };

    my.x = function (value) {
        if (!arguments.length) return x;
        x = value;
        return my;
    };

    my.y = function (value) {
        if (!arguments.length) return y;
        y = value;
        return my;
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

    my.allCountries = function (value) {
        if (!arguments.length) return allCountries;
        allCountries = value;
        return my;
    };

    my.mergeWithWals = function (value) {
        if (!arguments.length) return mergeWithWals;
        mergeWithWals = value;
        return my;
    };

    my.svg = function (value) {
        if (!arguments.length) return svg;
        svg = value;
        return my;
    };

    my.color_mapper = function (value) {
        if (!arguments.length) return color_mapper;
        color_mapper = value;
        return my;
    }

    my.onClickBehavior = function (value) {
        if (!arguments.length) return onClickBehavior;
        onClickBehavior = value;
        return my;
    }

    my.onMouseOverBehavior = function (value) {
        if (!arguments.length) return onMouseOverBehavior;
        onMouseOverBehavior = value;
        return my;
    }

    my.onMouseOutBehavior = function (value) {
        if (!arguments.length) return onMouseOutBehavior;
        onMouseOutBehavior = value;
        return my;
    }

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

//     //Define quantize scale to sort data values into buckets of color
//     var color = d3.scaleQuantize()
//     .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);
// //Colors taken from colorbrewer.js, included in the D3 download

// //Number formatting for population values
// var formatAsThousands = d3.format(",");  //e.g. converts 123456 to "123,456"


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