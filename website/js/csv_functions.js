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

// Returns the name of a language given its ISO code
function iso_to_lang (iso, wals) {
    let lang = wals.filter(function (d) {
        return d.iso_code == iso;
    });

    if (lang.length == 0) {
        switch (iso) {
            case "lat": lang_name = "Latin";                break;
            case "nrf": lang_name = "Jèrriais";             break;
            case "ber": lang_name = "Berber";               break;
            case "que": lang_name = "Quechua";              break;
            case "zdj": lang_name = "Ngazidja Comorian";    break;
            case "hif": lang_name = "Fiji Hindi";           break;
            case "zho": lang_name = "Chinese";              break;
            case "pih": lang_name = "Norfolk";              break;
            case "dzo": lang_name = "Dzongkha";             break;
            case "hmo": lang_name = "Hiri Motu";            break;
            case "mlg": lang_name = "Malagasy";             break;
            case "fil": lang_name = "Filipino";             break;
            case "hgm": lang_name = "Haiǁom";               break;
            case "srp": lang_name = "Serbian";              break;
            case "cnr": lang_name = "Montenegrin";          break;
            case "arc": lang_name = "Aramaic";              break;
            case "ckb": lang_name = "Sorani";               break;
            case "nno": lang_name = "Nynorsk";              break;
            case "nob": lang_name = "Bokmål";               break;
            case "smi": lang_name = "Sami";                 break;
            case "bwg": lang_name = "Barwe";                break;
            case "khi": lang_name = "Khoisan";              break;
            case "ndc": lang_name = "Ndau";                 break;
            case "zib": lang_name = "Zimbabwean Sign";      break;
            default:    lang_name = "Unknown, ISO code: " + iso; break;
        }
        return lang_name;
    }
    return lang[0].Name;
}