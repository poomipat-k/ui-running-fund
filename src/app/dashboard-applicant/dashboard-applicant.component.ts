import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-applicant',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-applicant.component.html',
  styleUrl: './dashboard-applicant.component.scss',
})
export class DashboardApplicantComponent {
  router: Router = inject(Router);

  onCreateProjectClicked() {
    this.router.navigate(['/proposal/create']);
  }
}
