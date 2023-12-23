//Let forms load first before executing
document.addEventListener('DOMContentLoaded', function()
{
    const resetButton = document.getElementById('resetButton');// store reset button element
    const cells = document.querySelectorAll('.cell'); // Get all the cell elements by class name
    const difficultButton = document.getElementById('difficult'); // store difficult button
    const easyButton = document.getElementById('easy'); // store easy button

    const currentPlayer = 'X'; // define variable for current player
    const PLAYER_O = 'O'; // constant that represents computers move
    // define variable for board array
    let boardArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let difLevelEasy = true; // variable to store difficulty level, by default mark easy as true
    let difLevelDifficult = false; // variable to store difficulty level, by default mark easy as true

    // Add click event listeners to the difficulty buttons
    easyButton.addEventListener('click', function () {
        // call function to color the button accordingly
        setDifficulty(true);
    });

    difficultButton.addEventListener('click', function () {
        // call function to color the button accordingly
        setDifficulty(false);
    });

    // Add a click event listener to each cell
    cells.forEach(cell => {
      cell.addEventListener('click', function(event) {
        let cellNumber = this.getAttribute('data-cell'); // Store row number of cell that is clicked
        // Get the value of the data-state attribute
        let dataStateValue = this.getAttribute("data-state");

        // Use document.getElementById to access the cell element
        let cellElement = document.getElementById('cell-' + cellNumber);

        // Check if the cell that was clicked is empty (dataStateValue is still set to empty)
        if (dataStateValue === 'empty'){
            // Call function to handle move
            handleMove(currentPlayer, cellNumber, cellElement)

            // Call Check win function
            let winner = checkWin();

            if (winner != null){
                // Call Print Winner function
                printWinner(winner);
                return; // return to prevent additional computer move
            }


            // If no Winner is found then generate Computers response
            // Call function to generate computers move
            // declare variable to store computers move
            let computerMove;

            // if difficulty level is difficult
            if (difLevelDifficult === true){
                // call difficult computer move method and store result
                computerMove = getComputerMoveDifficult();
            }
            // else if difficulty level is easy
            else if (difLevelEasy === true){
                // call method to get randomly generated number for computer move
                computerMove = getComputerMove();
            }

            // Get HTML element for Computer move
            let computerCellElement = document.getElementById('cell-' + computerMove);

            // Call function to handle computers move after a delay of 1 second using setTimeout
            setTimeout(function () {
                handleMove(PLAYER_O, computerMove, computerCellElement);

                // Call Check win function
                winner = checkWin();
                // Call Print Winner function
                printWinner(winner);
            }, 300); // 1000 milliseconds (1 second) delay
        }
        });
    });

    // Set click listener event on the reset button
    resetButton.addEventListener('click', function(event){
        // loop through cells and reset cells values
        cells.forEach(cell => {
            cell.textContent = '';
            cell.setAttribute("data-state", "empty");
        });

        // loop through board array and reset
        for (let i = 0; i < boardArray.length; i++){
            boardArray[i] = String(i + 1);
        }
    });

    // JAVASCRIPT TO SHOW AND HIDE MENU TO PROJECT PAGE
    // get and store menu toggle DOM item
    const hamMenu = document.querySelector('.ham-menu');
    // get and store off screen menu
    const offScreenMenu = document.querySelector('.off-screen-menu');

    // Event listener for ham menu
    hamMenu.addEventListener('click', () => {
        // toggle ham menu and off screen menu to active to show the menu
      hamMenu.classList.toggle('active');
      offScreenMenu.classList.toggle('active');

    });

    // Function to set the difficulty level
    function setDifficulty(easy) {
        // If easy is already selected, toggle it off
        if (easy && easyButton.style.backgroundColor === "red") {
            easyButton.style.backgroundColor = "";
        // If difficult is already selected, toggle it off
        } else if (!easy && difLevelDifficult) {
            // reset values, easy on, difficult off
            difLevelEasy = true;
            difLevelDifficult = false;
            difficultButton.style.backgroundColor = "";
        // Otherwise, toggle the selected difficulty on
        } else {
            difLevelEasy = easy;
            difLevelDifficult = !easy;
            easyButton.style.backgroundColor = easy ? "red" : "";
            difficultButton.style.backgroundColor = easy ? "" : "red";
        }
    }

    // Function to generate Computers move
    function getComputerMove(){
        let computerMove; // define variable to store computer move
        // keep generating numbers until a number is generated that has not been selected yet
        while (true) {
            computerMove = Math.floor(Math.random() * (10 - 1)) + 1;
            // if board array
            if (boardArray.includes(String(computerMove))) {
              break; // Exit the loop when a valid move is found
            }
          }
        return computerMove; // return computers move
    }

    // Function to generate difficult computer move
    function getComputerMoveDifficult() {
        // array of winning scenarios
        const winningScenarios = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

        // loop through winning scenarios and check for a computer winning move first
        for (const [a, b, c] of winningScenarios) {
            // if there are two 'O's in a row and an empty winning space of c
            if (boardArray[a] === PLAYER_O && boardArray[b] === PLAYER_O && boardArray[c] !== currentPlayer) {
                return c + 1; // return winning space + 1 to accommodate for handling move
            }
            // else if there are two 'O's in a row and an empty winning space of b
            else if (boardArray[a] === PLAYER_O && boardArray[c] === PLAYER_O && boardArray[b] !== currentPlayer) {
                return b + 1; // return winning space + 1 to accommodate for handling move
            }
            // else if there are two 'O's in a row and an empty winning space of a
            else if (boardArray[b] === PLAYER_O && boardArray[c] === PLAYER_O && boardArray[a] !== currentPlayer) {
                return a + 1; // return winning space + 1 to accommodate for handling move
            }
        }

        // Then, check to block the player from winning
        for (const [a, b, c] of winningScenarios) {
            // if potential winning move is found
            if (boardArray[a] === currentPlayer && boardArray[b] === currentPlayer && boardArray[c] !== PLAYER_O) {
                return c + 1; // return blocking move if found
            }
            // else if potential winning move is found
            else if (boardArray[a] === currentPlayer && boardArray[c] === currentPlayer && boardArray[b] !== PLAYER_O) {
                return b + 1; // return blocking move if found
            }
            // else if potential winning move is found
            else if (boardArray[b] === currentPlayer && boardArray[c] === currentPlayer && boardArray[a] !== PLAYER_O) {
                return a + 1; // return blocking move if found
            }
        }

        // If no winning or blocking moves, make a strategic move
        if (boardArray[4] !== PLAYER_O && boardArray[4] !== currentPlayer) {
            return 4 + 1; // return Center position
        }

        // If center cell is taken then look then find available corner moves and randomly pick one
        const cornerMoves = [0, 2, 6, 8];
        // filter on only corners that are available, haven't been selected by a player
        const availableCorners = cornerMoves.filter(corner => boardArray[corner] !== PLAYER_O && boardArray[corner] !== currentPlayer);
        if (availableCorners.length > 0) {
            // return a randomly selected corner of corners available
            return availableCorners[Math.floor(Math.random() * availableCorners.length)] + 1;
        }

        // If no corner cells are open, then pick any of the available side cells
        const sideMoves = [1, 3, 5, 7];
        // filter on only side cells that are available, haven't been selected by a player
        const availableSides = sideMoves.filter(side => boardArray[side] !== PLAYER_O && boardArray[side] !== currentPlayer);
        // return a randomly selected side cell of side cells available
        return availableSides[Math.floor(Math.random() * availableSides.length)] + 1;
    }

    // Function to handle move
    function handleMove(player, cellNumber, cellElement){
        // set HTML element to Players move "X"
        cellElement.textContent = player;

        // Set the value of the data-state attribute
        cellElement.setAttribute("data-state", "filled");

        // set board array cell to player's move
        boardArray[cellNumber - 1] = player;
    }

    // Function to Check for Winner
    function checkWin() {
        var winner = null;
        // Loop through scenarios of tic-tac-toe winner
                for (let a = 0; a < 8; a++){
                    var line = null; // define string to capture values of board at potential winning scenario
                    // Evaluate 7 winning scenarios
                    switch (a){
                        case 0:
                            line = boardArray[0] + boardArray[1] + boardArray[2]; // Top row win
                            break;
                        case 1:
                            line = boardArray[3] + boardArray[4] + boardArray[5]; // middle row win
                            break;
                        case 2:
                            line = boardArray[6] + boardArray[7] + boardArray[8]; // bottom row win
                            break;
                        case 3:
                            line = boardArray[0] + boardArray[3] + boardArray[6]; // first column win
                            break;
                        case 4:
                            line = boardArray[1] + boardArray[4] + boardArray[7]; // second column win
                            break;
                        case 5:
                            line = boardArray[2] + boardArray[5] + boardArray[8]; // third column win
                            break;
                        case 6:
                            line = boardArray[0] + boardArray[4] + boardArray[8]; // diagonal win
                            break;
                        case 7:
                            line = boardArray[2] + boardArray[4] + boardArray[6]; // diagonal win
                            break;
                    }

                    // check the line string to see if currentPlayer is winner
                    if (line === "XXX") {
                        return "player"; // Current Player wins
                    }
                    // check the line string to see if computer is winner
                    else if (line === "OOO") {
                        return "computer"; // Computer Wins
                    }
                }
                // Check for a draw
                for (let i = 0; i < 9; i++) {
                    // if there is a number value within the board then there isn't a draw yet
                    // convert array board into a list, then use .contains to check for an integer value
                    if (boardArray.includes(String(i + 1))) {
                        return null; // Return null, no winner yet
                    }
                    else if (i == 8){ // reached the end of the board and all cells filled
                        return "draw";  // return draw
                    }
                }
                return null; // no winner or draw found return null
        }

    // Function to print winner on screen
    function printWinner(winner){
        if (winner === "player"){
            alert("Congratulation! You won the game!");
        }
        else if (winner === "computer"){
            alert("The computer beat you :( AI is taking over the world!");
        }
        else if (winner === "draw"){
            alert("It's a draw! Thanks for playing");
        }
        return; // If no winner is found return
    }

});

