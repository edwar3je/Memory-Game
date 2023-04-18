let startButton = document.querySelector(".startBut");
let resetButton = document.querySelector(".resetBut");
let interval;
let clock = document.getElementById("clock");
let scoreBoard = document.getElementById("score");
let hiScore = document.getElementById("highscore");
let score = 0;
let highScore = parseInt(localStorage.getItem("highscore"));
let numClock = 0;
let start = false;
let gameOver = false;
let gameContainer = document.getElementById("game");
let card1 = null;
let card2 = null;
let cardsFlipped = 0;
let noClicking = false;
let COLORS = [];
// this will add text to the div below that shows the clock
clock.innerText = "Current Time: 0 seconds";
// this will add text to the div that displays the initial score
scoreBoard.innerText = "Current Score: 0 clicks";
// this will add text to the div that displays the high score if it exists
// and other text if a high score doesn't exist
if(localStorage.getItem("highscore") === null){
  hiScore.innerText = "High Score Displayed Here";
}
else{
  hiScore.innerText = `High Score: ${highScore}`;
}
// this function creates a random set of colors to push into the "COLORS" array
// the same random color is pushed twice to ensure there are an even number of cards
function ranColors() {
  for (let i = 0; i<6 ; i++){
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      COLORS.push(`rgb(${r},${g},${b})`);
      COLORS.push(`rgb(${r},${g},${b})`);
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
// shuffle(COLORS) here if needed
// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  if (noClicking) return;
  if (event.target.classList.contains("flipped")) return;
  
  // this function increases the score by 1 each time a card is clicked that is both neither "flipped" nor "noClicking"
  if (!event.target.classList.contains("flipped") && !noClicking){
    addScore();
  }

  let currentCard = event.target;
  currentCard.style.backgroundColor = currentCard.classList[0];

  if (!card1 || !card2) {
    currentCard.classList.add("flipped");
    card1 = card1 || currentCard;
    card2 = currentCard === card1 ? null : currentCard;
  }

  if (card1 && card2) {
    noClicking = true;
    let gif1 = card1.className;
    let gif2 = card2.className;

    if (gif1 === gif2) {
      cardsFlipped += 2;
      card1.removeEventListener("click", handleCardClick);
      card2.removeEventListener("click", handleCardClick);
      card1 = null;
      card2 = null;
      noClicking = false;
    } else {
      setTimeout(function() {
        card1.style.backgroundColor = "";
        card2.style.backgroundColor = "";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1 = null;
        card2 = null;
        noClicking = false;
      }, 1000);
    }
  }

  if (cardsFlipped === COLORS.length){
    alert(`Game Over! Your Score: ${score}! Your Time: ${numClock}`);
    gameOver = true;
    start = false;
    clearInterval(interval);
    remHigh();
  }
}

// this function removes all child elements of gameContainer
// courtesy of https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent){
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
}

// this function increases the timer (numClock) by 1.
function addTime(){
  numClock++;
}
// this function will start the timer and will be stopped by another function once all cards are flipped
// the variable interval is defined at the beginning to avoid any issues with scope (couldn't put both functions into a single one with a boolean)
function trackTime(){
  interval = setInterval(function(){
    addTime();
    clock.innerText = `Current Time: ${numClock} seconds`;
  }, 1000);
}

// this function will add 1 to the score each time it's implemented and change the text in the div
function addScore(){
  score++;
  scoreBoard.innerText = `Current Score: ${score} clicks`;
}

// this function will generate the high score in local storage if it doesn't exist
function addHigh(){
  localStorage.setItem("highscore", score);
  highScore = parseInt(localStorage.getItem("highscore"));
  hiScore.innerText = `High Score: ${highScore}`;
}

// this function will replace the high score if the score is lower than the high score
function newHigh(){
  localStorage.setItem("highscore", score);
  highScore = parseInt(localStorage.getItem("highscore"));
  hiScore.innerText = `High Score: ${highScore}`;
}

// this function encompasses both addHigh and newHigh
function remHigh(){
  if(localStorage.getItem("highscore") === null){
    addHigh();
  }
  else if(score < highScore){
    newHigh();
  }
}
// add a start button that begins the game once it's been pressed
startButton.addEventListener("click", function(){
  if(start == false && gameOver == false){
    ranColors();
    let shuffledColors = shuffle(COLORS);
    createDivsForColors(shuffledColors);
    start = true;
    trackTime();
  }
})
// add a reset button that only works once the game has ended
resetButton.addEventListener("click", function(){
  if(gameOver){
    removeAllChildNodes(gameContainer);
    start = true;
    gameOver = false;
    numClock = 0;
    score = 0;
    card1 = null;
    card2 = null;
    cardsFlipped = 0;
    noClicking = false;
    COLORS = [];
    ranColors();
    shuffledColors = shuffle(COLORS);
    createDivsForColors(shuffledColors);
    clock.innerText = "Current Time: 0 seconds";
    scoreBoard.innerText = "Current Score: 0 clicks";
    trackTime();
  }
})