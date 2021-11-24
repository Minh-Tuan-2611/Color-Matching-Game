import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js'
import { getColorListElement, getPlayAgainButton, getColorElementList } from './selectors.js';
import { getRandomColorPairs, createTimer, showPlayAgainButton, hidePlayAgainButton, setTimerText } from './utils.js';
import { getInActiveColorList, getColorBackground } from './selectors.js';

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
var timer = createTimer({
    seconds: GAME_TIME,
    onChange: handleTimerChange,
    onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
    var fullSecond = `0${second}`.slice(-2);
    setTimerText(fullSecond)
}

function handleTimerFinish() {
    gameStatus = GAME_STATUS.FINISHED

    showPlayAgainButton();

    setTimerText('GAME OVER :(');
}

function handleColorClick(liElement) {

    var shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);

    if (shouldBlockClick) {
        return;
    }

    liElement.classList.add('active');
    selections.push(liElement);
    if (selections.length < 2) {
        return;
    }
    var firstColor = selections[0].dataset.color;
    var secondColor = selections[1].dataset.color;

    var isMatch = firstColor === secondColor;

    if (isMatch) {
        setBackgroundColor(firstColor);
        var isWin = getInActiveColorList().length === 0;
        if (isWin) {
            showPlayAgainButton();
            setTimerText('YOU WIN :)');
            timer.clear();

            gameStatus = GAME_STATUS.FINISHED;
        }

        selections = [];
        return;
    }

    gameStatus = GAME_STATUS.BLOCKING

    setTimeout(function() {
        selections[0].classList.remove('active');
        selections[1].classList.remove('active');
        selections = [];

        if (gameStatus !== GAME_STATUS.FINISHED) {
            gameStatus = GAME_STATUS.PLAYING;
        }
    }, 300);

}

function initColors() {
    var colorList = getRandomColorPairs(PAIRS_COUNT);

    var liList = getColorListElement().querySelectorAll('.overlay');

    for (var index = 0; index < liList.length; index++) {
        liList[index].parentElement.dataset.color = colorList[index];
        var overlayElement = liList[index];
        if (overlayElement) {
            overlayElement.style.backgroundColor = colorList[index];
        }
    }
}

function attachEventForColorsList() {
    var ulElement = getColorListElement();
    ulElement.addEventListener('click', function(event) {
        if (event.target.tagName !== 'LI') {
            return;
        }
        handleColorClick(event.target);
    })
}

function resetGame() {
    gameStatus = GAME_STATUS.PLAYING;
    selections = [];
    var colorList = getColorElementList();
    for (var color of colorList) {
        color.classList.remove('active');
    }
    hidePlayAgainButton();
    setTimerText('');
    initColors();
    startTimer();
}

function attachEventForPlayAgainButton() {
    var playAgainButton = getPlayAgainButton();
    playAgainButton.addEventListener('click', resetGame);
}

function setBackgroundColor(color) {
    const backgroundElement = getColorBackground()
    if (backgroundElement) backgroundElement.style.backgroundColor = color
}

function startTimer() {
    timer.start();
}

setBackgroundColor('goldenrod');

var startBtn = document.querySelector('.game__button-start');
startBtn.classList.add('show');
startBtn.onclick = function() {
    attachEventForPlayAgainButton();
    initColors();
    attachEventForColorsList();
    startBtn.classList.remove('show');
    startTimer();
}