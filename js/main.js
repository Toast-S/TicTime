// Game state and event wiring. Connects game.js (rules) to ui.js (screen).

const state = {
  board: createEmptyBoard(),
  currentPlayer: 'X',
  gameOver: false,
  scores: { X: 0, O: 0, draws: 0 },
  theme: 'light',
  history: [],
};

function handleCellClick(index) {
    if (state.gameOver) return;
    if (state.board[index] !== null) return;

    // Save current state to history before making the move
    state.history.push({
        board: [...state.board],
        currentPlayer: state.currentPlayer
    });

    state.board[index] = state.currentPlayer;
    renderBoard(state.board);
    renderHistory();

    const result = getGameResult(state.board);

    if (result.status === 'win') {
        state.gameOver = true;
        state.scores[result.winner]++;
        highlightWinningCells(result.line);
        setStatus(`Player ${result.winner} wins`, result.winner);
        setBoardLocked(true);
        renderScores(state.scores);
        launchConfetti();
    } else if (result.status === 'draw') {
        state.gameOver = true;
        setStatus("It's a draw!", '');
        setBoardLocked(true);
        state.scores.draws++;
        renderScores(state.scores);
    } else {
        state.currentPlayer = nextPlayer(state.currentPlayer);
        setStatus(`Player ${state.currentPlayer}'s turn`, state.currentPlayer);
    }
}

function startNewGame() {
    state.board = createEmptyBoard();
    state.currentPlayer = 'X';
    state.gameOver = false;
    state.history = [];
    renderBoard(state.board);
    renderHistory();
    setBoardLocked(false);
    setStatus("Player X's turn", 'X');
}

function renderHistory() {
    const historyListEl = document.getElementById('history-list');
    if (!historyListEl) return;

    historyListEl.innerHTML = '';

    // Game start button
    const startLi = document.createElement('li');
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Go to game start';
    startBtn.onclick = () => jumpToStep(-1);
    startLi.appendChild(startBtn);
    historyListEl.appendChild(startLi);

    // Move buttons
    state.history.forEach((step, moveIndex) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = `Go to move #${moveIndex + 1}`;
        btn.onclick = () => jumpToStep(moveIndex);
        li.appendChild(btn);
        historyListEl.appendChild(li);
    });
}

function jumpToStep(moveIndex) {
    if (moveIndex === -1) {
        state.board = createEmptyBoard();
        state.currentPlayer = 'X';
        state.history = [];
    } else {
        state.board = [...state.history[moveIndex].board];
        state.currentPlayer = state.history[moveIndex].currentPlayer;
        state.history = state.history.slice(0, moveIndex);
    }

    state.gameOver = false;
    setBoardLocked(false);
    renderBoard(state.board);
    renderHistory();
    setStatus(`Player ${state.currentPlayer}'s turn`, state.currentPlayer);
}

function startNewGame() {
  state.board = createEmptyBoard();
  state.currentPlayer = 'X';
  state.gameOver = false;
  renderBoard(state.board);
  state.history = [];
  renderHistory();
  setBoardLocked(false);
  setStatus("Player X's turn", 'X');
  
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  setTheme(state.theme);
}

// TODO: wire up the "Reset Scores" button (#reset-scores-btn)

buildBoard(handleCellClick);
renderBoard(state.board);
renderScores(state.scores);
setStatus("Player X's turn", 'X');
document.getElementById('new-game-btn').addEventListener('click', startNewGame);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('reset-scores-btn').addEventListener('click', () => {
  state.scores = { X: 0, O: 0, draws: 0 };
  renderScores(state.scores); });
