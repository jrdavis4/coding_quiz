//Assignments
var startBtnEl = document.querySelector(".startBtn");
var quizContainerEl = document.querySelector(".quiz-container");
var cardTextEl = document.querySelector(".card-text");
var modal = document.querySelector("#modal");
var modalContent = document.querySelector("#modal-content");
var modalBtn = document.querySelector("#highScores");
var modalSpan = document.querySelector("#close");
var timerEl = document.querySelector("#timer");
var end = false;
var currentScore = 0;
var secondsLeft = 20;
var highScores = [
  {name: "Albert Einstein", score: 80, human: false},
  {name: "Sheldon Cooper", score: 90, human: false},
  {name: "Chuck Norris", score: 85, human: false},
  {name: "A Chicken", score: 15, human: false},
  {name: "Arianna Grande", score: 60, human: false},
  {name: "Alper", score: 83, human: false}
]

var questionList = [
  {
    question: "Which character is used for variable assignment?",
    answers: ["===","=","<>","=="],
    correctIndex: 1
  },{
    question: "This is question number 2?",
    answers: ["Answer 1","Answer 2","Answer 3","Answer 4","Answer 5"],
    correctIndex: 3
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
song.volume = .1;

var goodLuck = document.createElement("audio");
goodLuck.setAttribute("src", "assets/audio/goodLuck.mp3")
goodLuck.volume = .3;

var youllNeedIt = document.createElement("audio");
youllNeedIt.setAttribute("src", "assets/audio/youllNeedIt.mp3");
youllNeedIt.volume = .3;

var tenSeconds = document.createElement("audio");
tenSeconds.setAttribute("src", "assets/audio/tenSeconds.mp3");
tenSeconds.volume = .3;

var totalCarnage = document.createElement("audio");
totalCarnage.setAttribute("src", "assets/audio/totalCarnage.mp3");
totalCarnage.volume = .3;

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

  if (!localStorage.getItem("highScores")){
    console.log("yes");
    return;
  } else {
    highScores = JSON.parse(localStorage.getItem("highScores"));
  }
  updateHighScores();
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
  quizContainerEl.appendChild(questionEl);

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

    answerEl.innerHTML = questionList[randIndex].answers[i];
    quizContainerEl.appendChild(answerEl);

  }
}


function clearQuiz(){
  //Clear quiz area
  while (quizContainerEl.firstChild){
    quizContainerEl.removeChild(quizContainerEl.firstChild);
  }
}


function answerCheck(event) {
  if (event.target.matches("button")){

    //If correct answer chosen
    if (event.target.getAttribute("data-correct") === "true"){
      currentScore += 10;
      var randSound = Math.floor(Math.random() * correctSounds.length);
      correctSounds[randSound].play();
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
}


function startQuiz() {
  cardTextEl.style.display = "none";
  startBtnEl.style.display = "none";

  goodLuck.play();
  goodLuck.onended = function() {
    youllNeedIt.play();
    youllNeedIt.onended = function() {
      song.play();
    }
  }
  setTime();
  nextQuestion();
}


function endQuiz() {
  //Bonus points for time remaining
  currentScore += secondsLeft;
  
  //Stop the timer
  secondsLeft = 0;
  timerEl.textContent = secondsLeft;

  //Stop song
  song.pause();
  totalCarnage.play();

  clearQuiz();

  //Get initials for high score
  var label = document.createElement("h4");
  label.textContent = "Enter your name:";
  quizContainerEl.appendChild(label);

  var form = document.createElement("form");
  quizContainerEl.appendChild(form);

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", "name");
  form.appendChild(input);
}


function submitName (event){
  event.preventDefault();
  var name = document.querySelector("#name").value;

  //Insert into the highScores array, sort based on score, and remove the lowest
  highScores.push({name: name, score: currentScore, human: true});
  highScores.sort(function(a,b){
    return (b.score - a.score);
  })
  highScores.splice(highScores.length - 1, 1);

  updateHighScores();
  
}


function updateHighScores() {
  //Clear current scores by removing all elements except the first (close button)
  while (modalContent.children[1]){
    modalContent.removeChild(modalContent.children[1]);
  }

  //Update scores in modal
  highScores.forEach(function(item, i) {
    var p = document.createElement("p")
    p.innerHTML = (i + 1) + ".   " + item.name + "<span class='score'>" + "   " + item.score + "</span>";
    modalContent.appendChild(p);
  })

  //Store highScores into local storage
  localStorage.setItem("highScores", JSON.stringify(highScores));
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


//Event listeners
quizContainerEl.addEventListener("click", answerCheck)

startBtnEl.addEventListener("click", startQuiz);

quizContainerEl.addEventListener("submit", submitName);

modalBtn.onclick = function() {
  modal.style.display = "block";
}

modalSpan.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


init();