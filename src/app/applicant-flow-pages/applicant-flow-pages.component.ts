import { Component } from '@angular/core';
import { ProgressBarStepsComponent } from '../components/progress-bar-steps/progress-bar-steps.component';

@Component({
  selector: 'app-applicant-flow-pages',
  standalone: true,
  imports: [ProgressBarStepsComponent],
  templateUrl: './applicant-flow-pages.component.html',
  styleUrl: './applicant-flow-pages.component.scss',
})
export class ApplicantFlowPagesComponent {
  protected progressBarSteps = [
    ['ข้อมูลพื้นฐานโครงการ'],
    ['ข้อมูลการติดต่อ'],
    ['ข้อมูลข้อเสนอโครงการ', 'และแผนบริหารจัดการ'],
    ['ประสบการณ์', 'ดำเนินการโครงการ'],
    ['ความต้องการ', 'ขอรับการสนับสนุน'],
    ['เอกสารแนบเพิ่มเติม', '(ถ้ามี)'],
    ['ยืนยัน'],
  ];

  protected currentStep = 0;

  addStep() {
    this.currentStep += 1;
  }

  reduceStep() {
    this.currentStep -= 1;
  }
}
