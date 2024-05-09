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
    Promise.all([
        d3.json("geojson/ne_50m_admin_0_countries.json"),
        d3.csv("data/all_countries_info_alpha2.csv"),
    ]).then(([json, csv]) => {
        ready(null, json, csv);
    });

    function ready(error, json, csv) {
        // Modifies csv, substituting the languages string with an array of languages
        csv.forEach(function (d) {
            d.Languages = d.Languages.split(",").map(function (lang) {
                return lang.trim();
            });
        });

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

        test_color = function (d) {
            // color red if eng is an official language
            // if (d.properties.ISO_A2 == "US") {
            if (d.properties.languages.includes("eng")) {
                return "orange";
            } else {
                return "steelblue";
            }
        };

        highlightSameLang = function (d) {
            d3.selectAll(".country").attr("fill", "steelblue");
            let selectedLang = d3.select(this).datum().properties.languages;
            for (let i = 0; i < selectedLang.length; i++) {
                d3.selectAll(".country")
                    .filter(function (d) {
                        return d.properties.languages.includes(selectedLang[i]);
                    })
                    .attr("fill", "orange");
            }
            d3.select(this).attr("fill", "red");
        };

        // Create map object
        var officiallang_map = map()
            .x(0)
            .y(0)
            .width(officiallang_div.clientWidth)
            .height(officiallang_div.clientHeight)
            .json(json)
            .allCountries(csv)
            .svg(svg)
            .color_mapper(test_color)
            .onClickBehavior(highlightSameLang);

        var officiallang_countriesGroup = officiallang_map();
    };

    // prepare the map here
    // drawMap();
});