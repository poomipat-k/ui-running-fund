import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  protected reviewers: User[] = [];

  protected currentUser = new User();

  constructor() {}

  ngOnInit(): void {
    this.userService.currentUserSubject$.subscribe((user) => {
      this.currentUser = user;
    });

    this.userService.autoLogin();
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
