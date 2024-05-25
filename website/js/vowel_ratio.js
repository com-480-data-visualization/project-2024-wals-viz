function vowel_ready (error, json, official_language_csv, wals_csv) {
    
    const colors = d3.scaleOrdinal(
    [0, 1, 2, 3, 4, 5],
    ["#AAAAAAFF", // Unknown
        "#DAC0A3FF", // 1
        "#CDA580FF", // 2
        "#BE8B5FFF", // 3
        "#AE713EFF", // 4
        "#9C581CFF"]); // 5

    var vowel_div = document.getElementById('vowel-col');
    var width = vowel_div.clientWidth;
    var height = vowel_div.clientHeight;

    var svg = d3.select(vowel_div)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var map_id = "vowel_map";

    let applyHeatmapColor = function (d, category) {
        let categories = [];

        // Run through wals_csv to get the language category, append to categories
        let country = d.ISO_A2;
        wals_csv.filter(lang => lang.countrycodes.includes(country))
            .forEach(lang => {
                if (lang[category] != "") { categories.push(lang[category]); }
            });

        if (categories.length === 0) {
            console.log("No data for " + d.NAME + " in category " + category)
            return colors(0);
        } else {
            let mostFrequent = Array.from(new Set(categories)).reduce((prev, curr) =>
                categories.filter(el => el === curr).length > categories.filter(el => el === prev).length ? curr : prev
              );
            // Trim the category to get the number, which is the first character
            return colors(parseInt(mostFrequent.substring(0, 1)));
        }
    };

    color_country(colors(0), json, applyHeatmapColor, "3A Consonant-Vowel Ratio");

    var vowel_map = map()
        .map_id(map_id)
        .x(0)
        .y(0)
        .width(width)
        .height(height)
        .json(json)
        .allCountries(official_language_csv)
        .svg(svg)
        .color_mapper(function (d) { return d.properties.color; });

    console.log("vowel map ready");

    var vowel_countriesGroup = vowel_map();

    var vowel_countries = vowel_countriesGroup.selectAll("path")
        .on("click", function (d) {
            console.log(this)
            console.log("country clicked: " + this.NAME + " (" + this.color + ")");
        });
}