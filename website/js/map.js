// Reusable d3.js map component
function map() {
    var width = 960,
        height = 500;

    function my(selection) {
        selection.each(function (data) {
            var projection = d3.geo.geoWinkel3()
                .scale(1000)
                .translate([width / 2, height / 2]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select(this)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            svg.append("path")
                .data(topojson.feature(data, data.objects.default).features)
                .attr("d", path)
                .style("fill", "steelblue")
                // .attr("class", "land-boundary");
        });
    }

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