import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  protected form: FormGroup;
  private readonly themeService: ThemeService = inject(ThemeService);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  private readonly subs: Subscription[] = [];

  protected everSubmitted = false;
  protected apiError = false;

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
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
              this.router.navigate(['/password/reset-email/sent']);
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
