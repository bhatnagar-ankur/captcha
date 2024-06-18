initiateCaptcha('captchaContainer');

function submitForm() {
    if (validateCaptcha()) {
        alert('Valid Captcha');
    } else {
        alert('Invalid Captcha');
    }
    event.preventDefault();
}
