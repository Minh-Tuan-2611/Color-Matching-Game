import { getPlayAgainButton } from "./selectors.js";
import { getTimerElement } from "./selectors.js";

function shuffle(array) {
    for (var i = array.length - 1; i > 1; i--) {
        var j = Math.floor(Math.random() * i);

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export const getRandomColorPairs = function(count) {

    var colorList = [];

    var hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

    for (var i = 0; i < count; i++) {
        var color = randomColor({
            luminosity: 'dark',
            hue: hueList[i % hueList.length],
        });
        colorList.push(color);
    }

    var fullColorList = [...colorList, ...colorList];

    shuffle(fullColorList);

    return fullColorList;
}

export function showPlayAgainButton() {
    var playAgainButton = getPlayAgainButton();
    playAgainButton.classList.add('show');
}
export function hidePlayAgainButton() {
    var playAgainButton = getPlayAgainButton();
    playAgainButton.classList.remove('show');
}
export function setTimerText(text) {
    var timerElement = getTimerElement();
    timerElement.textContent = text;
}

export function createTimer({ seconds, onChange, onFinish }) {
    var intervalId = null;

    function start() {
        clear();

        var currentSeconds = seconds;

        intervalId = setInterval(function() {
            onChange(currentSeconds);

            currentSeconds--;
            if (currentSeconds < 0) {
                clear();

                onFinish();
            }
        }, 0)
    }

    function clear() {
        clearInterval(intervalId);
    }

    return {
        start,
        clear
    }
}