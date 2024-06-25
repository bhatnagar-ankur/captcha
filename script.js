import { initiateCaptcha, validateCaptcha } from './captcha.js';
initiateCaptcha('captchaContainer');
addEventListeners();

function submitForm() {
    if (validateCaptcha()) {
        alert('Valid Captcha');
    } else {
        alert('Invalid Captcha');
    }
    event.preventDefault();
}

function captchaTextType(event) {
    const selectedValue = event.target.value;
    initiateCaptcha('captchaContainer', { equation: selectedValue === 'Equation' });
}

function captchaLineType(event) {
    const selectedValue = event.target.value;
    initiateCaptcha('captchaContainer', { grid: selectedValue === 'Grid' });
}

function captchaFeatures(event) {
    const selectedValue = event.target.value;
    if (selectedValue === 'Audio') {
        initiateCaptcha('captchaContainer', { audio: event.target.checked });
    }
    if (selectedValue === 'Reload') {
        initiateCaptcha('captchaContainer', { reload: event.target.checked });
    }
}

function addEventListeners() {
    const radioCaptchaType = document.querySelectorAll('input[name="captchaType"]');
    for (const radioButton of radioCaptchaType) {
        radioButton.addEventListener('change', captchaTextType);
    }

    const radioCaptchaLineType = document.querySelectorAll('input[name="captchaLine"]');
    for (const radioButton of radioCaptchaLineType) {
        radioButton.addEventListener('change', captchaLineType);
    }

    const radioCaptchaFeatures = document.querySelectorAll('input[name="captchaFeatures"]');
    for (const radioButton of radioCaptchaFeatures) {
        radioButton.addEventListener('change', captchaFeatures);
    }
}

export { submitForm, captchaTextType, captchaLineType, captchaFeatures }