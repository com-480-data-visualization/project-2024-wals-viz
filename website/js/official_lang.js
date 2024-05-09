// Run the action when we are sure the DOM has been loaded
function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
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

        //Create SVG element
        var svg = d3.select(officiallang_div)
            .append("svg")
            .attr("width", officiallang_div.clientWidth)
            .attr("height", officiallang_div.clientHeight);

        // Insert text in the top left corner of the svg, 
        // TODO, maybe we do it as embedded HTML in the SVG
        // svg.append("text")
        //     .attr("x", officiallang_div.clientWidth/25)
        //     .attr("y", officiallang_div.clientHeight/16)
        //     .style("font-size", "2em")
        //     .style("font-weight", "bold")
        //     .text("Official Languages of the World")
        
        // Create map object
        var officiallang_map = map()
            .x(0)
            .y(0)
            .width(officiallang_div.clientWidth)
            .height(officiallang_div.clientHeight)
            .json(json)
            .svg(svg)
            .color_mapper(function (d) {
                if (d.properties.ISO_A2 == "US") {
                    return "red";
                } else {
                    return "steelblue";
                }
            })
            .onClickBehavior(function (d, i) {
                d3.selectAll(".country").classed("country-on", false);
                d3.select(this).classed("country-on", true);
            });

        var officiallang_countriesGroup = officiallang_map();

        // TODO we can use a function to update the country classes for coloring

        console.log(officiallang_countriesGroup);
    });

    // prepare the map here
    // drawMap();
});