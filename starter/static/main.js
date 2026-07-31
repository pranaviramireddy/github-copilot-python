// Client-side rendering and interaction for the Flask-backed Sudoku
const SIZE = 9;
const LEADERBOARD_STORAGE_KEY = 'sudoku-leaderboard';
const THEME_STORAGE_KEY = 'sudoku-theme';
let puzzle = [];
let originalPuzzle = [];
let lockedCells = new Set();
let hintCount = 0;
let timerId = null;
let timerStartMs = null;
let lastCheckedIncorrect = new Set();
let leaderboardSavedForCurrentGame = false;
let gameCompleted = false;

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function getElapsedSeconds() {
  if (timerStartMs === null) {
    return 0;
  }
  return Math.floor((Date.now() - timerStartMs) / 1000);
}

function updateTimerDisplay(seconds = 0) {
  const timerEl = document.getElementById('timer');
  if (timerEl) {
    timerEl.innerText = formatTime(seconds);
  }
}

function startTimer() {
  stopTimer();
  timerStartMs = Date.now();
  updateTimerDisplay(0);
  timerId = setInterval(() => {
    updateTimerDisplay(getElapsedSeconds());
  }, 250);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function resetTimer() {
  stopTimer();
  timerStartMs = null;
  updateTimerDisplay(0);
}

function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      input.dataset.row = i;
      input.dataset.col = j;
      input.addEventListener('input', handleCellInput);
      input.dataset.index = i * SIZE + j;
      boardDiv.appendChild(input);
    }
  }
}

function updateHintDisplay() {
  const hintCountEl = document.getElementById('hint-count');
  if (hintCountEl) {
    hintCountEl.innerText = `Hints used: ${hintCount}`;
  }
}

function getCellClassName(inp, isLocked) {
  const classes = ['sudoku-cell'];
  if (isLocked) {
    classes.push('prefilled');
  }
  if (lastCheckedIncorrect.has(Number(inp.dataset.index))) {
    classes.push('incorrect');
  }
  return classes.join(' ');
}

function renderBoard(board, activeLockedCells = new Set()) {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = board[i][j];
      const inp = inputs[idx];
      const isOriginal = originalPuzzle[i][j] !== 0;
      const isLocked = isOriginal || activeLockedCells.has(idx) || gameCompleted;

      if (val !== 0) {
        inp.value = val;
        inp.disabled = isLocked;
        inp.className = getCellClassName(inp, isLocked);
      } else {
        inp.value = '';
        inp.disabled = gameCompleted;
        inp.className = getCellClassName(inp, false);
      }
    }
  }
}

function renderPuzzle(puz) {
  puzzle = puz.map(row => row.slice());
  originalPuzzle = puz.map(row => row.slice());
  lockedCells = new Set();
  lastCheckedIncorrect = new Set();
  gameCompleted = false;
  createBoardElement();
  renderBoard(puzzle);
}

function getStoredLeaderboardEntries() {
  try {
    const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to read leaderboard from localStorage', error);
    return [];
  }
}

function saveLeaderboardEntries(entries) {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Unable to save leaderboard to localStorage', error);
  }
}

function renderLeaderboard() {
  const leaderboardEl = document.getElementById('leaderboard-list');
  const emptyEl = document.getElementById('leaderboard-empty');
  if (!leaderboardEl || !emptyEl) {
    return;
  }

  const entries = getStoredLeaderboardEntries().slice(0, 10);
  leaderboardEl.innerHTML = '';

  if (entries.length === 0) {
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';
  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    const timeText = formatTime(entry.timeSeconds);
    item.innerHTML = `
      <span class="leaderboard-rank">${index + 1}. ${entry.name}</span>
      <span>${timeText} · ${entry.difficulty} · hints ${entry.hintsUsed}</span>
    `;
    leaderboardEl.appendChild(item);
  });
}

function addLeaderboardEntry(name, timeSeconds, difficulty, hintsUsed) {
  const entries = getStoredLeaderboardEntries();
  entries.push({name, timeSeconds, difficulty, hintsUsed});
  entries.sort((a, b) => a.timeSeconds - b.timeSeconds);
  saveLeaderboardEntries(entries.slice(0, 10));
  renderLeaderboard();
}

function clearLeaderboard() {
  saveLeaderboardEntries([]);
  renderLeaderboard();
}

function getStoredTheme() {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.warn('Unable to read theme from localStorage', error);
    return 'light';
  }
}

function applyTheme(theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', nextTheme);
  document.documentElement.style.colorScheme = nextTheme;
  const toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    toggleButton.textContent = nextTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    toggleButton.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    console.warn('Unable to save theme to localStorage', error);
  }
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function getThemeColor(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

async function newGame() {
  const difficulty = document.getElementById('difficulty-select').value;
  const res = await fetch(`/new?difficulty=${encodeURIComponent(difficulty)}`);
  const data = await res.json();
  renderPuzzle(data.puzzle);
  hintCount = 0;
  updateHintDisplay();
  resetTimer();
  startTimer();
  leaderboardSavedForCurrentGame = false;
  document.getElementById('message').innerText = '';
}

function getBoardFromInputs() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  return board;
}

