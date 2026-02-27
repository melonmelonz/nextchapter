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

function updateClock() {
  const now = new Date();
  const h = now.getHours(), m = String(now.getMinutes()).padStart(2, "0");
  const label = `${(h % 12) || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
  if (winClockEl)   winClockEl.textContent   = label;
  if (taskbarClock) taskbarClock.textContent = label;
}
(function scheduleClock() {
  updateClock();
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => { updateClock(); setInterval(updateClock, 60000); }, msToNextMinute);
})();

function setStatus(msg) { if (statusEl) statusEl.textContent = msg; }

function startQuiz() {
  currentIndex = 0; score = 0; userAnswers = []; hasAnswered = false;
  scoreTracker.textContent = "Score: 0";
  showScreen(quizScreen);
  loadQuestion();
  setStatus("Quiz in progress\u2026");
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
  if (chosen === q.correct) { score++; scoreTracker.textContent = `Score: ${score}`; setStatus("\u2714  Correct!"); }
  else { setStatus("\u2718  Incorrect."); }
  nextBtn.disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < QUESTIONS.length) { loadQuestion(); setStatus("Quiz in progress\u2026"); }
  else showResults();
}

function showResults() {
  progressFill.style.width = "100%";
  const pct = Math.round((score / QUESTIONS.length) * 100);
  const map = [[100,"🏆","Perfect score! Absolutely outstanding."],[80,"🌟","Great work — you really know your stuff!"],[60,"👍","Solid effort. A respectable performance."],[40,"📚","Not bad, but there is more to learn."],[0,"💡","Keep at it — every attempt builds knowledge."]];
  const [,icon,message] = map.find(([t]) => pct >= t);
  finalScoreEl.textContent = score;
  percentEl.textContent    = `${pct}%`;
  resultIconEl.textContent = icon;
  messageEl.textContent    = message;
  showScreen(resultsScreen);
  setStatus(`Quiz complete \u2014 ${score}/${QUESTIONS.length} correct (${pct}%)`);
}

function showReview() {
  const frag = document.createDocumentFragment();
  QUESTIONS.forEach((q, i) => {
    const chosen = userAnswers[i], ok = chosen === q.correct;
    const item = document.createElement("div"); item.className = "review-item";
    const qDiv = document.createElement("div"); qDiv.className = "review-q"; qDiv.textContent = `${i + 1}. ${q.question}`;
    const aDiv = document.createElement("div"); aDiv.className = "review-a";
    const tag  = document.createElement("span"); tag.className = `review-tag ${ok ? "ok" : "err"}`; tag.textContent = ok ? "\u2714" : "\u2718";
    const det  = document.createElement("div");
    det.innerHTML = ok ? `<span class="correct-text">\u2714 ${q.answers[q.correct]}</span>` : `Your answer: ${q.answers[chosen]}&emsp;<span class="correct-text">Correct: ${q.answers[q.correct]}</span>`;
    aDiv.appendChild(tag); aDiv.appendChild(det);
    item.appendChild(qDiv); item.appendChild(aDiv);
    frag.appendChild(item);
  });
  reviewListEl.innerHTML = "";
  reviewListEl.appendChild(frag);
  showScreen(reviewScreen);
  setStatus("Reviewing answers\u2026");
}

startBtn.addEventListener("click",   startQuiz);
nextBtn.addEventListener("click",    nextQuestion);
restartBtn.addEventListener("click", startQuiz);
reviewBtn.addEventListener("click",  showReview);
backBtn.addEventListener("click", () => { showScreen(resultsScreen); setStatus(`Quiz complete \u2014 ${score}/${QUESTIONS.length} correct`); });

// ---------- Window Dragging ----------
(function initDragging() {
  const win = document.getElementById("quiz-window");
  const titleBar = document.getElementById("title-bar");
  let startX, startY, originLeft, originTop;

  function onDragMove(e) {
    win.style.left = `${originLeft + (e.clientX - startX)}px`;
    win.style.top  = `${originTop  + (e.clientY - startY)}px`;
  }

  function onDragEnd() {
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup",   onDragEnd);
  }

  titleBar.addEventListener("mousedown", e => {
    if (e.target.classList.contains("title-btn")) return;
    const rect = win.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    originLeft = rect.left; originTop = rect.top;
    win.style.transform = "none";
    win.style.left = `${originLeft}px`;
    win.style.top  = `${originTop}px`;
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup",   onDragEnd);
    e.preventDefault();
  });
})();

// ---------- Window Chrome Buttons ----------
(function initWindowButtons() {
  const win       = document.getElementById("quiz-window");
  const body      = win.querySelector(".window-body");
  const menuBar   = win.querySelector(".menu-bar");
  const statusBar = win.querySelector(".status-bar");

  win.querySelector(".minimize-btn").addEventListener("click", () => {
    const collapsed = body.style.display === "none";
    body.style.display      = collapsed ? "" : "none";
    menuBar.style.display   = collapsed ? "" : "none";
    statusBar.style.display = collapsed ? "" : "none";
  });

  win.querySelector(".maximize-btn").addEventListener("click", () => {
    if (win.dataset.maximized === "true") {
      win.style.cssText = ""; win.dataset.maximized = "false";
    } else {
      win.style.transform = "none"; win.style.top = "0"; win.style.left = "0";
      win.style.width = "100vw"; win.style.maxWidth = "100vw";
      win.style.height = "calc(100dvh - 32px)"; win.style.maxHeight = "calc(100dvh - 32px)";
      win.dataset.maximized = "true";
    }
  });

  win.querySelector(".close-btn").addEventListener("click", () => {
    if (window.confirm("Exit Quiz.exe?")) win.style.display = "none";
  });
})();

// ---------- Start Menu ----------
(function initStartMenu() {
  const menu     = document.getElementById("start-menu");
  const startBtn = document.getElementById("taskbar-start");

  function openMenu()   { menu.classList.add("is-open");    menu.setAttribute("aria-hidden", "false"); startBtn.classList.add("is-active"); }
  function closeMenu()  { menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true");  startBtn.classList.remove("is-active"); }
  function toggleMenu() { menu.classList.contains("is-open") ? closeMenu() : openMenu(); }

  startBtn.addEventListener("click", toggleMenu);
  document.addEventListener("click", e => { if (!menu.contains(e.target) && !startBtn.contains(e.target)) closeMenu(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
})();
