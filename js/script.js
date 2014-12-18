/*! luisddm/minesweeper v0.1 | (c) 2014 https://github.com/luisddm/minesweeper | GNU GPL License */

(function($) {

  "use strict";

  $(document).ready(function(){

    var fgColors = ["white", "blue", "green", "red", "darkblue", "brown", "cyan", "black", "gray"];
    var bgColors = ["black", "#eee", "#eee", "#eee", "#eee", "#eee", "#eee", "#eee", "#eee"];

    var nMines = 10;
    var boardSize = 8;
    var n = 0, i = 0, j = 0;

    var $board = $(".board");
    var $time = $(".time");

    setInterval(function() {
      $time.text(+$time.text() + 1);
    }, 1000);

    // Pupulate the board with mines in random positions
    while(n < nMines) {
      var x = randomNumber(boardSize);
      var y = randomNumber(boardSize);

      var $cell = $board.find("tr").eq(y).find("td").eq(x);
      var content = $cell.data("mines");
      if(content !== 0) {
        $cell.data("mines", 0);
        n++;
      }
    }

    // Look all the fields one by one searching for how many mines are around
    for(i = 0; i < boardSize; i++) {
      for(j = 0; j < boardSize; j++) {
        var total = 0;
        var $central = $board.find("tr").eq(i).find("td").eq(j);
        if($central.data("mines") !== 0) {
          if(i-1 >= 0 && j-1 >= 0) {
            if($board.find("tr").eq(i-1).find("td").eq(j-1).data("mines") === 0) total++;
          }
          if(i-1 >= 0) {
            if($board.find("tr").eq(i-1).find("td").eq(j).data("mines") === 0) total++;
          }
          if(i-1 >= 0 && j+1 <= boardSize) {
            if($board.find("tr").eq(i-1).find("td").eq(j+1).data("mines") === 0) total++;
          }
          if(j-1 >= 0) {
            if($board.find("tr").eq(i).find("td").eq(j-1).data("mines") === 0) total++;
          }
          if(j+1 <= boardSize) {
            if($board.find("tr").eq(i).find("td").eq(j+1).data("mines") === 0) total++;
          }
          if(i+1 <= boardSize && j-1 >= 0) {
            if($board.find("tr").eq(i+1).find("td").eq(j-1).data("mines") === 0) total++;
          }
          if(i+1 <= boardSize) {
            if($board.find("tr").eq(i+1).find("td").eq(j).data("mines") === 0) total++;
          }
          if(i+1 <= boardSize && j+1 <= boardSize) {
            if($board.find("tr").eq(i+1).find("td").eq(j+1).data("mines") === 0) total++;
          }
          if(total > 0){
            $central.data("mines", total);
          }
        }
      }
    }

    // Click on any field to reveal the number or the mine
    $board.find("td").on("click", function() {
      //var posX = $(this).index();
      //var posY = $(this).parent().index();
      //alert("Pos "+posX+","+posY);
      showField($(this));

    });

    // Reveal al the board
    $("h1").on("click", function() {
      $board.find("td").each(function(index) {
        showField($(this));
      });
    });

    /*
     * Show what's hidden behind a field (a mine, a number or a void)
     */
    function showField($field) {
      if(typeof $field.data("mines") != "undefined") {
        $field.text($field.data("mines")).css({
          "color": fgColors[$field.data("mines")],
          "background-color": bgColors[$field.data("mines")]
        });
      } else {
        $field.text($field.data("mines")).css({
          "background-color": "#eee"
        });
      }
    }

  });

  // Random number generation between 0 and boardSize-1
  function randomNumber(boardSize) {
    return Math.floor((Math.random() * boardSize));
  }

})(jQuery);
