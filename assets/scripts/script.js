//Assignments
var questionContainerEl = document.querySelector("#question-container");
var answerContainerEl = document.querySelector("#answer-container");
var modal = document.querySelector(".modal");
var startContainerEl = document.querySelector(".start-container");
var modalClose = document.querySelector(".close");
var timerEl = document.querySelector("#timer");
var resultNotificationEl = document.querySelector("#result-notification");
var currentScoreContainerEl = document.querySelector("#current-score-container");
var currentScoreSpan = document.querySelector("#current-score");
var highScoreListEl = document.querySelector(".high-score-list");
var currentScore = 0;
var secondsLeft = 60;
var end = false;
var highScores = [
  {name: "Chuck Norris", score: 175, you: false},
  {name: "Sheldon Cooper", score: 156, you: false},
  {name: "Albert Einstein", score: 150, you: false},
  {name: "Taylor Swift", score: 120, you: false},
  {name: "A Chicken", score: 57, you: false},
  {name: "Bob", score: 45, you: false},
]
var questionList = [
  {
    question: "Which character is used for variable assignment?",
    answers: ["===","=","<>","=="],
    correctIndex: 1
  },{
    question: "Inside which HTML element do we link the Javascript file?",
    answers: ["<script>","<link>","<js>","<javascript>"],
    correctIndex: 0
  },{
    question: "Javascript is the successor to Java",
    answers: ["True", "False"],
    correctIndex: 1
  },{
    question: "Which of the following is NOT a Javascript framework?",
    answers: ["Angular","React","jQuery","Bootstrap"],
    correctIndex: 3
  },{
    question: "Which function is used to remove specific elements from an array?",
    answers: ["cut()", "delete()", "splice()", "take()"],
    correctIndex: 2
  },{
    question: "Javascript variable names are case sensitive.",
    answers: ["True", "False"],
    correctIndex: 0
  },{
    question: "Javascript must be compiled into machine code before running.",
    answers: ["True", "False"],
    correctIndex: 1
  },{
    question: "_____ is the keyword used to reference the current object.",
    answers: ["my", "current", "this", "now"],
    correctIndex: 2
  },{
    question: "Javascript is primarily a markup language used to style web elements.",
    answers: ["True", "False"],
    correctIndex: 1
  },{
    question: "A variable defined within a function has a _____ scope.",
    answers: ["Global", "Linear", "Complex", "Local"],
    correctIndex: 3
  },{
    question: "Javascript has the ability to convert data types automatically when needed. This is known as type _____.",
    answers: ["Coersion","Conversion","Convincing","Changing"],
    correctIndex: 0
  },{
    question: "What is the difference between == and === in Javascript?",
    answers: ["=== is not valid", "== ignores capitalization", "=== ignores null and NaN values", "== disregards data type"],
    correctIndex: 3
  },{
    question: "HTML stands for Hypertext _____ language.",
    answers: ["Mirroring", "Minimized", "Markup", "Multipurpose"],
    correctIndex: 2
  },{
    question: "If an event listener is triggered within a child div, the parent div handler occurs as well. This is known as event _____.",
    answers: ["Recursion", "Repeating", "Bubbling", "Delegation"],
    correctIndex: 2
  },{
    question: "Which of the following is NOT a data type in Javascript?",
    answers: ["Number", "Int", "String", "Object"],
    correctIndex: 1
  }
]

//Create list of index numbers to pull from randomly 
var queue = [];
for (var i = 0; i < questionList.length; i++){
  queue.push(i);
}

//Create audio elements
var song = document.createElement("audio");
song.setAttribute("src", "assets/audio/finalCountdown.mp3");
song.volume = .2;

var goodLuck = document.createElement("audio");
goodLuck.setAttribute("src", "assets/audio/goodLuck.mp3")
goodLuck.volume = .3;

var youllNeedIt = document.createElement("audio");
youllNeedIt.setAttribute("src", "assets/audio/youllNeedIt.mp3");
youllNeedIt.volume = .3;

var tenSeconds = document.createElement("audio");
tenSeconds.setAttribute("src", "assets/audio/tenSeconds.mp3");
tenSeconds.volume = .3;

var cheer = document.createElement("audio");
cheer.setAttribute("src", "assets/audio/cheer.mp3");
cheer.volume = .3;

var woo = document.createElement("audio");
woo.setAttribute("src", "assets/audio/woo.mp3");
woo.volume = .3;

var yeah = document.createElement("audio");
yeah.setAttribute("src", "assets/audio/yeah.mp3");
yeah.volume = .3;

var uggh = document.createElement("audio");
uggh.setAttribute("src", "assets/audio/uggh.mp3");
uggh.volume = .3;

var umm = document.createElement("audio");
umm.setAttribute("src", "assets/audio/umm.mp3");
umm.volume = .3;

