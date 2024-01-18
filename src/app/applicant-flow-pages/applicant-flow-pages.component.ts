import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProgressBarStepsComponent } from '../components/progress-bar-steps/progress-bar-steps.component';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { CollaborateComponent } from './collaborate/collaborate.component';
import { GeneralDetailsComponent } from './general-details/general-details.component';

@Component({
  selector: 'app-applicant-flow-pages',
  standalone: true,
  imports: [
    ProgressBarStepsComponent,
    CollaborateComponent,
    ReactiveFormsModule,
    GeneralDetailsComponent,
  ],
  templateUrl: './applicant-flow-pages.component.html',
  styleUrl: './applicant-flow-pages.component.scss',
})
export class ApplicantFlowPagesComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);

  protected collaborationFiles: FileList;

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
      }),
    });
  }

  handleFilesChanged(files: FileList) {
    this.collaborationFiles = files;
  }

  submitForm() {
    console.log('===SUBMIT this.form', this.form);
    const formData = new FormData();
    for (let i = 0; i < this.collaborationFiles.length; i++) {
      formData.append('files', this.collaborationFiles[i]);
    }
    formData.append('form', JSON.stringify(this.form.value));
    this.projectService.addProject(formData).subscribe((result) => {
      console.log('===result', result);
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
