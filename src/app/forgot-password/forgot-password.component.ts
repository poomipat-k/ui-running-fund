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
import { environment } from '../../environments/environment';
import { CaptchaComponent } from '../components/captcha/captcha.component';
import { ModalComponent } from '../components/modal/modal.component';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { CaptchaSubmitEmit } from '../shared/models/captcha-submit-event';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    CaptchaComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('captchaComponent') captchaComponent: CaptchaComponent;

  protected form: FormGroup;
  protected bannerUrl = environment.loginBanner;

  private readonly themeService: ThemeService = inject(ThemeService);
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);

  private readonly subs: Subscription[] = [];

  protected isLoading = false;

  protected everSubmitted = false;
  protected apiError = false;

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  onEmailValueChanged() {
    if (this.apiError) {
      this.apiError = false;
    }
  }

  onNext() {
    this.form.markAllAsTouched();
    this.everSubmitted = true;
    if (this.form.valid && !this.apiError) {
      this.captchaComponent.openCaptchaModal();
    }
  }

  onCaptchaModalClosed() {
    this.subs.forEach((s) => s.unsubscribe());
    this.isLoading = false;
  }

  onCaptchaSubmitEmit(captchaData: CaptchaSubmitEmit) {
    if (!captchaData) {
      return;
    }
    this.onSubmit(captchaData.captchaId, captchaData.captchaValue);
  }

  onSubmit(captchaId: string, captchaValue: number) {
    this.form.markAllAsTouched();
    this.everSubmitted = true;
    const formData = this.form.value;
    if (this.form.valid) {
      this.isLoading = true;

      this.subs.push(
        this.userService
          .sendForgotPasswordEmail(formData?.email, captchaId, captchaValue)
          .pipe(
            catchError((err: HttpErrorResponse) => {
              if (
                err?.error?.name !== 'captchaValue' &&
                err?.error?.name !== 'captchaId'
              ) {
                this.apiError = true;
                this.captchaComponent.closeCaptchaModal();
              } else {
                this.captchaComponent.refreshCaptcha();
              }
              this.isLoading = false;
              return throwError(() => err);
            })
          )
          .subscribe((result) => {
            this.isLoading = false;
            if (result > 0) {
              this.apiError = false;
              this.router.navigate(['/password/forgot/sent'], {
                queryParams: { email: formData?.email },
              });
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
