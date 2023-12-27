import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { ModalComponent } from '../components/modal/modal.component';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { APIError } from '../shared/models/api-error';
import { confirmPasswordMatchValidator } from '../shared/validators/confirmPasswordMatch';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  @ViewChild('tacModal') tacModal: ModalComponent;
  @ViewChild('privacyModal') privacyModal: ModalComponent;

  protected form: FormGroup;

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

  get emailControl() {
    return this.form.get('email');
  }
  get firstNameControl() {
    return this.form.get('firstName');
  }
  get lastNameControl() {
    return this.form.get('lastName');
  }
  get passwordControl() {
    return this.form.get('password');
  }
  get confirmPasswordControl() {
    return this.form.get('confirmPassword');
  }
  get termsAndConditionsControl() {
    return this.form.get('termsAndConditions');
  }
  get privacyControl() {
    return this.form.get('privacy');
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
      },
      confirmPasswordMatchValidator('password', 'confirmPassword')
    );
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

  onTACLinkClicked(event: MouseEvent) {
    // Prevent toggle checkbox when click to open modal links
    event.preventDefault();
    this.tacModal.showModal();
  }

  onPrivacyLinkClicked(event: MouseEvent) {
    // Prevent toggle checkbox when click to open modal links
    event.preventDefault();
    this.privacyModal.showModal();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.hadSubmitted = true;
    const formData = this.form.value;
    if (this.form.valid) {
      this.subs.push(
        this.userService
          .register(
            formData?.email,
            formData?.firstName,
            formData?.lastName,
            formData?.password,
            formData?.termsAndConditions,
            formData?.privacy
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
            // success result is a new user id
            if (result > 0) {
              this.router.navigate(['/signup/success'], {
                queryParams: { email: formData.email },
              });
            }
          })
      );
    }
  }

  protected onFieldValueChanged(fieldName: string) {
    if (this.apiErrors[fieldName]) {
      delete this.apiErrors[fieldName];
    }
  }

  protected getUIErrorMessage(errors: any, name: string): string {
    if (errors?.email) {
      return 'ที่อยู่อีเมลไม่ถูกต้อง';
    }
    if (errors?.required) {
      if (
        [
          'ข้อตกลงและเงื่อนไขการใช้วงาน',
          'นโยบายคุ้มครองความเป็นส่วนตัว',
        ].includes(name)
      ) {
        return `กรุณายอมรับ${name}`;
      }
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
}
