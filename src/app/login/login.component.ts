import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  protected form: FormGroup;

  protected loginBanner = environment.loginBanner;

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  private readonly subs: Subscription[] = [];

  protected passwordIconUrl = '/assets/eye_open.svg';
  protected passwordType = 'password';

  protected everSubmitted = false;
  protected apiError = false;

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(60),
      ]),
    });
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

  onFieldValueChanged() {
    if (this.apiError) {
      this.apiError = false;
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.everSubmitted = true;
    const formData = this.form.value;
    if (this.form.valid) {
      this.subs.push(
        this.userService
          .login(formData?.email, formData?.password)
          .pipe(
            catchError((err: HttpErrorResponse) => {
              this.apiError = true;
              return throwError(() => err);
            })
          )
          .subscribe((result) => {
            if (result.success) {
              this.apiError = false;
              this.router.navigate(['/dashboard']);
            }
          })
      );
    }
  }
}
