let expectedResult = 0;
let captchaText = "";
let operators = [['+', (a, b) => { return a + b; }, 'plus'], ['-', (a, b) => { return a - b; }, 'minus']];
let alphabets = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
let defaultOptions = {
    difficulty: 1,
    equation: true,
    grid: false,
    reload: true,
    audio: true
};

function initiateCaptcha(elementId, options) {
    defaultOptions = { ...defaultOptions, ...options };
    var containerElement = document.getElementById(elementId);
    prepareAndAppendStyleSheet();
    if (containerElement === null) {
        console.error('Unable to Find captcha container');
        return;
    }
    containerElement.innerHTML = getDOMForCaptchaElements();
    fillCaptcha();
    addEventListeners();
}

function refresh() {
    fillCaptcha();
}

function fillCaptcha() {
    let captchaTextForDisplay = '';
    if (defaultOptions.equation) {
        const equationAndResult = generateRandomEquation();
        expectedResult = equationAndResult.result;
        captchaText = equationAndResult.audioText;
        captchaTextForDisplay = equationAndResult.equation;
    } else {
        let textAndResult = randomText();
        expectedResult = textAndResult.result;
        captchaText = textAndResult.audioText;
        captchaTextForDisplay = textAndResult.result;
    }
    drawOnCanvas(captchaTextForDisplay);
}

function randomText() {
    let first = alphabets[Math.floor(Math.random() * alphabets.length)];
    let second = Math.floor(Math.random() * 10);
    let third = Math.floor(Math.random() * 10);
    let fourth = alphabets[Math.floor(Math.random() * alphabets.length)];
    let fifth = alphabets[Math.floor(Math.random() * alphabets.length)];
    let sixth = Math.floor(Math.random() * 10);
    let result = first.toString() + second.toString() + third.toString() + fourth.toString() + fifth.toString() + sixth.toString();
    return {
        result,
        audioText: prepareTextForAlphabets(result)
    };
}

function addEventListeners() {
    document.querySelector('#reloadCaptcha').addEventListener('click', refresh);
    document.querySelector('#playCaptcha').addEventListener('click', playAudio);
}

function prepareTextForAlphabets(text) {
    let str = '';
    for (let index = 0; index < text.length; index++) {
        if (isNaN(Number(text[index]))) {
            if (text[index].toUpperCase() === text[index]) {
                str += 'Uppercase ' + text[index] + ' ';
            } else {
                str += 'Lowercase ' + text[index] + ' ';
            }
        } else {
            str += text[index] + ' ';
        }
    }
    return str;
}

function drawOnCanvas(text) {
    const canvasElement = document.getElementById("captcha");
    const canvasContext = canvasElement.getContext("2d");
    canvasContext.clearRect(0, 0, 110, 30);
    canvasContext.font = "24px Tahoma";
    canvasContext.fillText(text, 5, 20);

    canvasContext.beginPath();
    if (defaultOptions.grid) {
        canvasContext.lineWidth = 1.6;
        drawGrid(canvasContext);
    }
    else {
        drawArcs(canvasContext);
    }

    canvasContext.stroke();
}

function drawGrid(canvasContext) {
    canvasContext.moveTo(10, 0);
    canvasContext.lineTo(10, 30);
    canvasContext.moveTo(20, 0);
    canvasContext.lineTo(20, 30);
    canvasContext.moveTo(30, 0);
    canvasContext.lineTo(30, 30);
    canvasContext.moveTo(40, 0);
    canvasContext.lineTo(40, 30);
    canvasContext.moveTo(50, 0);
    canvasContext.lineTo(50, 30);

    canvasContext.moveTo(0, 10);
    canvasContext.lineTo(110, 10);
    canvasContext.moveTo(0, 20);
    canvasContext.lineTo(110, 20);

    canvasContext.strokeStyle = "black";
}

function drawArcs(canvasContext) {
    canvasContext.arc(95, 50, 40, 0, 2 * Math.PI);
    canvasContext.arc(75, 30, 40, 0, 2 * Math.PI);
    canvasContext.arc(5, 50, 40, 0, 2 * Math.PI);

    canvasContext.arc(95, 60, 40, 0, 2 * Math.PI);
    canvasContext.arc(85, 50, 40, 0, 2 * Math.PI);
    canvasContext.arc(80, 60, 40, 0, 2 * Math.PI);
    canvasContext.arc(10, 50, 40, 0, 2 * Math.PI);
    canvasContext.arc(15, 50, 45, 0, 2 * Math.PI);
    canvasContext.arc(25, 50, 50, 0, 2 * Math.PI);
}

function generateRandomEquation() {
    const firstNumber = Math.floor(Math.random() * 1000) + 1;
    const secondNumber = Math.floor(Math.random() * 20) + 1;
    const randomOperator = getRandomOperator();
    return {
        equation: `${firstNumber} ${randomOperator[0]} ${secondNumber}`,
        result: randomOperator[1](firstNumber, secondNumber),
        audioText: `${firstNumber} ${randomOperator[2]} ${secondNumber}`,
    };
}