function clearIncorrectHighlight() {
  lastCheckedIncorrect = new Set();
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    const row = Math.floor(idx / SIZE);
    const col = idx % SIZE;
    const isOriginal = originalPuzzle[row][col] !== 0;
    const isLocked = isOriginal || lockedCells.has(idx);
    inp.className = getCellClassName(inp, isLocked);
  }
}

async function applyHint() {
  if (gameCompleted) {
    return;
  }

  const board = getBoardFromInputs();
  const res = await fetch('/hint', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');

  if (data.error) {
    msg.style.color = getThemeColor('--message-color');
    msg.innerText = data.error;
    return;
  }

  puzzle = data.board.map(row => row.slice());
  hintCount = data.hint_count;
  updateHintDisplay();

  if (data.cell) {
    const idx = data.cell.row * SIZE + data.cell.col;
    lockedCells.add(idx);
    renderBoard(puzzle, lockedCells);
  }

  msg.style.color = getThemeColor('--accent-color');
  msg.innerText = 'Hint applied.';
}

async function checkSolution() {
  const board = getBoardFromInputs();
  const res = await fetch('/check', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');

  if (data.error) {
    msg.style.color = getThemeColor('--message-color');
    msg.innerText = data.error;
    return;
  }

  puzzle = board.map(row => row.slice());
  lastCheckedIncorrect = new Set(data.incorrect.map(x => x[0] * SIZE + x[1]));
  renderBoard(puzzle, lockedCells);

  if (data.solved) {
    gameCompleted = true;
    stopTimer();
    const difficultyLabel = document.getElementById('difficulty-select').value;
    const difficultyText = difficultyLabel.charAt(0).toUpperCase() + difficultyLabel.slice(1);
    const completionMessage = `Congratulations! You solved the puzzle! Time: ${formatTime(getElapsedSeconds())} · Difficulty: ${difficultyText} · Hints used: ${hintCount}`;

    msg.style.color = getThemeColor('--success-color');
    msg.innerText = completionMessage;

    if (!leaderboardSavedForCurrentGame) {
      leaderboardSavedForCurrentGame = true;
      const playerName = window.prompt('You solved it! Enter your name for the leaderboard:', '');
      if (playerName !== null) {
        const trimmedName = playerName.trim();
        if (trimmedName) {
          addLeaderboardEntry(trimmedName, getElapsedSeconds(), difficultyText, hintCount);
        }
      }
    }
  } else {
    msg.style.color = getThemeColor('--message-color');
    msg.innerText = 'Some cells are incorrect.';
  }
}

function highlightConflicts() {
    const boardDiv = document.getElementById("sudoku-board");
    const inputs = boardDiv.getElementsByTagName("input");

    // Remove previous conflict highlights
    for (const input of inputs) {
        input.classList.remove("invalid");
    }

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const idx = i * SIZE + j;
            const value = inputs[idx].value;

            if (!value) continue;

            // Check row
            for (let c = 0; c < SIZE; c++) {
                if (c !== j && inputs[i * SIZE + c].value === value) {
                    inputs[idx].classList.add("invalid");
                    inputs[i * SIZE + c].classList.add("invalid");
                }
            }

            // Check column
            for (let r = 0; r < SIZE; r++) {
                if (r !== i && inputs[r * SIZE + j].value === value) {
                    inputs[idx].classList.add("invalid");
                    inputs[r * SIZE + j].classList.add("invalid");
                }
            }

            // Check 3×3 box
            const startRow = Math.floor(i / 3) * 3;
            const startCol = Math.floor(j / 3) * 3;

            for (let r = startRow; r < startRow + 3; r++) {
                for (let c = startCol; c < startCol + 3; c++) {

                    if (r === i && c === j) continue;

                    const other = r * SIZE + c;

                    if (inputs[other].value === value) {
                        inputs[idx].classList.add("invalid");
                        inputs[other].classList.add("invalid");
                    }
                }
            }
        }
    }
}

function handleCellInput(event) {
    if (gameCompleted) {
        event.target.value = "";
        return;
    }

    const val = event.target.value.replace(/[^1-9]/g, "");
    event.target.value = val;

    const idx = Number(event.target.dataset.index);
    const row = Math.floor(idx / SIZE);
    const col = idx % SIZE;

    puzzle[row][col] = val ? parseInt(val, 10) : 0;

    clearIncorrectHighlight();

    // Highlight duplicate values immediately
    highlightConflicts();
}

// Wire buttons
window.addEventListener('load', () => {
  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('check-puzzle').addEventListener('click', checkSolution);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  const hintButton = document.getElementById('hint-button');
  if (hintButton) {
    hintButton.addEventListener('click', applyHint);
  }
  const clearLeaderboardButton = document.getElementById('clear-leaderboard');
  if (clearLeaderboardButton) {
    clearLeaderboardButton.addEventListener('click', clearLeaderboard);
  }
  const themeToggleButton = document.getElementById('theme-toggle');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }
  document.getElementById('difficulty-select').addEventListener('change', newGame);
  applyTheme(getStoredTheme());
  updateHintDisplay();
  renderLeaderboard();
  // initialize
  newGame();
});