import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { ModalComponent } from '../components/modal/modal.component';
import { CaptchaService } from '../services/captcha.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { CaptchaPuzzle } from '../shared/models/captcha-puzzle';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('captchaModal') captchaModal: ModalComponent;

  protected form: FormGroup;

  private readonly themeService: ThemeService = inject(ThemeService);
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private captchaService: CaptchaService = inject(CaptchaService);

  private readonly subs: Subscription[] = [];

  protected everSubmitted = false;
  protected apiError = false;

  protected captchaPuzzle: CaptchaPuzzle = new CaptchaPuzzle();

  protected puzzleYPosition = '0px';

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();
  }

  // TODO: delete this
  ngAfterViewInit(): void {
    // this.captchaModal.showModal();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  onFieldValueChanged() {
    if (this.apiError) {
      this.apiError = false;
    }
  }

  onNext() {
    console.log('===[on Next]');
    this.form.markAllAsTouched();
    this.everSubmitted = true;
    const formData = this.form.value;
    if (this.form.valid) {
      console.log('===form is valid');
      this.generateCaptcha();
    } else {
      console.log('===not valid form');
    }
  }

  private generateCaptcha() {
    this.subs.push(
      this.captchaService.generateCaptcha().subscribe((captchaPuzzle) => {
        if (captchaPuzzle) {
          this.captchaPuzzle = captchaPuzzle;
          this.puzzleYPosition = captchaPuzzle.yPosition + 'px';
          this.captchaModal.showModal();
        }
      })
    );
  }

  onRefreshCaptcha() {
    this.generateCaptcha();
  }

  onCloseCaptcha() {
    this.captchaModal.closeModal();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.everSubmitted = true;
    const formData = this.form.value;
    if (this.form.valid) {
      // Validate captcha
      // Submit data to send a reset password email
      this.subs.push(
        this.userService
          .sendForgotPasswordEmail(formData?.email)
          .pipe(
            catchError((err: HttpErrorResponse) => {
              this.apiError = true;
              return throwError(() => err);
            })
          )
          .subscribe((result) => {
            if (result > 0) {
              this.apiError = false;
              this.router.navigate(['/password/forgot/sent']);
            }
          })
      );
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }
}
