import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare const captcha: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  title = 'captcha-demo';

  ngAfterViewInit(): void {
    captcha.initiateCaptcha("captchaContainer");
    // initiateCaptcha('captchaContainer');
  }

  formSubmit() {
    console.log(captcha.validateCaptcha());
  }
}
