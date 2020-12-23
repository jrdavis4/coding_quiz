//Assignments
var startBtnEl = document.querySelector(".startBtn");
var quizContainerEl = document.querySelector(".quiz-container");
var cardTextEl = document.querySelector(".card-text");
var currentScore = 0;
var highScores = [
  {name: "Justin", score: 80},
  {name: "Adam", score: 90},
  {name: "Ashley", score: 85}
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

//Create list of index numbers to pull from randomly (later) 
var queue = [];
for (var i = 0; i < questionList.length; i++){
  queue.push(i);
}

function init(){

  if (!localStorage.getItem("highScores")){
    console.log("yes");
    return;
  } else {
    highScores = JSON.parse(localStorage.getItem("highScores"));
  }

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


function endQuiz(){

  //Get initials for high score
  var x = "test"

  //Insert into the highScores array, sort based on score, and remove the lowest
  highScores.push({name: x, score: currentScore});
  highScores.sort(function(a,b){
    return (b.score - a.score);
  })
  highScores.splice(highScores.length - 1, 1);

  //Store highScores into local storage
  localStorage.setItem("highScores", JSON.stringify(highScores));

}


quizContainerEl.addEventListener("click", function(e){
  if (e.target.matches("button")){
    if (e.target.getAttribute("data-correct") === "true"){
      currentScore += 100;
    }

    if (queue.length === 0){
      endQuiz();
    } else {
      nextQuestion();
    }
  }
})

startBtnEl.addEventListener("click", function (e) {
  cardTextEl.style.display = "none";
  startBtnEl.style.display = "none";
  init();
  nextQuestion();
})