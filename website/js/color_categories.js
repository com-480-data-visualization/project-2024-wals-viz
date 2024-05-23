function color_categories_ready(error, json, official_language_csv, wals_csv) {
    var colorcat_div = document.getElementById('colorcategories-col');

    //Create SVG element
    var svg = d3.select(colorcat_div)
        .append("svg")
        .attr("width", colorcat_div.clientWidth)
        .attr("height", colorcat_div.clientHeight);

    var map_id = "colorcategories_map";

    // Returns the category of a language given its green/blue and red/yellow values
    let colorCategoryMapper = function (greenBlue, redYellow) {
        if (greenBlue == "3 Black/green/blue" && redYellow == "2 Red/yellow") {
            return "Category 2";
        } else if (greenBlue == "3 Black/green/blue" && redYellow == "1 Red vs. yellow") {
            return "Category 3A";
        } else if (greenBlue == "2 Green/blue" && redYellow == "2 Red/yellow") {
            return "Category 3B";
        } else if (greenBlue == "5 Yellow/green/blue" && redYellow == "3 Yellow/green/blue vs. red") {
            return "Category 3C";
        } else if (greenBlue == "6 Yellow/green vs. blue" && redYellow == "4 Yellow/green vs. red") {
            return "Category 4A";
        } else if (greenBlue == "2 Green/blue" && redYellow == "1 Red vs. yellow") {
            return "Category 4B";
        } else if (greenBlue == "4 Black/blue vs. green" && redYellow == "1 Red vs. yellow") {
            return "Category 4C";
        } else if (greenBlue == "1 Green vs. blue" && redYellow == "1 Red vs. yellow") {
            return "Category 5";
        } else {
            return "No category";
        }
    };

    let highlightCategory = function (d, category) {

        let categories = [];

        // Run through wals_csv to get the language category, append to color
        let country = d.ISO_A2;
        wals_csv.filter(lang => lang.countrycodes.includes(country))
            .forEach(lang => {
                categories.push(colorCategoryMapper(lang["134A Green and Blue"], lang["135A Red and Yellow"]))
            });

        if (categories.length == 0) {
            return "steelblue";
        } else if (categories.includes(category)) {
            return "orange";
        } else {
            return "steelblue";
        }
    }

    let createColorCategoryButtons = function (svg, json) {
        let buttonGroup = svg.append("g").attr("id", "buttonGroup");
        let buttonWidth = colorcat_div.clientWidth / 10;
        let buttonHeight = colorcat_div.clientHeight / 20;
        let buttonX = colorcat_div.clientWidth / 20;
        let buttonY = colorcat_div.clientHeight / 20;
        let buttonPadding = colorcat_div.clientHeight / 20;
        let buttonNames = ["Category 2", "Category 3A", "Category 3B", "Category 3C", "Category 4A", "Category 4B", "Category 4C", "Category 5"];
        let buttonColors = ["steelblue", "orange", "green", "yellow", "purple", "pink", "brown", "black"];

        for (let i = 0; i < buttonNames.length; i++) {
            let button = buttonGroup.append("rect")
                .attr("x", buttonX)
                .attr("y", buttonY + i * (buttonHeight + buttonPadding))
                .attr("width", buttonWidth)
                .attr("height", buttonHeight)
                .attr("fill", buttonColors[i])
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("rx", 5)
                .attr("ry", 5)
                .on("click", function () {
                    color_country("steelblue", json, highlightCategory, buttonNames[i]);
                    colorcat_map.json(json);
                    colorcat_countriesGroup = colorcat_map();
                });

            buttonGroup.append("text")
                .attr("x", buttonX + buttonWidth / 2)
                .attr("y", buttonY + i * (buttonHeight + buttonPadding) + buttonHeight / 2)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .text(buttonNames[i])
                .attr("fill", "black")
                .style("font-size", "12px");
        }
    }

    // Create map object
    var colorcat_map = map()
        .map_id(map_id)
        .x(colorcat_div.clientWidth / 5)
        .y(0)
        .width(4 * colorcat_div.clientWidth / 5)
        .height(colorcat_div.clientHeight)
        .json(json)
        .allCountries(official_language_csv)
        .svg(svg)
        .color_mapper(function (d) { return d.properties.color; });

    var colorcat_countriesGroup = colorcat_map();

    createColorCategoryButtons(svg, json);

    console.log(wals_csv)
}