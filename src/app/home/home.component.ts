import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FaqComponent } from '../components/faq/faq.component';
import { DashboardApplicantComponent } from '../dashboard-applicant/dashboard-applicant.component';
import { DashboardReviewerComponent } from '../dashboard-reviewer/dashboard-reviewer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DashboardApplicantComponent,
    DashboardReviewerComponent,
    FaqComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
