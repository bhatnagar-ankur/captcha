# Client Side Captcha - Angular Demo

This project has been created to demonstrate the integration of the captcha library.


## Authors

- [@bhatnagar-ankur](https://github.com/bhatnagar-ankur)


## Run Locally

Clone the repo or download the angular project as a zip.
Or Create an angular project from scratch, [start fresh](https://angular.dev/tools/cli/setup-local)

Include the captcha.min.js from the dist folder in the assets folder or desired folder and then update its reference in angular.json file.

```js
  "scripts": [
              "src/assets/captcha.min.js"
            ]
```
Open the component page where it needs to be injected. Create a DOM element with an ID where it needs to be injected.

```html
  <div id="captchaContainer"></div>
```

Use the below code to initiate the captcha, 'options' is optional.

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
    "refreshIcon": null, // use SVG icon or HTML code to build a custom icon
    "audioIcon": null,   // use SVG icon or HTML code to build a custom icon
  }
```

