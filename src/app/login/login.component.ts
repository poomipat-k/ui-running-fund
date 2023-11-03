import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

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

  get submitButtonDisabled(): boolean {
    return false;
  }

  ngOnInit(): void {
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
