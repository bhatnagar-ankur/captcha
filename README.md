# Client Side Captcha

This repository has been created for client-side captcha.



## Authors

- [@bhatnagar-ankur](https://github.com/bhatnagar-ankur)


## Run Locally

Download the files from the dist folder.


Open the HTML page where it needs to be injected. Create a DOM element with an ID where it needs to be injected.

```html
  <div id="captchaContainer"></div>
```

Once the captcha.min.js is included in the project. Use the below code to initiate the captcha, 'options' is optional.

```js
  captcha.initiateCaptcha('captchaContainer', options);
```

Use the below code to validate the captcha answer, it returns true or false.

```js
  captcha.validateCaptcha();
```

The default value of options are

```js
  {
    "equation": true,
    "grid": false,
    "reload": true,
    "audio": true,
    "hoverColor": '#00bcd4'
  }
```
