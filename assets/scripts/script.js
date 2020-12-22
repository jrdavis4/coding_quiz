//Assignments
var startBtnEl = document.querySelector(".startBtn");
// var cardBodyEl = document.querySelector(".card-body");
var quizContainerEl = document.querySelector(".quiz-container");
var cardTextEl = document.querySelector(".card-text");
var currentScore = 0;
var highScores = [
  {
    name: "Justin",
    score: 80
  },{
    name: "Adam",
    score: 90
  }
]
var questionList = [
  {
    question: "This is question number 1?",
    answers: ["Answer 1","Answer 2","Answer 3","Answer 4"],
    correctIndex: 0
  },{
    question: "This is question number 2?",
    answers: ["Answer 1","Answer 2","Answer 3","Answer 4","Answer 5"],
    correctIndex: 3
  }
]

//Create list of index numbers to randomize questions 
var queue = [];
for (var i = 0; i < questionList.length; i++){
  queue.push(i);
}

function init(){

  if (!localStorage.getItem("highScores")){
    return;
  } else {
    highScores = JSON.parse(localStorage.getItem("highScores"));
  }

}

function nextQuestion(){

  if (queue.length === 0){

    endQuiz();

  } else {

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
}


function clearQuiz(){

  while (quizContainerEl.firstChild){
    quizContainerEl.removeChild(quizContainerEl.firstChild);
  }
}


function endQuiz(){

  console.log(currentScore);

}


function storeGrade(){



}


quizContainerEl.addEventListener("click", function(e){

  if (e.target.matches("button")){

    if (e.target.getAttribute("data-correct") === "true"){
      currentScore += 10;
    }

    nextQuestion();
    
  }
})

startBtnEl.addEventListener("click", function (e) {
  cardTextEl.style.display = "none";
  startBtnEl.style.display = "none";
  nextQuestion();
})