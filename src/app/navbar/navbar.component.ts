import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  protected reviewers: User[] = [];
  protected currentUser = new User();

  private readonly subs: Subscription[] = [];

  get isAdmin(): boolean {
    return this.currentUser.userRole === 'admin';
  }

  get isApplicant(): boolean {
    return this.currentUser.userRole === 'applicant';
  }

  get isReviewer(): boolean {
    return this.currentUser.userRole === 'reviewer';
  }

  get isLoggedIn(): boolean {
    return this.currentUser.id > 0;
  }

  constructor() {}

  ngOnInit(): void {
    this.subs.push(
      this.userService.currentUserSubject$.subscribe((user) => {
        if (user.id) {
          this.currentUser = user;
          return;
        }
        const lsUser = localStorage.getItem('loggedInUser');
        if (lsUser) {
          const jsonLocalStorageUser: User = JSON.parse(lsUser);
          this.currentUser = jsonLocalStorageUser;
          return;
        }
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  toLoginPage() {
    this.router.navigate(['/login']);
  }

  onLogout() {
    this.userService.logout().subscribe((result) => {
      if (result.success) {
        this.router.navigate(['/login']);
      }
    });
  }
}
