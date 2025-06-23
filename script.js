let isCooldown = false;
let firstClickDone = false;

const getSignalBtn = document.getElementById("getSignal");
const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");
const cooldownText = document.getElementById("cooldown-text");
const progressBar = document.getElementById("progressBar");
const sound = document.getElementById("revealSound");

function generateEmptyGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }
}

function showOverlayWithCooldown() {
  overlay.style.display = "flex";
  let timeLeft = 30;
  cooldownText.textContent = `⏳ Please wait ${timeLeft} seconds...`;
  progressBar.style.width = "0%";

  const interval = setInterval(() => {
    timeLeft--;
    cooldownText.textContent = `⏳ Please wait ${timeLeft} seconds...`;
    progressBar.style.width = `${((30 - timeLeft) / 30) * 100}%`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      hideOverlay();
      revealDiamonds();
      isCooldown = false;
    }
  }, 1000);
}

function hideOverlay() {
  overlay.style.display = "none";
  progressBar.style.width = "0%";
}

function revealDiamonds() {
  const mineCount = parseInt(document.getElementById("mines").value);
  const diamondCounts = { 1: 4, 3: 3 };
  const diamondCount = diamondCounts[mineCount];
  const totalCells = 25;
  const diamondPositions = [];
  const available = Array.from({ length: totalCells }, (_, i) => i);

  while (diamondPositions.length < diamondCount) {
    const index = Math.floor(Math.random() * available.length);
    diamondPositions.push(available.splice(index, 1)[0]);
  }

  const cells = document.querySelectorAll(".grid .cell");
  cells.forEach((cell) => {
    cell.innerHTML = "";
  });

  diamondPositions.forEach((pos, i) => {
    setTimeout(() => {
      const diamond = document.createElement("div");
      diamond.classList.add("diamond");
      cells[pos].appendChild(diamond);
      sound.currentTime = 0;
      sound.play();
    }, i * 400);
  });
}

getSignalBtn.addEventListener("click", () => {
  if (isCooldown) return;

  if (!firstClickDone) {
    firstClickDone = true;
    generateEmptyGrid();
    revealDiamonds();
  } else {
    isCooldown = true;
    generateEmptyGrid();
    showOverlayWithCooldown();
  }
});

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById("clock").textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

document.addEventListener("DOMContentLoaded", () => {
  generateEmptyGrid();
});
