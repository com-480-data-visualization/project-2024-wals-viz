function vowel_ready(error, json, official_language_csv, wals_csv) {
    var highlighted_color = "#102c57ff";

    const color_5 = ["#AAAAAAFF", // Unknown
        "#DAC0A3FF", // 1
        "#CDA580FF", // 2
        "#BE8B5FFF", // 3
        "#AE713EFF", // 4
        "#9C581CFF"];

    const color_3 = ["#AAAAAAFF", // Unknown 
        "#DAC0A3FF", // 1
        "#BE8B5FFF", // 2
        "#9C581CFF", // 3
        "#AAAAAAFF", // 4
        "#AAAAAAFF"];

    let colors = d3.scaleOrdinal(
        [0, 1, 2, 3, 4, 5],
        color_5);

        // TODO
    let numConsonantsTexts = ["Unknown", "Small: 6 to 14", "Moderately small: 15 to 18", "Average: 19 to 25", "Moderately large: 26 to 33", "Large: More than 34"];
    let numVowelsTexts = ["Unknown", "Low: V < 5", "Average: 7 < V < 10", "High: V > 13"];
    let vowelRatioTexts = ["Unknown", "Low: C/V < 2", "Moderately low: 2 < C/V < 2.75", "Average: 2.75 < C/V < 4.5", "Moderately high: 4.5 < C/V < 6.5", "High: C/V > 6.5"];
    let toneTexts = ["Unknown", "No tones", "1-2 tones", "3-4 tones"];

    var vowel_div = document.getElementById('vowel-col');
    var width = vowel_div.clientWidth;
    var height = vowel_div.clientHeight;

    var svg = d3.select(vowel_div)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var map_id = "vowel_map";

    let applyHeatmapColor = function (d, category, colors) {
        let categories = [];

        // Run through wals_csv to get the language category, append to categories
        let country = d.ISO_A2;
        wals_csv.filter(lang => lang.countrycodes.includes(country))
            .forEach(lang => {
                if (lang[category] != "") { categories.push(lang[category]); }
            });

        if (categories.length === 0) {
            return colors(0);
        } else {
            let mostFrequent = Array.from(new Set(categories)).reduce((prev, curr) =>
                categories.filter(el => el === curr).length > categories.filter(el => el === prev).length ? curr : prev
            );
            // Trim the category to get the number, which is the first character
            return colors(parseInt(mostFrequent.substring(0, 1)));
        }
    };

    let drawLegend = function (legend, x, y, width, height, colors, legends) {

        legend.selectAll("*").remove();
        rectHeight = height / legends.length;

        for (let i = 0; i < legends.length; i++) {
            legend.append("rect")
                .attr("x", x)
                .attr("y", y + rectHeight * i)
                .attr("width", width)
                .attr("height", rectHeight)
                .attr("fill", colors[i]);

            legend.append("text")
                .attr("id", "legend-text" + i)
                .attr("x", x + width + 10)
                .attr("y", y + rectHeight * i + rectHeight / 2)
                .attr("anchor", "start")
                .attr("alignment-baseline", "middle")
                .attr("fill", highlighted_color)
                .text(legends[i]);
        }

        return legend;
    };

    // Draw the buttons to change the category represented in the heatmap
    let drawButtons = function (svg, x, y, width, height, vowel_map) {
        let categories = ["Number of Consonants", "Number of Vowels", "Consonant-Vowel Ratio", "Usage of Tones"];
        let category_index = ["1A Consonant Inventories", "2A Vowel Quality Inventories", "3A Consonant-Vowel Ratio", "13A Tone"];
        let colorsHeat = [color_5, color_3, color_5, color_3];
        let legends = [numConsonantsTexts, numVowelsTexts, vowelRatioTexts, toneTexts];

        elementHeight = 2 * height / (2 * categories.length - 1);
        elementPadding = height / (2 * categories.length - 1);

        for (let i = 0; i < categories.length; i++) {
            let button = svg.append("g")
                .on("click", function () {
                    colors = d3.scaleOrdinal(
                        [0, 1, 2, 3, 4, 5],
                        colorsHeat[i]);
                    color_country(colors(0), json, applyHeatmapColor, category_index[i], colors);
                    vowel_map.json(json);
                    vowel_countriesGroup = vowel_map();
                    drawLegend(legend, 8 * vowel_div.clientWidth / 9, vowel_div.clientHeight / 3, 60, vowel_div.clientHeight / 3, colorsHeat[i], legends[i]);
                });

            button.append("rect")
                .attr("x", x)
                .attr("y", y + (elementHeight + elementPadding) * i)
                .attr("width", width)
                .attr("height", elementHeight)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("fill", highlighted_color)

            button.append("text")
                .attr("x", x + width / 2)
                .attr("y", y + (elementHeight + elementPadding) * i + elementHeight / 2)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("fill", "white")
                .text(categories[i]);
        }
    }

    var vowel_map = map()
        .map_id(map_id)
        .x(60)
        .y(0)
        .width(8 * vowel_div.clientWidth / 9)
        .height(height)
        .json(json)
        .allCountries(official_language_csv)
        .svg(svg)
        .color_mapper(function (d) { return d.properties.color; });

    console.log("vowel map ready");

    var vowel_countriesGroup = vowel_map();
    drawButtons(svg, 60, 0, vowel_div.clientWidth / 9, vowel_div.clientHeight / 3, vowel_map);
    let legend = svg.append("g").attr("id", "legend");
    drawLegend(legend, 8 * vowel_div.clientWidth / 9, vowel_div.clientHeight / 3, 60, vowel_div.clientHeight / 3, color_5, numConsonantsTexts);
    color_country(colors(0), json, applyHeatmapColor, "1A Consonant Inventories", colors);
}