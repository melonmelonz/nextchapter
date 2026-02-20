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

document.getElementById("start-btn").addEventListener("click", () => {
  alert("todo: quiz logic");
});
