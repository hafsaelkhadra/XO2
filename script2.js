// Sélection des éléments HTML
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const playMusicBtn = document.getElementById('playMusicBtn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

const backgroundMusic = document.getElementById('background-music');
const crashSound = document.getElementById('crash-sound');
const clickSound = document.getElementById('click-sound');
const defeatSound = document.getElementById('defeat-sound');

// Récupération des noms depuis localStorage
const nameX = localStorage.getItem("playerX") || "Joueur X";
const nameO = localStorage.getItem("playerO") || "Joueur O";

let currentPlayer = "X";
let cells = Array(9).fill("");
let gameActive = true;
let scores = { X: 0, O: 0 };

// Créer le plateau
function createBoard() {
    board.innerHTML = '';
    cells.forEach((_, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = index;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    });
}

// Gérer le clic sur une cellule
function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (cells[index] !== "" || !gameActive) return;

    cells[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    clickSound.play();

    checkWinOrDraw();

    if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `C'est au tour de ${getCurrentPlayerName()}`;
    }
}

// Vérifie s'il y a un gagnant ou match nul
function checkWinOrDraw() {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let combo of wins) {
        const [a, b, c] = combo;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            gameActive = false;
            highlightWinner(combo);
            statusText.textContent = `🎉 ${getCurrentPlayerName()} a gagné !`;
            scores[currentPlayer]++;
            updateScores();
            crashSound.play();
            stopMusic();
            return;
        }
    }

    if (!cells.includes("")) {
        statusText.textContent = "🤝 Match nul !";
        defeatSound.play();
        gameActive = false;
        stopMusic();
    }
}

// Mettre en surbrillance les cases gagnantes
function highlightWinner(indices) {
    indices.forEach(i => {
        const cell = board.querySelector(`.cell[data-index='${i}']`);
        cell.classList.add('winner');
    });
}

// Mettre à jour les scores à l'écran
function updateScores() {
    scoreX.textContent = `${nameX}: ${scores.X}`;
    scoreO.textContent = `${nameO}: ${scores.O}`;
}

// Obtenir le nom du joueur courant
function getCurrentPlayerName() {
    return currentPlayer === "X" ? nameX : nameO;
}

// Réinitialiser le jeu
restartBtn.addEventListener('click', () => {
    currentPlayer = "X";
    cells = Array(9).fill("");
    gameActive = true;
    statusText.textContent = `C'est au tour de ${nameX}`;
    createBoard();
    playMusicBtn.style.display = 'inline-block';
});

// Jouer la musique de fond
playMusicBtn.addEventListener('click', () => {
    backgroundMusic.play();
    playMusicBtn.style.display = 'none';
});

// Arrêter la musique
function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

// Démarrer le jeu
createBoard();
updateScores();
statusText.textContent = `C'est au tour de ${nameX}`;
