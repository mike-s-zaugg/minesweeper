console.log("Hallo Minesweeper!");
const ROWS = 9;
const COLS = 9;
const MINES = 10;

const table = document.getElementById("board");

function returnNewCellObject() {
const newCell = { bomb: false, bombsInRadius: 0, state: "hidden"}
return newCell;
}
// bomb = boolean, bombInRadius = int, state =  string (hidden, open, flagged)
// cell doesnt need to know where is is


// field
function createField(){
    const field = [];
    // create a field based on settings
    for (let rows = 0; rows < ROWS;  rows++) {
        const row = [];
        for (let col = 0; col < COLS; col++){
            const newCell = returnNewCellObject();
            row.push(newCell);
        }
        field.push(row);
    }
    
    return field;
}

function placeMines(field){
    let bombCount = 0;

    while(bombCount < MINES){
        // generate random place on field
        const randomRow = Math.floor(Math.random() * ROWS);
        const randomCol = Math.floor(Math.random() * COLS);

        // if the cell is not already a bomb, mark it as bomb
        if(field[randomRow][randomCol].bomb === false){
            field[randomRow][randomCol].bomb = true;
            bombCount++;
        }
    }
}



const field = createField();
placeMines(field);
displayField(field);

function displayField(field) {
    // Output all cells in html
    for (let row = 0; row < field.length;  row++) {

        const colCount = field[row].length;
        const rowElement  = document.createElement("tr");

        for (let col = 0; col < colCount; col++){
            //console.log(field[row][col])
            const cellElement = document.createElement("td");

            if(field[row][col].bomb){
                cellElement.textContent = "*"
            } else {
              cellElement.textContent = "."  
            }
            rowElement.appendChild(cellElement );
        }

        table.appendChild(rowElement );
    }
}

countNeighborBombs(field, 4, 5);

function countNeighborBombs(field, row, col){
    let bombRadiusCount = 0;
    let rowStartPoint = row - 1;
    let colStartPoint = col - 1;
    for (let i = 0; i < 3;  i++) {

        for (let f = 0; f < 3; f++){
            if(field[rowStartPoint][colStartPoint] !== field[row][col]){
                if(field[rowStartPoint][colStartPoint].bomb){
                    bombRadiusCount++;
                } 
            }
            colStartPoint++;
        }

        rowStartPoint++;
    }
    console.log(bombRadiusCount)
    return bombRadiusCount;
}