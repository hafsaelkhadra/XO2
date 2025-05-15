const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const playMusicBtn = document.getElementById('playMusicBtn');
const backgroundMusic = document.getElementById('background-music');
const crashSound = document.getElementById('crash-sound');
const defeatSound = document.getElementById('defeat-sound');
const clickSound = document.getElementById('click-sound');

let currentPlayer = "X"; // Toi, l'humain
let cells = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

function createBoard() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (cells[index] !== "" || !gameActive) return;

    playClickSound(); // Son de clic

    cells[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    checkResult();

    if (gameActive) {
        currentPlayer = "O";
        setTimeout(aiMove, 500); // Petit délai
    }
}

function aiMove() {
    const emptyIndices = cells.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    if (emptyIndices.length === 0 || !gameActive) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    cells[randomIndex] = currentPlayer;
    const cellElement = board.querySelector(`.cell[data-index='${randomIndex}']`);
    cellElement.textContent = currentPlayer;
    checkResult();

    if (gameActive) {
        currentPlayer = "X";
    }
}

function checkResult() {
    const winningConditions = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            gameActive = false;
            stopMusic();

            if (currentPlayer === "X") {
                statusText.textContent = `🎉 Bravo ! Vous avez gagné !`;
                playCrashSound();
            } else {
                statusText.textContent = `😔 Bonne chance pour la prochaine fois !`;
                playDefeatSound();
            }
            return;
        }
    }

    if (!cells.includes("")) {
        statusText.textContent = "🤝 Match nul !";
        gameActive = false;
        stopMusic();
        return;
    }
}

function restartGame() {
    currentPlayer = "X";
    cells = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.textContent = "";
    createBoard();
    playMusicBtn.style.display = 'inline-block';
}

playMusicBtn.addEventListener('click', () => {
    backgroundMusic.play();
    playMusicBtn.style.display = 'none';
});

restartBtn.addEventListener('click', restartGame);

function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function playCrashSound() {
    crashSound.currentTime = 0;
    crashSound.play();
}

function playDefeatSound() {
    defeatSound.currentTime = 0;
    defeatSound.play();
}

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

createBoard();
