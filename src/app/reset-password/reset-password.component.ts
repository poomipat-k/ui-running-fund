import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { APIError } from '../shared/models/api-error';
import { confirmPasswordMatchValidator } from '../shared/validators/confirmPasswordMatch';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  @Input() resetPasswordCode: string;
  protected form: FormGroup;

  protected banner = environment.loginBanner;

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  private readonly subs: Subscription[] = [];

  protected passwordIconUrl = '/assets/eye_open.svg';
  protected passwordType = 'password';
  protected confirmPasswordIconUrl = '/assets/eye_open.svg';
  protected confirmPasswordType = 'password';

  protected hadSubmitted = false;
  protected apiErrors: { [key: string]: APIError } = {};

  get passwordControl() {
    return this.form.get('password');
  }
  get confirmPasswordControl() {
    return this.form.get('confirmPassword');
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm(): void {
    this.form = new FormGroup(
      {
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(60),
        ]),
        confirmPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(60),
        ]),
      },
      confirmPasswordMatchValidator('password', 'confirmPassword')
    );
  }

  onToggleConfirmPassword(): void {
    if (this.confirmPasswordType === 'password') {
      this.confirmPasswordType = 'text';
      this.confirmPasswordIconUrl = '/assets/eye_closed.svg';
    } else {
      this.confirmPasswordType = 'password';
      this.confirmPasswordIconUrl = '/assets/eye_open.svg';
    }
  }

  onTogglePassword(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIconUrl = '/assets/eye_closed.svg';
    } else {
      this.passwordType = 'password';
      this.passwordIconUrl = '/assets/eye_open.svg';
    }
  }

  onFieldValueChanged(fieldName: string) {
    if (this.apiErrors[fieldName]) {
      delete this.apiErrors[fieldName];
    }
    if (this.apiErrors['resetPasswordCode']) {
      delete this.apiErrors['resetPasswordCode'];
    }
  }

  protected getUIErrorMessage(errors: any, name: string): string {
    if (errors?.required) {
      return `กรุณากรอก${name}`;
    }
    if (errors?.minlength) {
      return `รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร`;
    }
    if (errors?.maxlength) {
      return `รหัสผ่านต้องมีความยาวไม่เกิน 60 ตัวอักษร`;
    }
    return 'ข้อมูลไม่ถูกต้อง';
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.hadSubmitted = true;
    const formData = this.form.value;
    if (this.form.valid && this.resetPasswordCode) {
      this.subs.push(
        this.userService
          .resetPassword(
            formData?.password,
            formData?.confirmPassword,
            this.resetPasswordCode
          )
          .pipe(
            catchError((err: HttpErrorResponse) => {
              const fieldName = err?.error?.name;
              if (fieldName) {
                this.apiErrors[fieldName] = err?.error;
              }
              return throwError(() => err);
            })
          )
          .subscribe((result) => {
            if (result > 0) {
              this.router.navigate(['/password/reset/success']);
            }
          })
      );
    }
  }
}
