/* Quiz.exe — script.js */
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

// State
let currentIndex = 0, score = 0, userAnswers = [], hasAnswered = false;

// DOM
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
const statusEl     = document.getElementById("status-text");
const finalScoreEl = document.getElementById("final-score");
const percentEl    = document.getElementById("score-percent");
const messageEl    = document.getElementById("score-message");
const resultIconEl = document.getElementById("result-icon");
const reviewListEl = document.getElementById("review-list");
const winClockEl   = document.getElementById("win-clock");
const taskbarClock = document.getElementById("taskbar-clock");

function showScreen(s) {
  [startScreen, quizScreen, resultsScreen, reviewScreen].forEach(x => x.classList.remove("active"));
  s.classList.add("active");
}

// Clock — fires on the minute boundary so it stays accurate
function updateClock() {
  const now = new Date();
  const h = now.getHours(), m = String(now.getMinutes()).padStart(2, "0");
  const label = `${(h % 12) || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
  if (winClockEl)   winClockEl.textContent   = label;
  if (taskbarClock) taskbarClock.textContent = label;
}
updateClock();
setTimeout(() => {
  updateClock();
  setInterval(updateClock, 60000);
}, (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds());

function setStatus(msg) { if (statusEl) statusEl.textContent = msg; }

function startQuiz() {
  currentIndex = 0; score = 0; userAnswers = []; hasAnswered = false;
  scoreTracker.textContent = "Score: 0";
  showScreen(quizScreen);
  loadQuestion();
  setStatus("Quiz in progress…");
}

function loadQuestion() {
  hasAnswered = false;
  nextBtn.disabled = true;
  const q = QUESTIONS[currentIndex];
  questionEl.textContent   = q.question;
  counterEl.textContent    = `Question ${currentIndex + 1} of ${QUESTIONS.length}`;
  progressFill.style.width = `${(currentIndex / QUESTIONS.length) * 100}%`;
  answersEl.innerHTML = "";
  const frag = document.createDocumentFragment();
  q.answers.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className   = "answer-btn";
    btn.textContent = `${String.fromCharCode(65 + i)}.  ${text}`;
    btn.addEventListener("click", () => selectAnswer(i));
    frag.appendChild(btn);
  });
  answersEl.appendChild(frag);
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
  if (chosen === q.correct) {
    score++;
    scoreTracker.textContent = `Score: ${score}`;
    setStatus("✔  Correct!");
  } else {
    setStatus("✘  Incorrect.");
  }
  nextBtn.disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < QUESTIONS.length) { loadQuestion(); setStatus("Quiz in progress…"); }
  else showResults();
}

function showResults() {
  progressFill.style.width = "100%";
  const pct = Math.round((score / QUESTIONS.length) * 100);

  let icon, message;
  if (pct === 100)    { icon = "🏆"; message = "Perfect score! Absolutely outstanding."; }
  else if (pct >= 80) { icon = "🌟"; message = "Great work — you really know your stuff!"; }
  else if (pct >= 60) { icon = "👍"; message = "Solid effort. A respectable performance."; }
  else if (pct >= 40) { icon = "📚"; message = "Not bad, but there is more to learn."; }
  else                { icon = "💡"; message = "Keep at it — every attempt builds knowledge."; }

  finalScoreEl.textContent = score;
  percentEl.textContent    = `${pct}%`;
  resultIconEl.textContent = icon;
  messageEl.textContent    = message;
  showScreen(resultsScreen);
  setStatus(`Quiz complete — ${score}/${QUESTIONS.length} correct (${pct}%)`);
}

function showReview() {
  const frag = document.createDocumentFragment();
  QUESTIONS.forEach((q, i) => {
    const chosen = userAnswers[i], ok = chosen === q.correct;
    const item = document.createElement("div"); item.className = "review-item";
    const qDiv = document.createElement("div"); qDiv.className = "review-q"; qDiv.textContent = `${i + 1}. ${q.question}`;
    const aDiv = document.createElement("div"); aDiv.className = "review-a";
    const tag  = document.createElement("span"); tag.className = `review-tag ${ok ? "ok" : "err"}`; tag.textContent = ok ? "✔" : "✘";
    const det  = document.createElement("div");
    det.innerHTML = ok
      ? `<span class="correct-text">✔ ${q.answers[q.correct]}</span>`
      : `Your answer: ${q.answers[chosen]}&emsp;<span class="correct-text">Correct: ${q.answers[q.correct]}</span>`;
    aDiv.appendChild(tag); aDiv.appendChild(det);
    item.appendChild(qDiv); item.appendChild(aDiv);
    frag.appendChild(item);
  });
  reviewListEl.innerHTML = "";
  reviewListEl.appendChild(frag);
  showScreen(reviewScreen);
  setStatus("Reviewing answers…");
}

startBtn.addEventListener("click",   startQuiz);
nextBtn.addEventListener("click",    nextQuestion);
restartBtn.addEventListener("click", startQuiz);
reviewBtn.addEventListener("click",  showReview);
backBtn.addEventListener("click", () => {
  showScreen(resultsScreen);
  setStatus(`Quiz complete — ${score}/${QUESTIONS.length} correct`);
});

// Window dragging
const quizWin = document.getElementById("quiz-window");
const titleBar = document.getElementById("title-bar");
let drag = null;

titleBar.addEventListener("mousedown", e => {
  if (e.target.classList.contains("title-btn")) return;
  const rect = quizWin.getBoundingClientRect();
  drag = { x: e.clientX, y: e.clientY, left: rect.left, top: rect.top };
  quizWin.style.transform = "none";
  quizWin.style.left = rect.left + "px";
  quizWin.style.top  = rect.top  + "px";
  e.preventDefault();
});

document.addEventListener("mousemove", e => {
  if (!drag) return;
  quizWin.style.left = (drag.left + e.clientX - drag.x) + "px";
  quizWin.style.top  = (drag.top  + e.clientY - drag.y) + "px";
});

document.addEventListener("mouseup", () => { drag = null; });

// Window chrome buttons
const winBody      = quizWin.querySelector(".window-body");
const winMenuBar   = quizWin.querySelector(".menu-bar");
const winStatusBar = quizWin.querySelector(".status-bar");

quizWin.querySelector(".minimize-btn").addEventListener("click", () => {
  const collapsed = winBody.style.display === "none";
  winBody.style.display      = collapsed ? "" : "none";
  winMenuBar.style.display   = collapsed ? "" : "none";
  winStatusBar.style.display = collapsed ? "" : "none";
});

quizWin.querySelector(".maximize-btn").addEventListener("click", () => {
  if (quizWin.dataset.maximized === "true") {
    quizWin.style.cssText = "";
    quizWin.dataset.maximized = "false";
  } else {
    quizWin.style.transform  = "none";
    quizWin.style.top        = "0";
    quizWin.style.left       = "0";
    quizWin.style.width      = "100vw";
    quizWin.style.maxWidth   = "100vw";
    quizWin.style.height     = "calc(100dvh - 32px)";
    quizWin.style.maxHeight  = "calc(100dvh - 32px)";
    quizWin.dataset.maximized = "true";
  }
});

quizWin.querySelector(".close-btn").addEventListener("click", () => {
  if (window.confirm("Exit Quiz.exe?")) quizWin.style.display = "none";
});

// Start menu
const startMenu  = document.getElementById("start-menu");
const taskbarBtn = document.getElementById("taskbar-start");

taskbarBtn.addEventListener("click", () => {
  const opening = !startMenu.classList.contains("is-open");
  startMenu.classList.toggle("is-open", opening);
  startMenu.setAttribute("aria-hidden", String(!opening));
  taskbarBtn.classList.toggle("is-active", opening);
});

document.addEventListener("click", e => {
  if (!startMenu.contains(e.target) && !taskbarBtn.contains(e.target)) {
    startMenu.classList.remove("is-open");
    startMenu.setAttribute("aria-hidden", "true");
    taskbarBtn.classList.remove("is-active");
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    startMenu.classList.remove("is-open");
    startMenu.setAttribute("aria-hidden", "true");
    taskbarBtn.classList.remove("is-active");
  }
});
