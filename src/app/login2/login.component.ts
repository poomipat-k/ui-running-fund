import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { User } from '../shared/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class Login2Component implements OnInit, OnDestroy {
  protected loginForm: FormGroup;

  protected reviewers: User[] = [];

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

    this.subs.push(
      this.userService.getReviewers().subscribe((result) => {
        if (!result) {
          console.error('====Cannot get Reviewers');
        } else {
          this.reviewers = result;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm(): void {
    this.loginForm = new FormGroup({
      reviewer: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    const reviewerId = this.loginForm.value?.reviewer;
    if (reviewerId & +reviewerId) {
      const user = this.reviewers.find((r) => r.id === +reviewerId);
      if (user) {
        this.userService.login2(user);
        this.router.navigate(['/']);
      }
    }
  }
}
