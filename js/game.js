// Game rules for TicTime. No DOM code lives here.

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function createEmptyBoard() {
  return Array(9).fill(null);
}

function nextPlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

function getGameResult(board) {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { status: 'win', winner: board[a], line: [a, b, c] };
        }
    }
    if (board.every((cell) => cell !== null)) {
        return { status: 'draw', winner: null, line: null };
    }
    return { status: 'playing', winner: null, line: null };
}