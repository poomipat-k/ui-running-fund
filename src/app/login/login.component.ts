import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  reviewers: User[] = [];
  userService: UserService = inject(UserService);

  ngOnInit(): void {
    this.userService.getReviewers().subscribe((result) => {
      console.log('===result: ', result);
      if (!result) {
        console.error('+++SOMETHING WRONG');
      } else {
        this.reviewers = result;
      }
    });
  }
}
