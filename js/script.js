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

    // Start a counter in seconds
    var timer = setInterval(function() {
      $time.text(+$time.text() + 1);
    }, 1000);

    // Populate the board with mines in random positions
    while(n < nMines) {
      var x = randomNumber(boardSize);
      var y = randomNumber(boardSize);

      var $cell = $board.find("tr").eq(y).find("td").eq(x);

      // Place a mine in the generated position only if there is no mine previously placed
      if($cell.data("mines") !== 0) {
        $cell.data("mines", 0);
        n++;
      }
    }

    // For each field look all around searching for how many mines are, and set this
    // number as a data value
    for(i = 0; i < boardSize; i++) {
      for(j = 0; j < boardSize; j++) {
        var total = 0;
        var $field = $board.find("tr").eq(i).find("td").eq(j);
        $field.data("revealed", false);
        if($field.data("mines") !== 0) {
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
            $field.data("mines", total);
          }
        }
      }
    }

    // Reveal all the board (PROVISIONAL, only for debug purposes)
    $("h1").on("click", function() {
      $board.find("td").each(function(index) {
        revealField($(this));
      });
    });

    /*
    * Reveal all the fields containing a mine
    */
    function revealAllMines() {
      for(i = 0; i < boardSize; i++) {
        for(j = 0; j < boardSize; j++) {
          var $field = $board.find("tr").eq(i).find("td").eq(j);
          if($field.data("mines") === 0) {
            revealField($field);
          }
        }
      }
      $board.find("td").unbind("click");
      clearInterval(timer);
    }

    /*
    * Show what's hidden behind a field (a mine, a number or an empty field)
    */
    function revealField($field) {
      $field.text($field.data("mines")).data("revealed", true);
      if(typeof $field.data("mines") != "undefined") {
        $field.css({
          "color": fgColors[$field.data("mines")],
          "background-color": bgColors[$field.data("mines")]
        });
      } else {
        $field.css({
          "background-color": "#eee"
        });
      }
    }

    // Click event on any field. It has to reveal a number, a mine, or all the empty
    // fields around if it is an empty one itself
    $board.find("td").on("click", function() {
      var $field = $(this);
      if($field.data("mines") === 0) {
        revealAllMines();
      } else if(typeof $field.data("mines") !== "undefined") {
        revealField($field);
      } else {
        revealField($field);

        var f=[], g, k, l, n=0;
        f[n] = getVoidsAround($field);

        do {
          f[n+1] = [];
          for(k=0; k<f[n].length; k++) {
            g = getVoidsAround($board.find("tr").eq(f[n][k].x).find("td").eq(f[n][k].y));
            for(l=0; l<g.length; l++) {
              f[n+1].push(g[l]);
            }
          }
          console.log(JSON.stringify(f[n+1])); // debug
          n++;
        } while (f[n].length > 0);

      }

    });

    /*
     * Reveal all the 8 fields around a given one and return the empty fields around
     * to continue the searching
     */
    function getVoidsAround($field) {
      // Get indices of the field
      var i = $field.parent().index();
      var j = $field.index();

      // Create an array which will contain the empty fields
      var $voids = [];

      // Reveal all the adjacent fields (when exist) and search for voids
      if(i-1 >= 0 && j-1 >= 0) {
        var $field1 = $board.find("tr").eq(i-1).find("td").eq(j-1);
        if(typeof $field1.data("mines") == "undefined" && $field1.data("revealed") === false) {
          $voids.push({"x":i-1, "y":j-1});
        }
        revealField($field1);
      }
      if(i-1 >= 0) {
        var $field2 = $board.find("tr").eq(i-1).find("td").eq(j);
        if(typeof $field2.data("mines") == "undefined" && $field2.data("revealed") === false) {
          $voids.push({"x":i-1, "y":j});
        }
        revealField($field2);
      }
      if(i-1 >= 0 && j+1 <= boardSize) {
        var $field3 = $board.find("tr").eq(i-1).find("td").eq(j+1);
        if(typeof $field3.data("mines") == "undefined" && $field3.data("revealed") === false) {
          $voids.push({"x":i-1, "y":j+1});
        }
        revealField($field3);
      }
      if(j-1 >= 0) {
        var $field4 = $board.find("tr").eq(i).find("td").eq(j-1);
        if(typeof $field4.data("mines") == "undefined" && $field4.data("revealed") === false) {
          $voids.push({"x":i, "y":j-1});
        }
        revealField($field4);
      }
      if(j+1 <= boardSize) {
        var $field5 = $board.find("tr").eq(i).find("td").eq(j+1);
        if(typeof $field5.data("mines") == "undefined" && $field5.data("revealed") === false) {
          $voids.push({"x":i, "y":j+1});
        }
        revealField($field5);
      }
      if(i+1 <= boardSize && j-1 >= 0) {
        var $field6 = $board.find("tr").eq(i+1).find("td").eq(j-1);
        if(typeof $field6.data("mines") == "undefined" && $field6.data("revealed") === false) {
          $voids.push({"x":i+1, "y":j-1});
        }
        revealField($field6);
      }
      if(i+1 <= boardSize) {
        var $field7 = $board.find("tr").eq(i+1).find("td").eq(j);
        if(typeof $field7.data("mines") == "undefined" && $field7.data("revealed") === false) {
          $voids.push({"x":i+1, "y":j});
        }
        revealField($field7);
      }
      if(i+1 <= boardSize && j+1 <= boardSize) {
        var $field8 = $board.find("tr").eq(i+1).find("td").eq(j+1);
        if(typeof $field8.data("mines") == "undefined" && $field8.data("revealed") === false) {
          $voids.push({"x":i+1, "y":j+1});
        }
        revealField($field8);
      }
      return $voids;
    }

  });

  // Random number generation between 0 and boardSize-1
  function randomNumber(boardSize) {
    return Math.floor((Math.random() * boardSize));
  }

})(jQuery);
