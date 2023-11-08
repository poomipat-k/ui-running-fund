import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/models/user';
import { UserService } from '../services/user.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  protected loginForm: FormGroup;

  protected reviewers: User[] = [];

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  get submitButtonDisabled(): boolean {
    return false;
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);

    this.initForm();

    this.userService.getReviewers().subscribe((result) => {
      if (!result) {
        console.log('====SOMETHING WRONG');
      } else {
        this.reviewers = result;
      }
    });
  }

  private initForm(): void {
    this.loginForm = new FormGroup({
      reviewer: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    console.log('====onSubmit', this.loginForm);
    const reviewerId = this.loginForm.value?.reviewer;
    if (reviewerId & +reviewerId) {
      const user = this.reviewers.find((r) => r.id === +reviewerId);
      if (user) {
        this.userService.login(user);
        this.router.navigate(['/']);
      }
    }
  }
}
