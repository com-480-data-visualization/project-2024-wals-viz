// Run the action when we are sure the DOM has been loaded
function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}

function drawMap() {

    //Width and height
    // var w = 500;
    // var h = 300;

    var parentDiv = document.getElementById('officiallang-col');
    var w = parentDiv.clientWidth;
    var h = parentDiv.clientHeight;

    //Define map projection
    var projection = d3.geoWinkel3()
        // .fitSize([w, h], json.features);
        .translate([w / 2, h / 2])
        .rotate([0, 0])
        .center([0, 0])
        .scale(w / 8);

    //Define path generator
    var path = d3.geoPath()
        .projection(projection);

    //Create SVG element
    var svg = d3.select(parentDiv)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //Load in GeoJSON data
    d3.json("geojson/ne_50m_admin_0_countries.json").then(function (json) {
        // d3.json("geojson/processed_world-administrative-boundaries.json").then(function(json) {
        // d3.json("geojson/countries-110m.json").then(function(json) {    // This needs topojson
        console.log("GeoJSON loaded!");
        // countries = topojson.feature(json, json.objects.countries);
        // console.log(countries);
        // countrymesh = topojson.mesh(json, json.objects.countries, (a, b) => a !== b)
        // console.log(countrymesh);

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .join("path")
            .attr("fill", "steelblue")
            .style("stroke", "black")
            .attr("d", path)
        // .append("title")
        //   .text(d => `${d.properties.name}\n${valuemap.get(d.properties.name)}`);
        // .append("path")
        // .attr("d", path)
        // .style("fill", "steelblue");

        // createPanButtons();

        console.log("Map loaded!");
    });
}

whenDocumentLoaded(() => {
    console.log('loaded!');

    // TODO To use in the final version
    // d3.queue()
    //     .defer(d3.json, "geodata.json")
    //     .defer(d3.csv, "otherdata.csv")
    //     .await(ready)

    d3.json("geojson/ne_50m_admin_0_countries.json").then(function (json) {

        var officiallang_div = document.getElementById('officiallang-col');

        var officiallang_map = map()
            .width(officiallang_div.clientWidth)
            .height(officiallang_div.clientHeight)
            .json(json)
            .selector('#officiallang-col');

        var officiallang_map_wrapper = officiallang_map();

        console.log(officiallang_map_wrapper);
    });

    // prepare the map here
    // drawMap();
});