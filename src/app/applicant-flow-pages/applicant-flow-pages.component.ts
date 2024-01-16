import { Component, OnInit, inject } from '@angular/core';
import { ProgressBarStepsComponent } from '../components/progress-bar-steps/progress-bar-steps.component';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { CollaborateComponent } from './collaborate/collaborate.component';

@Component({
  selector: 'app-applicant-flow-pages',
  standalone: true,
  imports: [ProgressBarStepsComponent, CollaborateComponent],
  templateUrl: './applicant-flow-pages.component.html',
  styleUrl: './applicant-flow-pages.component.scss',
})
export class ApplicantFlowPagesComponent implements OnInit {
  protected progressBarSteps = [
    ['ข้อมูลพื้นฐานโครงการ'],
    ['ข้อมูลการติดต่อ'],
    ['ข้อมูลข้อเสนอโครงการ', 'และแผนบริหารจัดการ'],
    ['ประสบการณ์', 'ดำเนินการโครงการ'],
    ['ความต้องการ', 'ขอรับการสนับสนุน'],
    ['เอกสารแนบเพิ่มเติม', '(ถ้ามี)'],
    ['ยืนยัน'],
  ];

  private readonly themeService: ThemeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
  }

  protected currentStep = 0;

  addStep() {
    this.currentStep += 1;
  }

  reduceStep() {
    this.currentStep -= 1;
  }
}
