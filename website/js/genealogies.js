function genealogies_ready(error, json, official_language_csv, wals_csv) {

    var genealogies_div = document.getElementById('genealogy-col');

    var non_highlighted_color = "#dac0a3ff";
    var selected_color = "#102c57ff";
    var same_language_color = "#102c56bf";

    //Create SVG element
    var svg = d3.select(genealogies_div)
        .append("svg")
        .attr("width", genealogies_div.clientWidth)
        .attr("height", genealogies_div.clientHeight);

    var map_id = "genealogy_map";

    let highlightCountry = function (d, currentCountry) {
        svg.select("#" + map_id).selectAll("path").attr("fill", non_highlighted_color);
        currentCountry.attr("fill", selected_color);
    };

    // Function that creates a group and a rectangle if they haven't been created yet,
    // and updates the text within with country information
    let createCountryInfo = function (d, currentCountry, map_id) {
        let countryInfoGroup = svg.select("#" + map_id).select("#countryInfoGroup");
        let langListGroup = countryInfoGroup.select("#langListGroup");
        let xGroup = genealogies_div.clientWidth / 12;
        let yGroup = genealogies_div.clientHeight / 4
        let widthGroup = genealogies_div.clientWidth / 8;
        let heightGroup = genealogies_div.clientHeight / 2;

        // If the group doesn't exist, create it
        if (countryInfoGroup.empty()) {
            countryInfoGroup = svg.select("#" + map_id).append("g").attr("id", "countryInfoGroup");
            countryInfoGroup.append("rect")
                .attr("x", xGroup)
                .attr("y", yGroup)
                .attr("width", widthGroup)
                .attr("height", heightGroup)
                .attr("fill", "none")
                .attr("stroke", "black");
            countryInfoGroup.append("text")
                .attr("x", xGroup + 10)
                .attr("y", yGroup + 20)
                .attr("id", "countryName")
                .text("Country: ");
            langListGroup = countryInfoGroup.append("g")
                .attr("id", "langListGroup");
        }
        // Update the country name
        countryInfoGroup.select("#countryName")
            .attr("x", xGroup + 10)
            .attr("y", yGroup + 20)
            .text("Country: " + currentCountry.datum().properties.NAME);
        // Update the languages
        let langList = currentCountry.datum().properties.languages;
        langListGroup.selectAll("text")
            .data(langList)
            .join("text")
            .attr("fill", "black")
            .attr("x", xGroup + 10)
            .attr("y", function (d, i) {
                return yGroup + 40 + 20 * i;
            })
            .text(function (d) {
                return "Language: " + iso_to_lang(d, wals_csv);
            })
            .on("click", function (d) { // Turn selected color to red
                langListGroup.selectAll("text").attr("fill", "black");
                let currentLanguage = d3.select(this).attr("fill", selected_color);
                // Highlight countries with the same language
                svg.select("#" + map_id).selectAll("path").attr("fill", non_highlighted_color);
                svg.select("#" + map_id).selectAll("path")
                    .filter(function (data) {
                        return data.properties.languages.includes(currentLanguage.datum());
                    })
                    .attr("fill", same_language_color);
                currentCountry.attr("fill", selected_color);
            });
    }


    // Create map object
    var genealogies_map = map()
        .map_id(map_id)
        .x(0)
        .y(0)
        .width(genealogies_div.clientWidth)
        .height(genealogies_div.clientHeight)
        .json(json)
        .allCountries(official_language_csv)
        .svg(svg)
        .color_mapper(function (d) { return non_highlighted_color; })
        .onHoverBehavior(function (d) {
            let currentCountry = d3.select(this);
            createCountryInfo(d, currentCountry, map_id);
            highlightCountry(d, currentCountry);
        });

    var officiallang_countriesGroup = genealogies_map();

}