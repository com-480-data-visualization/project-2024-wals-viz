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
            .attr("height", officiallang_div.clientWidth);

        var officiallang_map = map()
            .x(0)
            .y(0)
            .width(officiallang_div.clientWidth)
            .height(officiallang_div.clientHeight)
            .json(json)
            .svg(svg);

        var officiallang_map_wrapper = officiallang_map();

        console.log(officiallang_map_wrapper);
    });

    // prepare the map here
    // drawMap();
});