var correctSounds = [woo, yeah];
var incorrectSounds = [uggh, umm];


function init(){
  //Load saved scored if any
  if (localStorage.getItem("highScores")){
      highScores = JSON.parse(localStorage.getItem("highScores"));
    }

  updateHighScores();

  timerEl.textContent = secondsLeft;

  //Show previous high score
  var record = "None";
  highScores.forEach(function(item) {
    if (item.you === true) {
      record = item.score;
    }
  })
  currentScoreSpan.textContent = "Your personal best: " + record;
}

function startQuiz() {
  startContainerEl.style.display = "none";
  clearQuiz();
  // cardTextEl.style.display = "none";
  // startBtnEl.style.display = "none";

  goodLuck.play();
  goodLuck.onended = function() {
    youllNeedIt.play();
    youllNeedIt.onended = function() {
      song.load();
      song.play();
    }
  }
  setTime();
  nextQuestion();
}

function nextQuestion(){
  clearQuiz();

  //Get random question and remove it from queue
  var randIndex = queue[Math.floor(Math.random() * queue.length)]
  var randQuestion = questionList[randIndex];
  queue.splice(queue.indexOf(randIndex), 1);

  //Create question element and append
  var questionEl = document.createElement("h4");
  questionEl.setAttribute("class", "question");
  questionEl.innerHTML = questionList[randIndex].question;
  questionContainerEl.appendChild(questionEl);

  //Loop through all answers to create and append
  for (var i = 0; i < questionList[randIndex].answers.length; i++){
    var answerEl = document.createElement("button");
    answerEl.setAttribute("class", "answerBtn");

    //Set data-correct to true if index matches the correct answer
    if (randQuestion.correctIndex === i){
      answerEl.setAttribute("data-correct", true);
    } else {
      answerEl.setAttribute("data-correct", false);
    }

    answerEl.textContent = questionList[randIndex].answers[i];
    answerContainerEl.appendChild(answerEl);

  }
  //Display current score at bottom
  currentScoreSpan.textContent = "Score: " + currentScore;
}

function answerCheck(event) {
  //If correct answer chosen
  if (event.target.getAttribute("data-correct") === "true"){
    currentScore += 10;
    var randSound = Math.floor(Math.random() * correctSounds.length);
    correctSounds[randSound].play();
    resultNotification(true);
    // if incorrect answer chosen
  } else {
    var randSound = Math.floor(Math.random() * incorrectSounds.length);
    incorrectSounds[randSound].play();
    if (secondsLeft <= 5) {
      secondsLeft = 0;
      end = true;
    } else {
      secondsLeft -= 5;
    }
    timerEl.textContent = secondsLeft;
    flickerTimer();

    resultNotification(false);
  }
  
  if (queue.length === 0){
    end = true;
  }
  if (!end) {
    nextQuestion();
  }
  if (end) {
    endQuiz();
  }
  
}

function endQuiz() {
  //Bonus points for time remaining
  currentScore += secondsLeft;

  //Display current score at bottom
  currentScoreSpan.textContent = "Score: " + currentScore;
  
  //Stop the timer
  secondsLeft = 0;
  timerEl.textContent = secondsLeft;

  //Stop song
  song.pause();
  cheer.play();

  clearQuiz();

  //Show score
  var score = document.createElement("h1");
  var span = document.createElement("span");
  score.textContent = "Final Score: ";
  span.textContent = currentScore;
  span.setAttribute("id", "final-score");
  questionContainerEl.appendChild(score);
  score.appendChild(span);

  //Get initials for high score
  var label = document.createElement("h4");
  label.textContent = "Enter your name:";
  questionContainerEl.appendChild(label);
  

  var form = document.createElement("form");
  questionContainerEl.appendChild(form);

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", "name");
  input.setAttribute("autofocus", true);
  form.appendChild(input);

  currentScoreSpan.textContent = "";
}

