/*
 * Create a list that holds all of your cards
 */
var allCards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

//Declaring necessary variables for further usage
var cardList = []; // to keep track of open cards
var movesCount = 0; //to count number of moves
var matchesCount = 0; //to count number of matches


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
// loop through each card and create its HTML

function generateHtml() {
  var cardList = shuffle(allCards);
  cardList.forEach(function (card) {
    $(".deck").append('<li><i class="card fa ' + card + '"></i></li>');
  })
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Logic to find matching cards
function Click() {
  // Displaying cards symbol
  $(".card").on("click", function () {
    if ($(this).hasClass("open show")) { return; }
    //toggling the class
    $(this).toggleClass("open show");
    //adding to empty array for further checking
    cardList.push($(this));
    var length = cardList.length;
    if (length == 2) {
      var firstCard = cardList[0][0];
      var secondCard = cardList[1][0];
      if (firstCard.classList[2] === secondCard.classList[2]) { //Checking if same symbol clicked
        firstCard.classList.add("match");
        secondCard.classList.add("match");
        $(cardList[0]).off('click'); //disabling further clicking on mathced cards
        $(cardList[1]).off('click');
        matchesCount++;
        movesCount++;
        updateStars();
        cardList = [];
        if (matchesCount === 8) {
          //display the final score
          finalScore();
        }

      }
      else {
        //No match add incorrect class
        firstCard.classList.add("incorrect");
        secondCard.classList.add("incorrect");
        //resetting everything
        window.setTimeout(clearAll, 1100);
        movesCount++;
        updateStars();

      }
    }
    $("#moves").text(movesCount.toString());
  })
}

//clear al the classes
function clearAll() {
  $(".card").removeClass("incorrect show open");
  cardList = [];
}



//display the final score
function finalScore() {
  $('#sucess-result').empty();
  var scoreBoard = `
      <center>
      <p> Congratulations </p>
      <p>
          <span>Moves:${movesCount}</span>
      </p>
      </center>
      <div>
           <div class="rating">
              <i class="fa fa-star fa-3x"></i>
           </div>
           <div class="rating">
              <i class="fa ${ (movesCount > 25) ? "fa-star-o" : "fa-star"}  fa-3x"></i>
           </div>
          <div class="rating">
              <i class="fa ${ (movesCount > 15) ? "fa-star-o" : "fa-star"} fa-3x"></i>
           </div>
      </div>
      <div id="restart">
          <i class="fa fa-repeat fa-3x"></i>
        </div>
  `;
  $('.container')[0].style.display = "none";
  $('#sucess-result').append($(scoreBoard));
  $("#restart").on("click", function () { //reset the game
    location.reload()
  });
}


// Update HTML with number of moves
function updateStars()
{
  if (movesCount >= 15 && movesCount <25) {
    $("#Two").removeClass("fa-star");
  } else if (movesCount > 20) {
    $("#Three").removeClass("fa-star");
    starRating = "1";
  }
}



//Initial Calling
generateHtml();
Click();