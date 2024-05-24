function sentence_order_ready(error, json, official_language_csv, wals_csv){

}

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

  function checkAnswer(){
    let sum = 0;
    for (const droparea of document.getElementsByClassName("word-recipient-area")){
        sum += droparea.children.length;
    }
    if (sum === 3){
        console.log("Complete!");
    }
  }