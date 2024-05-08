// Reusable d3.js map component
function map() {
    var width = 960,
        height = 500;

    function my() {
        //Define map projection
        var projection = d3.geoWinkel3()
            .scale(width / 8)
            .translate([width / 2, height / 2]);

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);

        //Create SVG element
        var svg = d3.select("#officiallang-col")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        //Load in GeoJSON data
        d3.json("geojson/ne_50m_admin_0_countries.json").then(function (json) {
            svg.append("path")
            .data(json.features)
                .attr("d", path)
                .style("fill", "steelblue")
                .style("stroke", "black")
            // .attr("class", "land-boundary");

            //Bind data and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features)
                .join("path")
                .attr("fill", "steelblue")
                .style("stroke", "black")
                .attr("d", path)
        });

        // selection.each(function (data) {
        //     //Define map projection
        //     var projection = d3.geo.geoWinkel3()
        //         .scale(width / 8)
        //         .translate([width / 2, height / 2]);

        //     //Define path generator
        //     var path = d3.geo.path()
        //         .projection(projection);

        //     //Create SVG element
        //     var svg = d3.select("#officiallang-col")
        //         .append("svg")
        //         .attr("width", width)
        //         .attr("height", height);

        //     //Load in GeoJSON data
        //     d3.json("geojson/ne_50m_admin_0_countries.json").then(function (json) {
        //         svg.append("path")
        //             .data(topojson.feature(data, data.objects.default).features)
        //             .attr("d", path)
        //             .style("fill", "steelblue")
        //         // .attr("class", "land-boundary");

        //         //Bind data and create one path per GeoJSON feature
        //         svg.selectAll("path")
        //             .data(json.features)
        //             .join("path")
        //             .attr("fill", "steelblue")
        //             .style("stroke", "black")
        //             .attr("d", path)
        //     });

        //     console.log("Map loaded!");
        // });
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

    return my;
}