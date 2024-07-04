// This is the core library code
(function (root, factory) {
    // Universal Module Definition (UMD) to support AMD, CommonJS, and browser globals
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser global (root is window)
        root["captcha"] = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    let defaultOptions = {
        "equation": true,
        "grid": false,
        "reload": true,
        "audio": true,
        "hoverColor": '#00bcd4',
        "refreshIcon": null,
        "audioIcon": null,
    };

    let expectedResult = 0;
    let captchaText = "";
    let operators = [['+', (a, b) => { return a + b; }, 'plus'], ['-', (a, b) => { return a - b; }, 'minus']];
    let alphabets = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";


    function refresh() { fillCaptcha(); }

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
        document.querySelector('#reloadCaptcha')?.addEventListener('click', refresh);
        document.querySelector('#playCaptcha')?.addEventListener('click', playAudio);
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
                        ${defaultOptions.refreshIcon ? defaultOptions.refreshIcon : getDefaultRefreshIcon()}
                    </div>`;
        const audio = `<div id="playCaptcha" class="icon-container" title="Spell Captcha">
                        ${defaultOptions.audioIcon ? defaultOptions.audioIcon : getDefaultPlayIcon()}
                    </div>`;
        return `<div class="canvas-and-btn-container">
                    ${basicCaptcha}
                    ${defaultOptions.reload ? reload : ''}
                    ${defaultOptions.audio ? audio : ''}
                </div>
                <input class="captcha-answer-box" type="text" id="captchaValue" placeholder="Captcha Value" />`;

    }

    function getDefaultRefreshIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 128 128" viewBox="0 0 128 128" id="refresh" style="height:28px"><path d="M10.8 46.8c2.7-5.6 6.5-10.6 10.8-14.8 4.3-4.2 9.2-7.5 14.4-9.9 5.2-2.4 10.6-3.7 15.9-4.2 5.3-.4 10.6 0 15.6 1.4 5 1.3 9.5 3.5 13.5 6.3 2.3 1.6 4.4 3.4 6.3 5.4L71.3 41.5l39.9 8.1 8.1-39.9-13.5 8.9c-2.1-1.9-4.3-3.7-6.6-5.3-11.1-7.8-24.9-12-39.8-11C26.3 4.7 1.3 32.4 2.1 65.6c.1 3.5.5 7 1.1 10.4.1.6.9.9 1.4.6h0C4.9 76.3 5.1 76 5 75.7 4.4 65.5 6.5 55.4 10.8 46.8zM123.3 51.3L123.3 51.3c-.3.2-.4.5-.4.8.6 10.3-1.4 20.5-5.7 29-2.7 5.6-6.5 10.6-10.8 14.8-4.3 4.2-9.2 7.5-14.4 9.9-5.2 2.4-10.6 3.7-15.9 4.2-5.3.4-10.6 0-15.6-1.4-5-1.3-9.6-3.5-13.6-6.3-2.3-1.6-4.3-3.4-6.2-5.3l15.9-10.5-39.9-8.1-8.1 39.9 13.5-8.9c2 1.9 4.2 3.6 6.5 5.2 11.2 7.9 25.2 12.1 40.2 11 33.2-2.5 58.1-30.3 57-63.6-.1-3.5-.5-6.8-1.2-10.1C124.6 51.3 123.9 51 123.3 51.3z"></path></svg>`;
    }

    function getDefaultPlayIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="audio"><path d="M12 3a1 1 0 0 0-1 1V20a1 1 0 0 0 2 0V4A1 1 0 0 0 12 3zM8 5A1 1 0 0 0 7 6V18a1 1 0 0 0 2 0V6A1 1 0 0 0 8 5zM4 7A1 1 0 0 0 3 8v8a1 1 0 0 0 2 0V8A1 1 0 0 0 4 7zM16 5a1 1 0 0 0-1 1V18a1 1 0 0 0 2 0V6A1 1 0 0 0 16 5zM20 7a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8A1 1 0 0 0 20 7z"></path></svg>`;
    }

    function getStyle() {
        return `#captcha {
            border: 1px solid grey;
        }

        .icon-container {
            display: inline-block;
            cursor: pointer;
            width: inherit;
            height: inherit;
        }

        .icon-container svg {
            height: 32px;
        }

        .icon-container:hover svg {
            fill: ${defaultOptions.hoverColor};
        } `;
    }

    // The actual library implementation
    return {
        "initiateCaptcha": function (elementId, options) {
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
        },

        "validateCaptcha": function () {
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
    };
}));
