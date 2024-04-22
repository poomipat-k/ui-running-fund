import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DashboardApplicantComponent } from '../dashboard-applicant/dashboard-applicant.component';
import { DashboardReviewerComponent } from '../dashboard-reviewer/dashboard-reviewer.component';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';

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
  private userService: UserService = inject(UserService);
  // private router: Router = inject(Router);

  protected user: User;
  ngOnInit(): void {
    const currentUser = this.userService.getCurrentInMemoryUser();
    this.user = currentUser;
    console.log('==user', this.user);

    // this.router.navigate(['/dashboard']);
  }
}
