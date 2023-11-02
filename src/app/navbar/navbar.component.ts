import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  userService: UserService = inject(UserService);

  protected currentUser = new User();

  constructor() {
    this.userService.currentUserSubject.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