function getRandomOperator() {
    return operators[Math.floor(Math.random() * operators.length)];
}

function validateCaptcha() {
    let userAnswer = document.getElementById('captchaValue').value;
    if (defaultOptions.equation) {
        userAnswer = Number(userAnswer);
    }
    if (expectedResult && expectedResult === userAnswer) {
        return true;
    } else {
        fillCaptcha();
        return false;
    }
}

function playAudio() {
    const synth = speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(captchaText);
    utterThis.rate = 0.5;
    synth.speak(utterThis);
}

function playAudio_Test_Optimize() {
    try {
        const messageParts = captchaText.split(' ');
        let currentIndex = 0;

        const speak = (textToSpeak) => {
            const msg = new SpeechSynthesisUtterance();
            const voices = window.speechSynthesis.getVoices();

            msg.voice = voices[0];
            msg.volume = 1;
            // msg.rate = 0.5;
            // msg.pitch = 0.1;
            msg.text = textToSpeak;
            msg.lang = 'en-US';

            msg.onend = () => {
                currentIndex++;
                if (currentIndex < messageParts.length) {
                    // setTimeout(() => {
                    speak(messageParts[currentIndex]);
                    // }, 10);
                }
            };

            speechSynthesis.speak(msg);
        };

        speak(messageParts[0]);
    } catch (e) {
        console.error(e);
    }
}

function prepareAndAppendStyleSheet() {
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);
    style.appendChild(document.createTextNode(getStyle()));
}

function getDOMForCaptchaElements() {
    const basicCaptcha = `<canvas id="captcha" width="110" height="30">Sorry, your browser does not support canvas.</canvas >`;
    const reload = `<div id="reloadCaptcha" class="icon-container" title="Reload Captcha">
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32" viewBox="0 0 32 32" id="change"><path d="M12 3H6C4.3457 3 3 4.3457 3 6v6c0 1.6543 1.3457 3 3 3h6c1.6543 0 3-1.3457 3-3V6C15 4.3457 13.6543 3 12 3zM13 12c0 .5518-.4482 1-1 1H6c-.5518 0-1-.4482-1-1V6c0-.5518.4482-1 1-1h6c.5518 0 1 .4482 1 1V12zM26 17h-6c-1.6543 0-3 1.3457-3 3v6c0 1.6543 1.3457 3 3 3h6c1.6543 0 3-1.3457 3-3v-6C29 18.3457 27.6543 17 26 17zM27 26c0 .5518-.4482 1-1 1h-6c-.5518 0-1-.4482-1-1v-6c0-.5518.4482-1 1-1h6c.5518 0 1 .4482 1 1V26zM20.9394 12.3526c.1953.1952.5118.1952.7071-.0001l.707-.707c.1953-.1953.1953-.5119-.0001-.7072L20.4144 9H24c.5523 0 1 .4477 1 1v4.5c0 .2761.2239.5.5.5h1c.2761 0 .5-.2239.5-.5V10c0-1.6569-1.3431-3-3-3h-3.5862l1.9388-1.9395c.1952-.1953.1952-.5118-.0001-.707l-.707-.707c-.1953-.1953-.5119-.1953-.7072.0001l-3.6456 3.6465c-.3904.3904-.3903 1.0235.0002 1.4139L20.9394 12.3526zM11.0606 19.6474c-.1953-.1953-.5118-.1952-.7071.0001l-.707.7069c-.1953.1953-.1953.5119.0001.7072L11.5856 23H8c-.5523 0-1-.4478-1-1v-4.5C7 17.2238 6.7761 17 6.5 17h-1C5.2239 17 5 17.2238 5 17.5V22c0 1.6569 1.3431 3 3 3h3.5862l-1.9388 1.9394c-.1952.1953-.1952.5118.0001.7071l.707.7069c.1953.1953.5119.1953.7072 0l3.6456-3.6465c.3904-.3905.3903-1.0235-.0002-1.4139L11.0606 19.6474z"></path></svg>
                    </div>`;
    const audio = `<div id="playCaptcha" class="icon-container" title="Spell Captcha">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="audio"><path d="M12 3a1 1 0 0 0-1 1V20a1 1 0 0 0 2 0V4A1 1 0 0 0 12 3zM8 5A1 1 0 0 0 7 6V18a1 1 0 0 0 2 0V6A1 1 0 0 0 8 5zM4 7A1 1 0 0 0 3 8v8a1 1 0 0 0 2 0V8A1 1 0 0 0 4 7zM16 5a1 1 0 0 0-1 1V18a1 1 0 0 0 2 0V6A1 1 0 0 0 16 5zM20 7a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8A1 1 0 0 0 20 7z"></path></svg>
                    </div>`;
    return `<div class="canvas-and-btn-container">
                    ${basicCaptcha}
                    ${defaultOptions.reload ? reload : ''}
                    ${defaultOptions.audio ? audio : ''}
                </div>
                <input class="captcha-answer-box" type="text" id="captchaValue" placeholder="Captcha Value" />`;

}

function getStyle() {
    return ``;
}

export { initiateCaptcha, validateCaptcha };
