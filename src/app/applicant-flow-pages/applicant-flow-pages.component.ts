import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProgressBarStepsComponent } from '../components/progress-bar-steps/progress-bar-steps.component';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { CollaborateComponent } from './collaborate/collaborate.component';

@Component({
  selector: 'app-applicant-flow-pages',
  standalone: true,
  imports: [
    ProgressBarStepsComponent,
    CollaborateComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './applicant-flow-pages.component.html',
  styleUrl: './applicant-flow-pages.component.scss',
})
export class ApplicantFlowPagesComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);

  protected form: FormGroup;
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

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);

    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      collaboration: new FormGroup({
        collaborated: new FormControl(null, Validators.required),
        collaborateFiles: new FormControl(null),
      }),
    });
  }

  addStep() {
    this.currentStep += 1;
    console.log('===this.form', this.form);
  }

  reduceStep() {
    this.currentStep -= 1;
  }
}
