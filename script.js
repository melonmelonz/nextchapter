"use strict";

const QUESTIONS = [
  { question: "Which planet in our solar system has the most moons?",
    answers: ["Jupiter", "Saturn", "Uranus", "Neptune"], correct: 1 },
  { question: "What element has the chemical symbol 'Au'?",
    answers: ["Silver", "Platinum", "Gold", "Copper"], correct: 2 },
  { question: "How many bones are in the average adult human body?",
    answers: ["198", "206", "215", "224"], correct: 1 },
  { question: "Which ocean is the largest by surface area?",
    answers: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { question: "What gas do plants primarily absorb during photosynthesis?",
    answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
  { question: "How many keys does a standard concert piano have?",
    answers: ["72", "76", "84", "88"], correct: 3 },
  { question: "Which country is home to the Great Barrier Reef?",
    answers: ["Brazil", "Philippines", "Australia", "Indonesia"], correct: 2 },
  { question: "What is the hardest natural mineral on the Mohs scale?",
    answers: ["Quartz", "Topaz", "Corundum", "Diamond"], correct: 3 },
  { question: "In which year did the World Wide Web become publicly available?",
    answers: ["1989", "1991", "1993", "1995"], correct: 1 },
  { question: "How many faces does a regular icosahedron have?",
    answers: ["12", "16", "20", "24"], correct: 2 }
];

let currentIndex = 0, score = 0, userAnswers = [], hasAnswered = false;

const startScreen   = document.getElementById("start-screen");
const quizScreen    = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const reviewScreen  = document.getElementById("review-screen");
const startBtn   = document.getElementById("start-btn");
const nextBtn    = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const reviewBtn  = document.getElementById("review-btn");
const backBtn    = document.getElementById("back-btn");
const questionEl   = document.getElementById("question-text");
const counterEl    = document.getElementById("question-counter");
const progressFill = document.getElementById("progress-fill");
const answersEl    = document.getElementById("answers-container");
const scoreTracker = document.getElementById("score-tracker");
const finalScoreEl = document.getElementById("final-score");
const percentEl    = document.getElementById("score-percent");
const messageEl    = document.getElementById("score-message");
const resultIconEl = document.getElementById("result-icon");
const reviewListEl = document.getElementById("review-list");

function showScreen(s) {
  [startScreen, quizScreen, resultsScreen, reviewScreen].forEach(x => x.classList.remove("active"));
  s.classList.add("active");
}

function startQuiz() {
  currentIndex = 0; score = 0; userAnswers = []; hasAnswered = false;
  scoreTracker.textContent = "Score: 0";
  showScreen(quizScreen);
  loadQuestion();
}

function loadQuestion() {
  hasAnswered = false;
  nextBtn.disabled = true;
  const q = QUESTIONS[currentIndex];
  questionEl.textContent = q.question;
  counterEl.textContent = `Question ${currentIndex + 1} of ${QUESTIONS.length}`;
  progressFill.style.width = `${(currentIndex / QUESTIONS.length) * 100}%`;
  answersEl.innerHTML = "";
  q.answers.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = `${String.fromCharCode(65 + i)}.  ${text}`;
    btn.addEventListener("click", () => selectAnswer(i));
    answersEl.appendChild(btn);
  });
}

function selectAnswer(chosen) {
  if (hasAnswered) return;
  hasAnswered = true;
  const q = QUESTIONS[currentIndex];
  userAnswers.push(chosen);
  answersEl.querySelectorAll(".answer-btn").forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("is-correct");
    else if (i === chosen) btn.classList.add("is-wrong");
  });
  if (chosen === q.correct) score++;
  nextBtn.disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < QUESTIONS.length) loadQuestion();
  else showResults();
}

function showResults() {
  progressFill.style.width = "100%";
  const pct = Math.round((score / QUESTIONS.length) * 100);
  const map = [[100,"🏆","Perfect score! Absolutely outstanding."],[80,"🌟","Great work — you really know your stuff!"],[60,"👍","Solid effort. A respectable performance."],[40,"📚","Not bad, but there is more to learn."],[0,"💡","Keep at it — every attempt builds knowledge."]];
  const [,icon,message] = map.find(([t]) => pct >= t);
  finalScoreEl.textContent = score;
  percentEl.textContent = `${pct}%`;
  resultIconEl.textContent = icon;
  messageEl.textContent = message;
  showScreen(resultsScreen);
}

function showReview() {
  reviewListEl.innerHTML = "";
  QUESTIONS.forEach((q, i) => {
    const chosen = userAnswers[i], ok = chosen === q.correct;
    const item = document.createElement("div"); item.className = "review-item";
    const qDiv = document.createElement("div"); qDiv.className = "review-q"; qDiv.textContent = `${i + 1}. ${q.question}`;
    const aDiv = document.createElement("div"); aDiv.className = "review-a";
    const tag = document.createElement("span"); tag.className = `review-tag ${ok ? "ok" : "err"}`; tag.textContent = ok ? "\u2714" : "\u2718";
    const det = document.createElement("div");
    det.innerHTML = ok ? `<span class="correct-text">\u2714 ${q.answers[q.correct]}</span>` : `Your answer: ${q.answers[chosen]}&emsp;<span class="correct-text">Correct: ${q.answers[q.correct]}</span>`;
    aDiv.appendChild(tag); aDiv.appendChild(det);
    item.appendChild(qDiv); item.appendChild(aDiv);
    reviewListEl.appendChild(item);
  });
  showScreen(reviewScreen);
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);
reviewBtn.addEventListener("click", showReview);
backBtn.addEventListener("click", () => showScreen(resultsScreen));

function updateClock() {
  const now = new Date();
  const h = now.getHours(), m = String(now.getMinutes()).padStart(2, "0");
  const label = `${(h % 12) || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
  const tc = document.getElementById("taskbar-clock"); if (tc) tc.textContent = label;
  const wc = document.getElementById("win-clock"); if (wc) wc.textContent = label;
}
(function scheduleClock() {
  updateClock();
  const now = new Date();
  setTimeout(() => { updateClock(); setInterval(updateClock, 60000); }, (60 - now.getSeconds()) * 1000 - now.getMilliseconds());
})();
