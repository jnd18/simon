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
    if (pattern.length === 0) {
        return;
    } else {
        let [head, ...tail] = pattern;
        setTimeout(() => {
            playSound(buttonSounds[head]);
            blink(head, 500, () => {
                play(tail);
            });
        }, 100);
    }
}

function playSound(audioElt) {
    if (!soundOn) return;
    audioElt.pause();
    audioElt.currentTime = 0;
    audioElt.play();
}

// load sounds
const buttonSounds = {};
buttonSounds.green  = new Audio("low_e.mp3");
buttonSounds.red    = new Audio("a.mp3");
buttonSounds.yellow = new Audio("csharp.mp3");
buttonSounds.blue   = new Audio("high_e.mp3");
const gameOverSound = new Audio("low_a.mp3");

// set up sound toggle button
document.getElementById("toggleSound").addEventListener("click", event => {
    soundOn = !soundOn;
});

// global state for the game
let gameOn = false; // true iff a game is in progress
let attempt; // player's partial answer
let index; // counts how many buttons pushed so far in a given attempt
let pattern; // correct answer
let highScore = 0;
let soundOn = true;

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
            } else {
                playSound(buttonSounds[color]);
                if (attempt.length === pattern.length) {
                    setTimeout(() => { // add delay before next run
                        advanceGame();
                    }, 1000);
                } else {
                    index++;
                }
            }
        } else {
            playSound(buttonSounds[color]);
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
        lastScore = pattern.length - 1;
        highScore = Math.max(highScore, lastScore);
        document.getElementById("lastScore").textContent = `last score: ${lastScore}`;
        document.getElementById("highScore").textContent = `high score: ${highScore}`;
        return;
    }
    if (n === 3) {
        playSound(gameOverSound);
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
