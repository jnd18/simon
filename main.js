/* to do:
 * add sounds
 */

// utility functions
function getcssvar(varname) {
    return getComputedStyle(document.documentElement, null).getPropertyValue(`--${varname}`);
}

function blink(color, time, callback) {
    buttons[color].style.backgroundColor = getcssvar(`light-${color}`);
    setTimeout(() => {
        buttons[color].style.backgroundColor = getcssvar(`dark-${color}`);
        if (callback !== undefined) callback();
    }, time);
}

function play(pattern) {
    console.log(pattern);
    if (pattern.length === 0) {
        return;
    } else {
        let [head, ...tail] = pattern;
        setTimeout(() => {
            blink(head, 500, () => {
                play(tail);
            });
        }, 100);
    }
}

// global state for the game
let gameOn = false; // true iff a game is in progress
let attempt; // player's partial answer
let index; // counts how many buttons pushed so far in a given attempt
let pattern; // correct answer
let highScore = 0;

// initialize colored game buttons
const colors = ["green", "red", "yellow", "blue"];
const buttons = {};
for (let color of colors) {
    buttons[color] = document.getElementById(`${color}Button`);
    // button onclick functionality
    buttons[color].addEventListener("click", event => {
        blink(color, 300);
        if (gameOn) {
            attempt.push(color)
            if (attempt[index] !== pattern[index]) {
                gameOver();
            } else if (attempt.length === pattern.length) {
                setTimeout(() => { // add delay before next run
                    advanceGame();
                }, 1000);
            } else {
                index++;
            }
        }
    });
}

// initialize new game button
const newGame = document.getElementById("newGame");
newGame.addEventListener("click", event => {
    gameOn = true;
    pattern = [];
    advanceGame();
});

// runs to continue the game
function advanceGame() {
    attempt = [];
    index = 0;
    pattern.push(colors[Math.floor(Math.random() * 4)]);
    play(pattern);
}

// runs when game is lost
function gameOver(n = 3) {
    if (n === 0) {
        gameOn = false;
        highScore = Math.max(highScore, pattern.length - 1);
        document.getElementById("highScore").textContent = `high score: ${highScore}`;
        return;
    }
    for (let color of ["green", "red", "yellow"]) {
        blink(color, 100)
    }
    blink("blue", 100, () => {
        setTimeout(() => {
            gameOver(n - 1);
        }, 100)
    });
}
