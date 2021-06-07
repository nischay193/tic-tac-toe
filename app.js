const cells = document.querySelectorAll(".cell");

let currentTurn = "x";
let winner = "";
let xPositions = [], circlePositions = [];

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

}

function endGame() {
    document.querySelector("#message").innerText = winner;
    resultMessage.classList.add("show");
}
function restart() {
    xPositions = [];
    circlePositions = [];
    currentTurn = "x";
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

