function officallang_ready(error, json, official_language_csv, wals_csv) {

    var officiallang_div = document.getElementById('officiallang-col');

    var non_highlighted_color = "#dac0a3ff";
    var selected_color = "#102c57ff";
    var same_language_color = "#102c56bf";

    //Create SVG element
    var svg = d3.select(officiallang_div)
        .append("svg")
        .attr("width", officiallang_div.clientWidth)
        .attr("height", officiallang_div.clientHeight);

    var map_id = "officiallang_map";

    // Insert text in the top left corner of the svg, 
    // TODO, maybe we do it as embedded HTML in the SVG
    // svg.append("text")
    //     .attr("x", officiallang_div.clientWidth/25)
    //     .attr("y", officiallang_div.clientHeight/16)
    //     .style("font-size", "2em")
    //     .style("font-weight", "bold")
    //     .text("Official Languages of the World")

    // Function to highlight countries with the same language as the selected country
    let highlightSameLang = function (d, currentCountry) {
        svg.select("#" + map_id).selectAll("path").attr("fill", non_highlighted_color);
        let selectedLang = currentCountry.datum().properties.languages;
        for (let i = 0; i < selectedLang.length; i++) {
            svg.select("#" + map_id).selectAll("path")
                .filter(function (d) {
                    return d.properties.languages.includes(selectedLang[i]);
                })
                .attr("fill", same_language_color);
        }
        currentCountry.attr("fill", selected_color);
    };

    let highlightCountry = function (d, currentCountry) {
        svg.select("#" + map_id).selectAll("path").attr("fill", non_highlighted_color);
        currentCountry.attr("fill", selected_color);
    };

    // Function that creates a group and a rectangle if they haven't been created yet,
    // and updates the text within with country information
    let createCountryInfo = function (d, currentCountry, map_id) {
        let countryInfoGroup = svg.select("#" + map_id).select("#countryInfoGroup");
        let langListGroup = countryInfoGroup.select("#langListGroup");
        let xGroup = officiallang_div.clientWidth / 12;
        let yGroup = officiallang_div.clientHeight / 4
        let widthGroup = officiallang_div.clientWidth / 8;
        let heightGroup = officiallang_div.clientHeight / 2;

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
    var officiallang_map = map()
        .map_id(map_id)
        .x(0)
        .y(0)
        .width(officiallang_div.clientWidth)
        .height(officiallang_div.clientHeight)
        .json(json)
        .allCountries(official_language_csv)
        .svg(svg)
        .color_mapper(function (d) { return non_highlighted_color; })
        .onClickBehavior(function (d) {
            let currentCountry = d3.select(this);
            createCountryInfo(d, currentCountry, map_id);
            highlightCountry(d, currentCountry);
        });

    var officiallang_countriesGroup = officiallang_map();
};