import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DashboardApplicantComponent } from '../dashboard-applicant/dashboard-applicant.component';
import { DashboardReviewerComponent } from '../dashboard-reviewer/dashboard-reviewer.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DashboardApplicantComponent,
    DashboardReviewerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);

  ngOnInit(): void {
    this.userService.tryGetUserForNonGuardedRoute();
  }
}
