import { Component } from '@angular/core';
import { ProgressBarStepsComponent } from '../components/progress-bar-steps/progress-bar-steps.component';

@Component({
  selector: 'app-applicant-flow-pages',
  standalone: true,
  imports: [ProgressBarStepsComponent],
  templateUrl: './applicant-flow-pages.component.html',
  styleUrl: './applicant-flow-pages.component.scss',
})
export class ApplicantFlowPagesComponent {}
