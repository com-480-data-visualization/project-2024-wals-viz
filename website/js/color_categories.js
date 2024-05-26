function color_categories_ready(error, json, official_language_csv, wals_csv) {
    var colorcat_div = document.getElementById('colorcategories-col');

    var non_highlighted_color = "#dac0a3ff";
    var highlighted_color = "#102c57ff";

    var red_color = "#e74c3cff";
    var yellow_color = "#f4d03fff";
    var green_color = "#1e8449ff";
    var blue_color = "#2980b9ff";

    let text_margin_x = 20;

    //Create SVG element
    var svg = d3.select(colorcat_div)
        .append("svg")
        .attr("width", colorcat_div.clientWidth)
        .attr("height", colorcat_div.clientHeight);

    // svg.append("foreignObject")
    //     .attr('transform', 'translate(' + (0 + text_margin_x) + ',' + 0 / 2 + ')')
    //     .attr("width", 750)
    //     .attr("height", 250)
    //     .append("xhtml:div")
    //     .style("font", "64px 'Helvetica'")
    //     .html("Basic color categories");

    var map_id = "colorcategories_map";

    var colorcategories_palette = svg.append("g").attr("id", "colorcategories_palette");

    // Show the color palette for the selected category in the given position and size
    let showColorPalette = function (x, y, width, height, category) {
        // Remove the previous palette
        colorcategories_palette.selectAll("*").remove();

        // Compute center of the palette and square size
        let squareSize = Math.min(2 * width / 11, 3 * height / 4);
        let squarePadding = squareSize / 2;
        let textPadding = squareSize / 3;
        let centerX = x + width / 2;
        let textY = y + squareSize + textPadding / 2;

        // Same as drawSquare1, but with a starting X position and in horizontal order
        let drawSquare = function (order, x, text, numColors, color1, color2 = null, color3 = null) {
            switch (numColors) {
                case 1:
                    colorcategories_palette.append("rect")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", squareSize)
                        .attr("height", squareSize)
                        .attr("fill", color1)
                        .attr("stroke", (color1 == "white") ? non_highlighted_color : color1);
                    break;
                case 2:
                    colorcategories_palette.append("rect")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", squareSize / 2)
                        .attr("height", squareSize)
                        .attr("fill", color1)
                        .attr("stroke", (color1 == "white") ? non_highlighted_color : color1);
                    colorcategories_palette.append("rect")
                        .attr("x", x + squareSize / 2)
                        .attr("y", y)
                        .attr("width", squareSize / 2)
                        .attr("height", squareSize)
                        .attr("fill", color2)
                        .attr("stroke", (color2 == "white") ? non_highlighted_color : color2);
                    break;
                case 3:
                    colorcategories_palette.append("rect")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", squareSize / 3)
                        .attr("height", squareSize)
                        .attr("fill", color1)
                        .attr("stroke", (color1 == "white") ? non_highlighted_color : color1);
                    colorcategories_palette.append("rect")
                        .attr("x", x + squareSize / 3)
                        .attr("y", y)
                        .attr("width", squareSize / 3)
                        .attr("height", squareSize)
                        .attr("fill", color2)
                        .attr("stroke", (color2 == "white") ? non_highlighted_color : color2);
                    colorcategories_palette.append("rect")
                        .attr("x", x + 2 * squareSize / 3)
                        .attr("y", y)
                        .attr("width", squareSize / 3)
                        .attr("height", squareSize)
                        .attr("fill", color3)
                        .attr("stroke", (color3 == "white") ? non_highlighted_color : color3);
                    break;
                default: break;
            }
            colorcategories_palette.append("text")
                .attr("x", x + squareSize / 2)
                .attr("y", textY)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .text(text)
                .attr("fill", highlighted_color)
                .style("font-size", "24px 'Helvetica'");
        }

        // Draw the squares forming the palette. If formed by more than one color, form the square
        // using rectangles of the corresponding colors. Also, label the category
        switch (category) {
            case "Category 2":  // 3 squares: White, red/yellow, black/green/blue
                drawSquare(0, centerX - 3*squareSize/2 - squarePadding, "White", 1, "white");
                drawSquare(1, centerX - squareSize/2, "Red/yellow", 2, red_color, yellow_color);
                drawSquare(2, centerX + squareSize/2 + squarePadding, "Black/green/blue", 3, "black", green_color, blue_color);
                break;
            case "Category 3A": // 4 squares: White, red, yellow, black/green/blue
                drawSquare(0, centerX - 2*squareSize - 3*squarePadding/2, "White", 1, "white");
                drawSquare(1, centerX - squareSize - squarePadding/2, "Red", 1, red_color);
                drawSquare(2, centerX + squarePadding/2, "Yellow", 1, yellow_color);
                drawSquare(3, centerX + squareSize + 3*squarePadding/2, "Black/green/blue", 3, "black", green_color, blue_color);
                break;
            case "Category 3B": // 4 squares: White, red/yellow, black, green/blue
                drawSquare(0, centerX - 2*squareSize - 3*squarePadding/2, "White", 1, "white");
                drawSquare(1, centerX - squareSize - squarePadding/2, "Red/yellow", 2, red_color, yellow_color);
                drawSquare(2, centerX + squarePadding/2, "Green/blue", 2, green_color, blue_color);
                drawSquare(3, centerX + squareSize + 3*squarePadding/2, "Black", 1, "black");
                break;
            case "Category 3C": // 4 squares: White, red, yellow/green/blue, black
                drawSquare(0, centerX - 2*squareSize - 3*squarePadding/2, "White", 1, "white");
                drawSquare(1, centerX - squareSize - squarePadding/2, "Red", 1, red_color);
                drawSquare(2, centerX + squarePadding/2, "Yellow/green/blue", 3, yellow_color, green_color, blue_color);
                drawSquare(3, centerX + squareSize + 3*squarePadding/2, "Black", 1, "black");
                break;
            case "Category 4A": // 5 squares: White, red, yellow/green, black, blue
                drawSquare(0, centerX - 5*squareSize/2 - 2*squarePadding, "White", 1, "white");
                drawSquare(1, centerX - 3*squareSize/2 - squarePadding, "Red", 1, red_color);
                drawSquare(2, centerX - squareSize/2, "Yellow/green", 2, yellow_color, green_color);
                drawSquare(3, centerX + squareSize/2 + squarePadding, "Blue", 1, blue_color);
                drawSquare(4, centerX + 3*squareSize/2 + 2*squarePadding, "Black", 1, "black");
                break;
            case "Category 4B": // 5 squares: White, red, yellow, black, blue/green
                drawSquare(0, centerX - 5*squareSize/2 - 2*squarePadding, "White", 1, "white");
                drawSquare(1, centerX - 3*squareSize/2 - squarePadding, "Red", 1, red_color);
                drawSquare(2, centerX - squareSize/2, "Yellow", 1, yellow_color);
                drawSquare(3, centerX + squareSize/2 + squarePadding, "Blue/green", 2, blue_color, green_color);
                drawSquare(4, centerX + 3*squareSize/2 + 2*squarePadding, "Black", 1, "black");
                break;
            case "Category 4C": // 5 squares: White, red, yellow, green, black/blue
                drawSquare(0, centerX - 5*squareSize/2 - 2*squarePadding, "White", 1, "white");
                drawSquare(1, centerX - 3*squareSize/2 - squarePadding, "Red", 1, red_color);
                drawSquare(2, centerX - squareSize/2, "Yellow", 1, yellow_color);
                drawSquare(3, centerX + squareSize/2 + squarePadding, "Green", 1, green_color);
                drawSquare(4, centerX + 3*squareSize/2 + 2*squarePadding, "Black/blue", 2, "black", blue_color);
                break;
            case "Category 5": // 6 squares: White, red, yellow, green, black, blue
                drawSquare(0, centerX - 3*squareSize - 5*squarePadding/2, "White", 1, "white");
                drawSquare(1, centerX - 2*squareSize - 3*squarePadding/2, "Red", 1, red_color);
                drawSquare(2, centerX - squareSize - squarePadding/2, "Yellow", 1, yellow_color);
                drawSquare(3, centerX + squarePadding/2, "Green", 1, green_color);
                drawSquare(4, centerX + squareSize + 3*squarePadding/2, "Blue", 1, blue_color);
                drawSquare(5, centerX + 2*squareSize + 5*squarePadding/2, "Black", 1, "black");
                break;
            default: break;
        }
    }

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
            return non_highlighted_color;
        } else if (categories.includes(category)) {
            return highlighted_color;
        } else {
            return non_highlighted_color;
        }
    }

    let createColorCategoryButtons = function (svg, json) {
        let buttonGroup = svg.append("g").attr("id", "buttonGroup");
        let buttonWidth = colorcat_div.clientWidth / 10;
        let buttonHeight = colorcat_div.clientHeight / 18;
        let buttonX = colorcat_div.clientWidth / 20;
        let buttonY = colorcat_div.clientHeight - 8 * colorcat_div.clientHeight / 20;
        let buttonPadding = colorcat_div.clientHeight / 36;
        let buttonNames = ["Category 2", "Category 3A", "Category 3B", "Category 3C", "Category 4A", "Category 4B", "Category 4C", "Category 5"];
        let buttonColors = [
            ["white", red_color, "black"],
            ["white", red_color, yellow_color, "black"],
            ["white", red_color, blue_color, "black"],
            ["white", red_color, green_color, "black"],
            ["white", red_color, green_color, blue_color, "black"],
            ["white", red_color, yellow_color, blue_color, "black"],
            ["white", red_color, yellow_color, green_color, "black"],
            ["white", red_color, yellow_color, green_color, blue_color, "black"]
        ];

        let paletteX = colorcat_div.clientWidth / 5;
        let paletteY = 5 * colorcat_div.clientHeight / 6;
        let paletteWidth = 4 * colorcat_div.clientWidth / 5;
        let paletteHeight = colorcat_div.clientHeight / 6;

        let drawButton = function (button, order, colors, curButtonX, curButtonY) {
            for (let i = 0; i < colors.length; i++) {
                button.append("rect")
                    .attr("x", curButtonX + (i * (buttonWidth / colors.length)))
                    .attr("y", curButtonY)
                    .attr("width", buttonWidth / colors.length)
                    .attr("height", buttonHeight)
                    .attr("fill", colors[i])
                    .attr("stroke", (colors[i] == "white") ? non_highlighted_color : colors[i]);
            }
        }

        for (let i = 0; i < buttonNames.length; i++) {
            let curButtonX = buttonX + (Math.floor(i / 4) * (buttonWidth + buttonPadding));
            let curButtonY = buttonY + (i % 4) * (buttonHeight + buttonPadding);
            let button = buttonGroup.append("g")
                .attr("x", curButtonX)
                .attr("y", curButtonY)
                .attr("width", buttonWidth)
                .attr("height", buttonHeight)
                .attr("fill", buttonColors[i])
                .on("click", function () {
                    color_country(non_highlighted_color, json, highlightCategory, buttonNames[i]);
                    colorcat_map.json(json);
                    colorcat_countriesGroup = colorcat_map();
                    showColorPalette(paletteX, paletteY, paletteWidth, paletteHeight, buttonNames[i])
                });
            drawButton(button, i, buttonColors[i], curButtonX, curButtonY);
        }
    }

    // Create map object
    var colorcat_map = map()
        .map_id(map_id)
        .x(colorcat_div.clientWidth / 5)
        .y(0)
        .width(4 * colorcat_div.clientWidth / 5)
        .height(5 * colorcat_div.clientHeight / 6)
        .json(json)
        .allCountries(official_language_csv)
        .svg(svg)
        .color_mapper(function (d) { return d.properties.color; });

    var colorcat_countriesGroup = colorcat_map();

    createColorCategoryButtons(svg, json);
}