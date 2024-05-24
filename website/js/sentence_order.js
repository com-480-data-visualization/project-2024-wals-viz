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

    function allowWordDrop(ev)
    {
        ev.preventDefault();
    }
    
    function dragWord(ev)
    {
        ev.dataTransfer.setData("Text",ev.target.id);
    }

    function dropWord(ev)
    {
        ev.preventDefault();
        if (ev.target.className === "word-recipient-area") {
            if (ev.target.children.length === 0){
                var data=ev.dataTransfer.getData("Text");
                ev.target.appendChild(document.getElementById(data));
                checkAnswer();
            }
        }
    }

    const element_id_codes = {
        'drop-word-subject' : 'S',
        'drop-word-verb' : 'V',
        'drop-word-object' : 'O'
    };

    const order_codes = {
        'SOV': '1 SOV',
        'SVO': '2 SVO',
        'VSO': '3 VSO',
        'VOS': '4 VOS',
        'OVS': '5 OVS',
        'OSV': '6 OSV',
    };

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
            console.log(query_string);
            wals_csv.filter((elem) => {
                return elem["81A Order of Subject, Object and Verb"] === query_string;
            });
        }
    }
}