//Assignments
var startBtn = document.querySelector(".startBtn");
var answerDiv = document.querySelector(".answers");
var cardText = document.querySelector(".card-text");

var questionList = [
  {
    question: "This is questions number 1?"
    a: "Answer 1"
    b: "Answer 2"
    c: "Answer 3"
    d: "Answer 4"
  },
  {
    question: "This is questions number 2?"
    a: "Answer 1"
    b: "Answer 2"
    c: "Answer 3"
    d: "Answer 4"
  },
  {
    question: "This is questions number 3?"
    a: "Answer 1"
    b: "Answer 2"
    c: "Answer 3"
    d: "Answer 4"
  }
]


function init(){


}

function startQuiz(){


}

function storeGrade(){


}


startBtn.addEventListener("click", function(e){
  cardText.style.display = "none";
  startBtn.style.display = "none";
  startQuiz();
})