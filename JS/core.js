// Core Interactive Mechanics for Exam Checking

document.addEventListener("DOMContentLoaded", () => {
  const examPage = document.body.getAttribute("data-exam");
  if (!examPage) return;

  const checkBtn = document.getElementById("btn-check");
  const resetBtn = document.getElementById("btn-reset");
  const scoreDisplay = document.getElementById("score-display");

  let solutionKey = {};

  // Fetch JSON solution file dynamically based on data-exam attribute
  fetch(`../JS/solutions/${examPage}.json`)
    .then(response => {
      if (!response.ok) throw new Error("Solution file not found.");
      return response.json();
    })
    .then(data => {
      solutionKey = data;
    })
    .catch(err => console.error("Error loading solutions:", err));

  // Checking logic
  checkBtn.addEventListener("click", () => {
    let totalQuestions = 0;
    let correctCount = 0;

    const inputs = document.querySelectorAll("[data-key]");

    inputs.forEach(input => {
      const key = input.getAttribute("data-key");
      const userValue = input.value.trim().toLowerCase();
      const correctAnswers = solutionKey[key];

      if (!correctAnswers) return;

      totalQuestions++;

      // Support array of acceptable answers or single string
      const isCorrect = Array.isArray(correctAnswers) 
        ? correctAnswers.map(a => a.toLowerCase()).includes(userValue)
        : correctAnswers.toLowerCase() === userValue;

      if (isCorrect) {
        input.classList.remove("wrong");
        input.classList.add("correct");
        correctCount++;
      } else {
        input.classList.remove("correct");
        input.classList.add("wrong");
      }
    });

    // Calculate & Display Score
    if (totalQuestions > 0) {
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      scoreDisplay.textContent = `Score: ${percentage} / 100`;
      scoreDisplay.style.backgroundColor = percentage >= 70 ? "#E8F8F5" : "#FDEDEC";
      scoreDisplay.style.color = percentage >= 70 ? "#16A085" : "#C0392B";
    }
  });

  // Reset Logic
  resetBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll("[data-key]");
    inputs.forEach(input => {
      input.value = "";
      input.classList.remove("correct", "wrong");
    });
    scoreDisplay.textContent = "Score: -- / 100";
    scoreDisplay.style.backgroundColor = "#E8F8F5";
    scoreDisplay.style.color = "#16A085";
  });
});
