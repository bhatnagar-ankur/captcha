initiateCaptcha('captchaContainer');

function submitForm() {
    if (validateCaptcha()) {
        alert('Valid Captcha');
    } else {
        alert('Invalid Captcha');
    }
    event.preventDefault();
}

function captchaTextType(src) {
    initiateCaptcha('captchaContainer', { equation: src.value === 'Equation' });
}

function captchaLineType(src) {
    initiateCaptcha('captchaContainer', { grid: src.value === 'Grid' });
}

function otherFeatures(src) {
    if (src.value === 'Audio') {
        initiateCaptcha('captchaContainer', { audio: src.checked });
    }
    if (src.value === 'Reload') {
        initiateCaptcha('captchaContainer', { reload: src.checked });
    }
}