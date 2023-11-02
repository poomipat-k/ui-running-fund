import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  reviewers: User[] = [];
  userService: UserService = inject(UserService);

  constructor() {
    // this.reviewers = this.userService.getReviewers();
    console.log('===Home constructor');
  }

  ngOnInit(): void {
    console.log('====ngOnInit');
    this.userService.getReviewers().subscribe((result) => {
      console.log('===result: ', result);
      if (!result) {
      }
    });
  }
}
