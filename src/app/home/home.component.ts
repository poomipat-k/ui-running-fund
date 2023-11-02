import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

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
  }
}
