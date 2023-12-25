import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  protected signupForm: FormGroup;

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  private readonly subs: Subscription[] = [];

  protected passwordIconUrl = '/assets/eye_open.svg';
  protected passwordType = 'password';
  protected confirmPasswordIconUrl = '/assets/eye_open.svg';
  protected confirmPasswordType = 'password';

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
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
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
      termsAndConditions: new FormControl(false, [Validators.requiredTrue]),
      privacy: new FormControl(false, [Validators.requiredTrue]),
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

  onToggleConfirmPassword(): void {
    if (this.confirmPasswordType === 'password') {
      this.confirmPasswordType = 'text';
      this.confirmPasswordIconUrl = '/assets/eye_closed.svg';
    } else {
      this.confirmPasswordType = 'password';
      this.confirmPasswordIconUrl = '/assets/eye_open.svg';
    }
  }

  onFieldValueChanged() {
    if (this.apiError) {
      this.apiError = false;
    }
  }

  onPopupLinkClicked(event: MouseEvent) {
    // Prevent toggle checkbox when click to open modal links
    event.preventDefault();
  }

  onSubmit() {
    console.log('===submit signup');
    console.log(this.signupForm);
    // this.signupForm.markAllAsTouched();
    // this.everSubmitted = true;
    // const formData = this.signupForm.value;
    // if (this.signupForm.valid) {
    //   this.subs.push(
    //     this.userService
    //       .login(formData?.email, formData?.password)
    //       .pipe(
    //         catchError((err: HttpErrorResponse) => {
    //           this.apiError = true;
    //           return throwError(() => err);
    //         })
    //       )
    //       .subscribe((result) => {
    //         if (result.success) {
    //           this.apiError = false;
    //           this.router.navigate(['/']);
    //         }
    //       })
    //   );
    // }
  }
}
