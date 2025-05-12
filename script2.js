const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const player = document.getElementById('player');
const step = 3.5;

let playerX = 320;
let playerY = 195;

let keysPressed = {};
let score = 0;
let timeLeft = 180;
let timerStarted = false;
let timerInterval;
let jumpscareCount = 0;
let gameEnded = false;
const maxJumpscares = 2;
const jumpscares = ["ezjump1.jpg", "ezjump2.jpg"];

function updateHiScoreDisplay() {
  const hiScore = localStorage.getItem('hiScore1') || 0;
  document.getElementById('hiScore1').textContent = `HI-SCORE: ${hiScore1}`;
}

function resetHiScore() {
  localStorage.removeItem('hiScore1');
  updateHiScoreDisplay();
}

updateHiScoreDisplay();

const mazeImage = new Image();
mazeImage.src = "maze2.png";
mazeImage.onload = () => {
  ctx.drawImage(mazeImage, 0, 0, canvas.width, canvas.height);
};

function startTimer() {
  const timerDisplay = document.getElementById('timer');
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = Time: ${timeLeft};
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("⏰ Time's up! You didn't complete the level.");
    }
  }, 1000);
}

document.addEventListener('keydown', e => {
  keysPressed[e.key.toLowerCase()] = true;
  const movementKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];
  if (!timerStarted && movementKeys.includes(e.key.toLowerCase())) {
    startTimer();
    timerStarted = true;
  }
});
document.addEventListener('keyup', e => {
  delete keysPressed[e.key.toLowerCase()];
  clearAnimation();
});

function isWalkable(x, y) {
  try {
    const pixel = ctx.getImageData(x + 36, y + 36, 1, 1).data;
    return pixel[0] < 100 && pixel[1] < 100 && pixel[2] < 100;
  } catch {
    return false;
  }
}

function movePlayer() {
  if (gameEnded) return;

  let newX = playerX;
  let newY = playerY;
  let moved = false;

  if (keysPressed['arrowup'] || keysPressed['w']) {
    newY -= step;
    setAnimation('up');
    moved = true;
  } else if (keysPressed['arrowdown'] || keysPressed['s']) {
    newY += step;
    setAnimation('down');
    moved = true;
  } else if (keysPressed['arrowleft'] || keysPressed['a']) {
    newX -= step;
    setAnimation('left');
    moved = true;
  } else if (keysPressed['arrowright'] || keysPressed['d']) {
    newX += step;
    setAnimation('right');
    moved = true;
  }

  if (moved) {
    const playerSize = 72;
    if (
      isWalkable(newX, newY) &&
      newX >= 0 &&
      newY >= 0 &&
      newX + playerSize <= canvas.width &&
      newY + playerSize <= canvas.height
    ) {
      playerX = newX;
      playerY = newY;
      player.style.transform = translate(${playerX}px, ${playerY}px);
    }
  } else {
    clearAnimation();
  }

  triggerJumpscare();
  checkWin();
}

function setAnimation(direction) {
  player.classList.remove('walk-up', 'walk-down', 'walk-left', 'walk-right');
  player.classList.add(walk-${direction});
}

function clearAnimation() {
  player.classList.remove('walk-up', 'walk-down', 'walk-left', 'walk-right');
}

function checkWin() {
  if (gameEnded) return;
  const finish = document.getElementById('finishLine').getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();
  if (
    playerRect.left < finish.right &&
    playerRect.right > finish.left &&
    playerRect.top < finish.bottom &&
    playerRect.bottom > finish.top
  ) {
    clearInterval(timerInterval);
    gameEnded = true;
    score = timeLeft * 10;
    document.getElementById('score').textContent = Score: ${score};
    document.getElementById('finalScore').textContent = Your final score: ${score};
    document.getElementById('winPopup').style.display = 'block';

    const hiScore = localStorage.getItem('hiScore') || 0;
    if (score > hiScore) {
      localStorage.setItem('hiScore', score);
    }
    updateHiScoreDisplay();
  }
}

function triggerJumpscare() {
  if (jumpscareCount >= maxJumpscares) return;
  if (Math.random() < 0.01) {
    const img = jumpscares[Math.floor(Math.random() * jumpscares.length)];
    const jumpscare = document.getElementById('jumpscare');
    jumpscare.style.backgroundImage = url('${img}');
    jumpscare.style.display = "block";
    jumpscareCount++;
    setTimeout(() => {
      jumpscare.style.display = "none";
    }, 700);
  }
}

function gameLoop() {
  movePlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
