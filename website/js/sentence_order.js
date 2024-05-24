var non_highlighted_color = "#dac0a3ff";
var highlighted_color = "#102c57ff";

function sentence_order_ready(error, json, official_language_csv, wals_csv){
    document.getElementById("first_word_recepient").addEventListener("drop", dropWord);
    document.getElementById("second_word_recepient").addEventListener("drop", dropWord);
    document.getElementById("third_word_recepient").addEventListener("drop", dropWord);

    document.getElementById("first_word_recepient").addEventListener("dragover", allowWordDrop);
    document.getElementById("second_word_recepient").addEventListener("dragover", allowWordDrop);
    document.getElementById("third_word_recepient").addEventListener("dragover", allowWordDrop);

    document.getElementById("drop-word-subject").addEventListener("dragstart", dragWord);
    document.getElementById("drop-word-verb").addEventListener("dragstart", dragWord);
    document.getElementById("drop-word-object").addEventListener("dragstart", dragWord);

    var map_id = "sentenceorder_map";
    var sentenceorder_div = document.getElementById('sentenceorder-col');

    var svg = d3.select(sentenceorder_div)
        .insert("svg")
        .lower()
        .attr("width", sentenceorder_div.clientWidth)
        .attr("height", sentenceorder_div.clientHeight / 2);

    
    var sentenceorder_map = map()
            .map_id(map_id)
            .x(sentenceorder_div.clientWidth / 5)
            .y(0)
            .width(3 * sentenceorder_div.clientWidth / 5)
            .height(sentenceorder_div.clientHeight / 2)
            .json(json)
            .allCountries(official_language_csv)
            .svg(svg)
            .color_mapper(function (d) { return d.properties.color; });

    var colorcat_countriesGroup = sentenceorder_map();

    let highlightCategory = function (d, category) {
        let country = d.ISO_A2;
        

        let languagesInCountry = wals_csv.filter((elem) => {
            return elem["81A Order of Subject, Object and Verb"] === category;
        }).filter(lang => lang.countrycodes.includes(country));
        
        if (languagesInCountry.length > 0) return highlighted_color;
        
        return non_highlighted_color;

    }

    function updateColors(non_highlighted_color, json, highlightCategory, category){
        color_country(non_highlighted_color, json, highlightCategory,category);
        sentenceorder_map.json(json);
        sentenceorder_countriesGroup = sentenceorder_map();
    }

    function allowWordDrop(ev)
    {
        ev.preventDefault();
    }
    
    function dragWord(ev)
    {
        ev.dataTransfer.setData("Text",ev.target.id);
    }

    const element_id_codes = {
        'drop-word-subject' : 'S',
        'drop-word-verb' : 'V',
        'drop-word-object' : 'O'
    };

    const element_id_readable_codes = {
        'drop-word-subject' : 'Subject',
        'drop-word-verb' : 'Verb',
        'drop-word-object' : 'Object'
    };


    const order_codes = {
        'SOV': '1 SOV',
        'SVO': '2 SVO',
        'VSO': '3 VSO',
        'VOS': '4 VOS',
        'OVS': '5 OVS',
        'OSV': '6 OSV',
    };

    function dropWord(ev)
    {
        ev.preventDefault();
        if (ev.target.className === "word-recipient-area") {
            if (ev.target.children.length === 0){
                var data=ev.dataTransfer.getData("Text");
                ev.target.appendChild(document.getElementById(data));
                checkAnswer();

                elementReadableName = element_id_readable_codes[document.getElementById(data).id];
                ev.target.parentNode.children[0].innerText = elementReadableName;
            }
        }
    }

    function checkAnswer(){
        let sum = 0;
        let query_string = "";
        for (const droparea of document.getElementsByClassName("word-recipient-area")){
            sum += droparea.children.length;
            
            if (droparea.children.length >= 1){
                query_string += element_id_codes[droparea.children[0].id];
            }
        }

        if (sum === 3){
            query_string = order_codes[query_string];
            updateColors(non_highlighted_color, json, highlightCategory, query_string);
        }
    }
}