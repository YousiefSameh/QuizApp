// Select Elements
const countSpan = document.querySelector(".quiz-info .count span");
const bulletsSpanContainer = document.querySelector(".bullets .spans");
const quizArea = document.querySelector(".quiz-area");
const answersArea = document.querySelector(".answers-area");
const submitBtn = document.querySelector(".submit-button");
const bullets = document.querySelector(".bullets");
const theResultsContainer = document.querySelector(".results");
const countdownContainer = document.querySelector(".countdown");

// Set Settings
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {
      let questionsObject = JSON.parse(this.responseText);
      // Shuffle the questions array
      questionsObject = questionsObject.sort(() => Math.random() - 0.5);
      // Select only the first 10 questions
      let selectedQuestions = questionsObject.slice(0, 10);
      let qCount = selectedQuestions.length;
      createBullets(qCount);
      // Add Data
      addData(selectedQuestions[currentIndex], qCount);
      // Click On Submit
      submitBtn.onclick = () => {
        // Get Right Answer
        let theRightAnswer = selectedQuestions[currentIndex].right_answer;
        // Increase Index
        currentIndex++;
        // Check The Answer
        checkAnswer(theRightAnswer, qCount);
        // Remove Previous Question
        quizArea.innerHTML = ``;
        // Remove Previous Answers
        answersArea.innerHTML = ``;
        // Add New Questions
        addData(selectedQuestions[currentIndex], qCount);
        // Handle Bullets Class
        handleBullets();
        // Start Countdown
        clearInterval(countdownInterval);
        countdown(10, qCount);
        // Show Results
        showResults(qCount);
      }
    }
  }
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}


getQuestions()

function createBullets(num) {
  countSpan.innerHTML = num;
  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Span
    let theBullet = document.createElement("span");
    // Check If It's First Span
    if (i === 0) {
      theBullet.className = "on";
    }
    // Append Bullets To Main Bullets Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function rAnswer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addData(obj, count) {
  if (currentIndex < count) {
    // Create h2 Question Title
    let qTitle = document.createElement("h2");
    // Create Question Text
    let qText = document.createTextNode(obj.title);
    // Append Text To The Title
    qTitle.appendChild(qText);
    // Append The Title To The Quiz Area
    quizArea.appendChild(qTitle);

    // Create an array of answers
    let answers = [];
    for (let i = 1; i <= 4; i++) {
      answers.push({
        text: obj[`answer_${i}`],
        id: `answer_${i}`,
        isCorrect: obj[`right_answer`] === obj[`answer_${i}`]
      });
    }

    // Shuffle the answers array
    answers = answers.sort(() => Math.random() - 0.5);

    // Create The Answers
    for (let i = 0; i < answers.length; i++) {
      // Create Main Answer Div
      let mainDivAnswer = document.createElement("div");
      // Add Class To Main Div
      mainDivAnswer.className = "answer";
      // Create Radio Input
      let radioInput = document.createElement("input");
      radioInput.name = "answers";
      radioInput.type = "radio";
      radioInput.id = answers[i].id;
      radioInput.dataset.answer = answers[i].text;
      // Make First Option Checked
      if (i === 0) {
        radioInput.checked = true;
      }
      // Create Label
      let theLabel = document.createElement("label");
      theLabel.htmlFor = answers[i].id;
      // Create Label Text
      let theLabelText = document.createTextNode(answers[i].text);
      // Add Text To The Label
      theLabel.appendChild(theLabelText);
      // Append Input + Label To Main Div
      mainDivAnswer.appendChild(radioInput);
      mainDivAnswer.appendChild(theLabel);
      // Append All Divs To Answers Area
      answersArea.appendChild(mainDivAnswer);
    }
  }
}


function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("answers");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpan);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  })
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    removeAllData();
    if (rightAnswers > (count / 2) && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Right`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    theResultsContainer.innerHTML = theResults;
    theResultsContainer.className = "results active";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownContainer.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}

function removeAllData() {
  quizArea.remove()
  answersArea.remove();
  submitBtn.remove();
  bullets.remove();
}