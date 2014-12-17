
(function($) {

  "use strict";

  $(document).ready(function(){

    var colors = [null, "blue", "green", "red", "darkblue", "brown", "cyan", "black", "gray"];

    var nMines = 10;
    var boardSize = 8;
    var n = 0, i = 0, j = 0;

    var $board = $(".board");

    populateMines();

    function populateMines() {
      while(n < nMines){
        var x = Math.floor((Math.random() * boardSize));
        var y = Math.floor((Math.random() * boardSize));

        var $cell = $board.find("tr").eq(y).find("td").eq(x);
        var content = $cell.text();
        if(content == 'XX') {
          $cell.text('O').css("background-color", "lightgray");
          n++;
        }
      }
      populateNumbers();
    }

    function populateNumbers() {
      var $central;

      for(i = 0; i < boardSize; i++) {
        for(j = 0; j < boardSize; j++) {
          var total = 0;
          $central = $board.find("tr").eq(i).find("td").eq(j);
          if($central.text() == 'XX') {
            if(i-1 >= 0 && j-1 >= 0) {
              if($board.find("tr").eq(i-1).find("td").eq(j-1).text() == 'O') total++;
            }
            if(i-1 >= 0) {
              if($board.find("tr").eq(i-1).find("td").eq(j).text() == 'O') total++;
            }
            if(i-1 >= 0 && j+1 <= boardSize) {
              if($board.find("tr").eq(i-1).find("td").eq(j+1).text() == 'O') total++;
            }
            if(j-1 >= 0) {
              if($board.find("tr").eq(i).find("td").eq(j-1).text() == 'O') total++;
            }
            if(j+1 <= boardSize) {
              if($board.find("tr").eq(i).find("td").eq(j+1).text() == 'O') total++;
            }
            if(i+1 <= boardSize && j-1 >= 0) {
              if($board.find("tr").eq(i+1).find("td").eq(j-1).text() == 'O') total++;
            }
            if(i+1 <= boardSize) {
              if($board.find("tr").eq(i+1).find("td").eq(j).text() == 'O') total++;
            }
            if(i+1 <= boardSize && j+1 <= boardSize) {
              if($board.find("tr").eq(i+1).find("td").eq(j+1).text() == 'O') total++;
            }
            if(total > 0) {
              $central.text(total).css("color", colors[total]);
            } else {
              $central.text("");
            }
          }
        }
      }
    }
  });

})(jQuery);
