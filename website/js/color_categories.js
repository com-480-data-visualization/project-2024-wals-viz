function color_categories_ready (error, json, official_language_csv, wals_csv) {
    var colorcat_div = document.getElementById('colorcategories-col');

    //Create SVG element
    var svg = d3.select(colorcat_div)
        .append("svg")
        .attr("width", colorcat_div.clientWidth)
        .attr("height", colorcat_div.clientHeight);

    var map_id = "colorcategories_map";

    console.log("Color categories ready");

    // Create map object
    var colorcat_map = map()
        .map_id(map_id)
        .x(colorcat_div.clientWidth/5)
        .y(0)
        .width(4*colorcat_div.clientWidth/5)
        .height(colorcat_div.clientHeight)
        .json(json)
        .allCountries(official_language_csv)
        .svg(svg)
        .color_mapper(function (d) { return "steelblue"; })
        .onClickBehavior( { } );

    var colorcat_countriesGroup = colorcat_map();

    console.log("Color categories done");
}