import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  protected loginForm: FormGroup;

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  private readonly subs: Subscription[] = [];

  get submitButtonDisabled(): boolean {
    return false;
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    const formData = this.loginForm.value;
    console.log('====formData', formData);
    this.subs.push(
      this.userService
        .login(formData?.email, formData?.password)
        .subscribe((result) => {
          console.log('===result', result);
        })
    );
  }
}
