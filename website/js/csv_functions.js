// Functions to handle CSV files

// Merge allCountries data with the GeoJSON data
function merge_countries_geojson (allCountries, json) {
    for (let i = 0; i < json.features.length; i++) {
        json.features[i].properties.languages = [];
    }

    for (let i = 0; i < allCountries.length; i++) {
        let dataCountry = allCountries[i].iso_alpha2;
        let dataLanguages = allCountries[i].Languages;
        for (let j = 0; j < json.features.length; j++) {
            let jsonCountry = json.features[j].properties.ISO_A2;
            if (dataCountry == jsonCountry) {
                json.features[j].properties.languages = dataLanguages;
                break;
            }
        }
    }

    return json;
}