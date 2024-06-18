function initiateCaptcha(elementId) {
    var containerElement = document.getElementById(elementId);
    if (containerElement === null) {
        console.error('Unable to Find captcha container');
        return;
    }
    containerElement.innerHTML = getDOMForCaptchaElements();
    fillCaptcha();
}

function refresh() {
    fillCaptcha();
}

let expectedResult = 0;
var operators = [['+', function (a, b) { return a + b; }], ['-', function (a, b) { return a - b; }]];

function fillCaptcha() {
    const equationAndResult = generateRandomEquation();
    expectedResult = equationAndResult.result;
    drawOnCanvas(equationAndResult.equation);
}

function drawOnCanvas(text) {
    const canvasElement = document.getElementById("captcha");
    const canvasContext = canvasElement.getContext("2d");
    canvasContext.clearRect(0, 0, 110, 30);
    canvasContext.font = "24px Tahoma";
    canvasContext.beginPath();
    canvasContext.arc(95, 50, 40, 0, 2 * Math.PI);
    canvasContext.arc(75, 30, 40, 0, 2 * Math.PI);
    canvasContext.arc(5, 50, 40, 0, 2 * Math.PI);

    canvasContext.arc(95, 60, 40, 0, 2 * Math.PI);
    canvasContext.arc(85, 50, 40, 0, 2 * Math.PI);
    canvasContext.arc(80, 60, 40, 0, 2 * Math.PI);
    canvasContext.arc(10, 50, 40, 0, 2 * Math.PI);
    canvasContext.arc(15, 50, 45, 0, 2 * Math.PI);
    canvasContext.arc(25, 50, 50, 0, 2 * Math.PI);
    canvasContext.stroke();
    canvasContext.fillText(text, 5, 22);
}

function generateRandomEquation() {
    const firstNumber = Math.floor(Math.random() * 1000) + 1;
    const secondNumber = Math.floor(Math.random() * 20) + 1;
    const randomOperator = getRandomOperator();
    return { equation: `${firstNumber} ${randomOperator[0]} ${secondNumber}`, result: randomOperator[1](firstNumber, secondNumber) };
}

function getRandomOperator() {
    return operators[Math.floor(Math.random() * operators.length)];
}

function validateCaptcha() {
    const userAnswer = document.getElementById('captchaValue').value;
    if (expectedResult && expectedResult === Number(userAnswer)) {
        return true;
    } else {
        fillCaptcha();
        return false;
    }
}

function getDOMForCaptchaElements() {
    return `<div class="canvas-and-btn-container">
                <canvas id="captcha" width="110" height="30" style="border:1px solid grey;">Sorry, your browser does not support canvas.</canvas >
                <button type="button" onclick="refresh()" style="vertical-align: bottom; margin-bottom: 4px; font-size:22px;">↻</button>
            </div>
            <input class="captcha-answer-box" type="text" id="captchaValue" placeholder="Captcha Value" />`;

}