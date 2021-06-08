const cells = document.querySelectorAll(".cell");

let turnCount = 1;
let currentTurn = "x";
let winner = "";
let xPositions = [], circlePositions = [];
let gameOver = false;
let aiFirst = true;

const resultMessage = document.querySelector("#result-message");
const board = document.querySelector(".board");

const winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
]

const cellPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// CPU is O, player is X
function getCell(maximizing) {
    const available = cellPositions.filter(item => {
        return !xPositions.includes(item) && !circlePositions.includes(item);
    });
    if (available.length == 0) return 0;
    // console.log(available);
    // return available[0];
    if (maximizing) {
        let pos = -1, score = -Infinity;
        for (let x of available) {
            circlePositions.push(x);
            var val = minimax(false);
            circlePositions.pop();
            if (val > score) {
                score = val;
                pos = x;
            }
        }
        return pos;
    } else {
        let pos = -1, score = Infinity;
        for (let x of available) {
            xPositions.push(x);
            var val = minimax(true);
            xPositions.pop();
            if (val < score) {
                score = val;
                pos = x;
            }
        }
        return pos;
    }

}
function minimax(maximizing) {
    // circle is maximizing, X is minimizing
    var available = cellPositions.filter(item => {
        return !xPositions.includes(item) && !circlePositions.includes(item);
    });
    let result = checkWinner();
    if (result == lookUp.x) return -1;
    if (result == lookUp.circle) return 1;
    if (result == lookUp.draw) return 0;

    if (maximizing) {
        let bestScore = -Infinity;
        for (let x of available) {
            circlePositions.push(x);
            let score = minimax(false);
            bestScore = Math.max(score, bestScore);
            circlePositions.pop();
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let x of available) {
            xPositions.push(x);
            let score = minimax(true);
            bestScore = Math.min(score, bestScore);
            xPositions.pop();
        }
        return bestScore;
    }
}
const lookUp = {
    x: 0,
    circle: 1,
    draw: 2,
    noResult: 3,
}
function startGame() {
    board.classList.add("x");
    cells.forEach(cell => {
        cell.addEventListener("click", addItem, { once: true });
    });
    if (aiFirst) {
        turnCount = 0;
        const cellClass = ".cell-" + getCell(!aiFirst);
        console.log(cellClass);
        const ele = document.querySelector(cellClass);
        ele.click();
    }
    const restartButton = document.querySelector(".btn");
    restartButton.addEventListener("click", restart);
}
function changeTurn() {
    board.classList.remove("x");
    board.classList.remove("circle");
    if (currentTurn == "x") {
        currentTurn = "circle";
        board.classList.add("circle");
    } else if (currentTurn == "circle") {
        currentTurn = "x";
        board.classList.add("x");
    }
}
function checkContains(arr, target) {
    return target.some(item => item.every(v => arr.includes(v)));
}
function checkWinner() {
    if (checkContains(xPositions, winningCombinations)) {
        return lookUp.x;
    } else if (checkContains(circlePositions, winningCombinations)) {
        return lookUp.circle;
    } else if (xPositions.length + circlePositions.length == 9) {
        return lookUp.draw;
    }
    return lookUp.noResult;
}
function addItem(event) {
    const clickedCell = (event.target);
    const className = clickedCell.classList[1];
    document.querySelector("." + className).classList.add(currentTurn);
    const cellNumber = Number(className.split("-")[1]);
    currentTurn === "x" ? xPositions.push(cellNumber) : circlePositions.push(cellNumber);

    switch (checkWinner()) {
        case lookUp.x:
            winner = "X wins!"
            endGame();
            break;
        case lookUp.circle:
            winner = "Circle wins!";
            endGame();
            break;
        case lookUp.draw:
            winner = "Draw!";
            endGame();
            break;
    }
    changeTurn();
    // AI turn
    if (!gameOver) {
        if (turnCount % 2 == 1) {
            turnCount++;
            markNext();
            changeTurn();
        } else {
            turnCount++;
        }
    }

}

function markNext() {
    const cellClass = ".cell-" + getCell(!aiFirst);
    console.log(cellClass);
    const ele = document.querySelector(cellClass);
    if (getCell != 0) {
        ele.click();
        changeTurn();
    }
}
function endGame() {
    gameOver = true;
    document.querySelector("#message").innerText = winner;
    resultMessage.classList.add("show");
}
function restart() {
    xPositions = [];
    circlePositions = [];
    turnCount = 1;
    currentTurn = "x";
    gameOver = false;
    aiFirst = !aiFirst;
    document.querySelectorAll(".x").forEach(item => {
        item.classList.remove("x");
    });
    document.querySelectorAll(".circle").forEach(item => {
        item.classList.remove("circle");
    });
    resultMessage.classList.remove("show");
    startGame();
}

startGame();

