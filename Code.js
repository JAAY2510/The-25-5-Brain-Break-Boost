// Pomodoro Timer Variables
const workDuration = 25; // 25 minutes of work
const breakDuration = 5; // 5 minutes of break

// Get references to HTML elements (Pomodoro)
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workBreakIndicator = document.getElementById('work-break');

// Tic-Tac-Toe Variables
const gameBoard = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const restartButtonTicTacToe = document.getElementById('restart-tic-tac-toe');

let timerInterval;
let remainingTime;
let isWorking = true; // Flag to track work/break state
let currentPlayer = 'X';
let gameIsOver = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Pomodoro Timer Functions
function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = ('0' + (remainingTime % 60)).slice(-2);
  timerDisplay.textContent = `<span class="math-inline">\{minutes\}\:</span>{seconds}`;
}

function startTimer() {
  if (timerInterval) {
    return; // Timer is already running
  }

  const duration = isWorking ? workDuration : breakDuration;
  remainingTime = duration * 60; // Convert minutes to seconds

  updateTimerDisplay();

  timerInterval = setInterval(() => {
    remainingTime--;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;

      // Toggle work/break state
      isWorking = !isWorking;

      // Update work/break indicator
      workBreakIndicator.textContent = isWorking ? 'Work' : 'Break';

      if (!isWorking) { // Start Tic-Tac-Toe during break
        gameBoard.style.display = 'block'; // Show game board
        result.textContent = ''; // Clear previous result
        cells.forEach((cell) => (cell.textContent = '')); // Clear board
        gameIsOver = false; // Reset game state
      } else {
        gameBoard.style.display = 'none'; // Hide game board
      }

      // Start the next interval
      startTimer();
    } else {
      updateTimerDisplay();
    }
  }, 1000); // Update every second
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingTime = 0;
  updateTimerDisplay();
  isWorking = true; // Reset to work mode
  workBreakIndicator.textContent = 'Work';
  gameBoard.style.display = 'none'; // Hide game board during work
}

// Tic-Tac-Toe Functions
function handleCellClick(e) {
  if (!isWorking) { // Allow clicks only during break
    const cellIndex = Array.from(cells).indexOf(e.target);

    if (gameIsOver || cells[cellIndex].textContent !== '') {
      return;
    }

    cells[cellIndex].textContent = currentPlayer;

    if (checkWin()) {
      result.textContent = `${currentPlayer} wins!`;
      gameIsOver = true;
    } else if (checkDraw()) {
      result.textContent = "It's a draw!";
      gameIsOver = true;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }
}

function checkWin() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
