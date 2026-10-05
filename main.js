const ROWS = 9;
const COLS = 9;
const MINES = 10;


let gameState = "running";

const table = document.getElementById("board");
const gameStateDisplay = document.getElementById("gameState");
const restartButton = document.getElementById("restartButton");

function returnNewCellObject() {
    const newCell = { bomb: false, bombsInRadius: 0, state: "hidden" };
    return newCell;
}
// bomb = boolean, bombInRadius = int, state =  string (hidden, open, flagged)
// cell doesnt need to know where is is

// field
function createField() {
    const field = [];
    // create a field based on settings
    for (let rows = 0; rows < ROWS; rows++) {
        const row = [];
        for (let col = 0; col < COLS; col++) {
            const newCell = returnNewCellObject();
            row.push(newCell);
        }
        field.push(row);
    }

    return field;
}

function placeMines(field) {
    let bombCount = 0;

    while (bombCount < MINES) {
        // generate random place on field
        const randomRow = Math.floor(Math.random() * ROWS);
        const randomCol = Math.floor(Math.random() * COLS);

        // if the cell is not already a bomb, mark it as bomb
        if (field[randomRow][randomCol].bomb === false) {
            field[randomRow][randomCol].bomb = true;
            bombCount++;
        }
    }
}

function displayField(field) {
    // Output all cells in html
    table.innerHTML = "";
    for (let row = 0; row < field.length; row++) {
        const colCount = field[row].length;
        const rowElement = document.createElement("tr");

        for (let col = 0; col < colCount; col++) {
            //console.log(field[row][col])
            const cellElement = document.createElement("td");

            // Eventlistener -> unhide cells
            cellElement.addEventListener("click", function () {
                if(gameState !== "running"){
                    return;
                } 
                openCell(field, row, col);
                checkGameState(field);
                displayField(field);
            });

            cellElement.addEventListener("contextmenu", function (event) {
                event.preventDefault(event);
                if(gameState !== "running"){
                    return;
                } 
                toggleFlag(field, row, col);
                displayField(field);
            });

            if (field[row][col].state === "open") {
                cellElement.classList.add("open");
                if (field[row][col].bomb) {
                    cellElement.textContent = "*";
                    cellElement.classList.add("bomb");
                } else if (field[row][col].bombsInRadius > 0) {
                    // dont show 0
                    const elementBombsInRadius = field[row][col].bombsInRadius;
                    cellElement.textContent = elementBombsInRadius;
                    const numberedClassName = "n" + elementBombsInRadius;

                    cellElement.classList.add(numberedClassName);
                }
            } else if (field[row][col].state === "hidden") {
                cellElement.classList.add("hidden");
            } else if (field[row][col].state === "flagged") {
                cellElement.classList.add("flagged");
            }
            rowElement.appendChild(cellElement);
        }

        table.appendChild(rowElement);
    }
}

function countNeighborBombs(field, row, col) {
    let bombRadiusCount = 0;
    let rowStartPoint = row - 1;
    let colStartPoint = col - 1;
    for (let i = 0; i < 3; i++) {
        for (let f = 0; f < 3; f++) {
            // count bombs in the radius, dont break when on the edge, skip current field
            if (
                rowStartPoint >= 0 &&
                rowStartPoint < ROWS &&
                colStartPoint >= 0 &&
                colStartPoint < COLS
            ) {
                if (field[rowStartPoint][colStartPoint] !== field[row][col]) {
                    if (field[rowStartPoint][colStartPoint].bomb) {
                        bombRadiusCount++;
                    }
                }
            }
            colStartPoint++;
        }
        colStartPoint = col - 1;

        rowStartPoint++;
    }
    return bombRadiusCount;
}

function calculateNumbers(field, row, col) {
    for (let row = 0; row < field.length; row++) {
        const colCount = field[row].length;

        for (let col = 0; col < colCount; col++) {
            //console.log(field[row][col])
            if (field[row][col].bomb === false) {
                field[row][col].bombsInRadius = countNeighborBombs(
                    field,
                    row,
                    col,
                );
            }
        }
    }
}

function openCell(field, row, col) {
    let rowStartPoint = row - 1;
    let colStartPoint = col - 1;

    // open only when hidden
    if (field[row][col].state === "hidden") {
        field[row][col].state = "open";

        for (let i = 0; i < 3; i++) {
            //if a true zero
            if (
                field[row][col].bombsInRadius === 0 &&
                field[row][col].bomb === false
            ) {
                for (let f = 0; f < 3; f++) {
                    if (
                        rowStartPoint >= 0 &&
                        rowStartPoint < ROWS &&
                        colStartPoint >= 0 &&
                        colStartPoint < COLS
                    ) {
                        if (
                            field[rowStartPoint][colStartPoint] !==
                            field[row][col]
                        ) {
                            openCell(field, rowStartPoint, colStartPoint);
                        }
                    }
                    colStartPoint++;
                }
            }
            colStartPoint = col - 1;
            rowStartPoint++;
        }
    }
    return;
}

function toggleFlag(field, row, col) {
    if (field[row][col].state === "hidden") {
        field[row][col].state = "flagged";
    } else if (field[row][col].state === "flagged") {
        field[row][col].state = "hidden";
    }
}

function checkGameState(field) {
    let openedBombs = 0;
    let unopenedSafeFields = 0;

    for (let row = 0; row < field.length; row++) {
        const colCount = field[row].length;

        for (let col = 0; col < colCount; col++) {
            
            if (field[row][col].bomb === true && field[row][col].state === "open") {
                openedBombs++;
            } else if (field[row][col].bomb === false && field[row][col].state !== "open"){
                unopenedSafeFields++
            }
        }
    }

    if(openedBombs > 0){
        // game lost
        revealAllCells(field);
        gameState = "lost";
        gameStateDisplay.textContent = "You Lost!";
    } else if (openedBombs === 0 && unopenedSafeFields === 0){
        // game won
        gameState = "won";
        gameStateDisplay.textContent = "You Won!";
    }

}

function revealAllCells(field) {
    for (let row = 0; row < field.length; row++) {
        const colCount = field[row].length;

        for (let col = 0; col < colCount; col++) {
            field[row][col].state = "open";
        }
    }
}

function newGame(){
    const field = createField();
    placeMines(field);
    calculateNumbers(field);
    gameState = "running";
    gameStateDisplay.textContent = "";
    displayField(field);
}

newGame();

restartButton.addEventListener("click", function () {
    newGame();
});