function submitName (event){
  event.preventDefault();
  var name = document.querySelector("#name").value;
  var skip = false;

  //Update score and resort if same name AND better score. Do nothing if lower score
  highScores.forEach(function(item) {
    if (item.name === name && currentScore > item.score) {
      item.score = currentScore;
      highScores.sort(function(a,b){
        return (b.score - a.score);
      })
      skip = true;
      item.you = true;
    } else if (item.name === name && currentScore <= item.score) {
      skip = true;
      item.you = true;
    }
  })

  if (!skip) {
    //Set each you property to false to ensure only one "you" exists after push
    highScores.forEach(function(item) {
      item.you = false;
    })

    //Push results into the highScores array, sort based on score, and remove the lowest
    highScores.push({name: name, score: currentScore, you: true});
    highScores.sort(function(a,b){
      return (b.score - a.score);
    })
    highScores.splice(highScores.length - 1, 1)
  }
  
  updateHighScores();
  clearQuiz();

  //Display scores and replay button

  var high = document.createElement("h3");
  high.textContent = "High Scores";
  high.setAttribute("class", "high-score-header");
  questionContainerEl.appendChild(high);

  highScores.forEach(function(item, i) {
    var p = document.createElement("p")
    p.setAttribute("class", "high-score-name");
    p.style.borderBottom = "1px solid white";
    //Highligh player score in list
    if (item.you) {
      p.setAttribute("class", "you high-score-name");
    }
    p.innerHTML = (i + 1) + ". " + item.name + ": " + "<span class='score'>" + item.score + "</span>";

    if (this.you) {
      p.style.backgroundColor = "white";
    }
    questionContainerEl.appendChild(p);
  })

  var replay = document.createElement("button");
  replay.setAttribute("class", "btn btn-primary border");
  replay.setAttribute("id", "replay-button");
  replay.textContent = "Play Again";
  questionContainerEl.appendChild(replay);
}

function updateHighScores() {
  //Clear current scores by removing all elements
  while (highScoreListEl.children[0]){
    highScoreListEl.removeChild(highScoreListEl.children[0]);
  }
  //Update scores in modal
  highScores.forEach(function(item, i) {
    var p = document.createElement("p")
    p.setAttribute("class", "high-score-name");
    p.style.borderBottom = "1px solid white";
    //Highligh player score in list
    if (item.you) {
      p.setAttribute("class", "you high-score-name");
    }
    p.innerHTML = (i + 1) + ". " + item.name + ": " + "<span class='score'>" + item.score + "</span>";
    highScoreListEl.appendChild(p);
  })

  //Store highScores into local storage
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function replay(event) {
  //Reset queue
  for (var i = 0; i < questionList.length; i++){
    queue.push(i);
  }

  //Reset variables
  currentScore = 0;
  secondsLeft = 60;
  end = false;

  clearQuiz();
  startContainerEl.style.display = "block";
  init();
}

function clearQuiz(){
  //Clear quiz area
  while (questionContainerEl.lastElementChild){
    questionContainerEl.removeChild(questionContainerEl.lastElementChild);
  }
  while (answerContainerEl.lastElementChild){
    answerContainerEl.removeChild(answerContainerEl.lastElementChild);
  }
}

function flickerTimer() {
  timerEl.style.backgroundColor = "red";
  setTimeout(function() {
    timerEl.style.backgroundColor = "";
  }, 500)
}

function resultNotification(result) {
  currentScoreContainerEl.style.display = "none";
  resultNotificationEl.style.display = "block";

  if (result) {
    resultNotificationEl.textContent = "CORRECT!";
    resultNotificationEl.setAttribute("class", "correct");
  } else {
    resultNotificationEl.textContent = "WRONG!"
    resultNotificationEl.setAttribute("class", "wrong");
  }
  setTimeout(function() {
    timerEl.style.backgroundColor = "";
    currentScoreContainerEl.style.display = "block";
    resultNotificationEl.style.display = "none";
  }, 1000)
}

function setTime() {
  var warning = false;
  var timerInterval = setInterval(function() {

    if (end) {
      clearInterval(timerInterval);
    } else {
      secondsLeft--;
      timerEl.textContent = secondsLeft;

      if (secondsLeft <= 10 && !warning) {
        tenSeconds.play();
        warning = true;
      }
      if (secondsLeft <= 0) {
        secondsLeft = 0;
        timerEl.textContent = secondsLeft;
        clearInterval(timerInterval);
        endQuiz();
      }
    }
  }, 1000);
}

function resetScores(event) {
  highScores = [
    {name: "Chuck Norris", score: 175, you: false},
    {name: "Sheldon Cooper", score: 156, you: false},
    {name: "Albert Einstein", score: 150, you: false},
    {name: "Taylor Swift", score: 120, you: false},
    {name: "A Chicken", score: 57, you: false},
    {name: "Bob", score: 45, you: false},
  ]

  currentScoreSpan.textContent = "Your personal best: None";

  updateHighScores();
}

//Event listeners
window.addEventListener("click", function(event) {
  var target = event.target.id;
  
  if (target === "start-button") {
    startQuiz();
  } else if (target === "reset-button") {
    resetScores();
  } else if (target === "replay-button") {
    replay();
  } else if (target === "close-button") {
    modal.style.display = "none";
  } else if (target === "high-score-button") {
    modal.style.display = "block";
  } else if (event.target === modal) {
    modal.style.display = "none";
  } else if (event.target.parentElement === answerContainerEl) {
    answerCheck(event);
  }
})

questionContainerEl.addEventListener("submit", submitName);


init();