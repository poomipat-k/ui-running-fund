import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DashboardAdminComponent } from '../dashboard-admin/dashboard-admin.component';
import { DashboardApplicantComponent } from '../dashboard-applicant/dashboard-applicant.component';
import { DashboardReviewerComponent } from '../dashboard-reviewer/dashboard-reviewer.component';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardApplicantComponent,
    DashboardReviewerComponent,
    DashboardAdminComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private userService: UserService = inject(UserService);

  protected user: User;
  ngOnInit(): void {
    const currentUser = this.userService.getCurrentInMemoryUser();
    this.user = currentUser;
  }
}
