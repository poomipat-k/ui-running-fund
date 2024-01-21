import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
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
export class ApplicantFlowPagesComponent implements OnInit, OnDestroy {
  @ViewChild('collaborateComponent') collaborateComponent: CollaborateComponent;
  @ViewChild('generalDetailsComponent')
  generalDetailsComponent: GeneralDetailsComponent;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);

  private readonly subs: Subscription[];

  protected collaborationFiles: FileList | null;

  protected collaborationUploadButtonTouched = false;

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

  get collaborationFileNames(): string[] {
    const names: string[] = [];
    if (this.collaborationFiles) {
      for (let i = 0; i < this.collaborationFiles.length; i++) {
        if (
          this.collaborationFiles.item(i) &&
          this.collaborationFiles.item(i)?.name?.length
        ) {
          names.push(this.collaborationFiles.item(i)!.name);
        }
      }
      return names;
    }
    return [];
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);

    this.initForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm() {
    this.form = new FormGroup({
      collaborated: new FormControl(null, Validators.required),
      general: new FormGroup({
        // Order as UI layout to scroll to error correctly
        projectName: new FormControl(null, Validators.required),
        eventDate: new FormGroup({
          year: new FormControl(null, Validators.required),
          month: new FormControl(null, Validators.required),
          day: new FormControl(null, Validators.required),
          fromHour: new FormControl(null, Validators.required),
          fromMinute: new FormControl(null, Validators.required),
          toHour: new FormControl(null, Validators.required),
          toMinute: new FormControl(null, Validators.required),
        }),
        startPoint: new FormControl(null, Validators.required),
        finishPoint: new FormControl(null, Validators.required),
        expectedParticipants: new FormControl(null, Validators.required),
        hasOrganizer: new FormControl(null, Validators.required),
      }),
    });

    this.currentStep = 1;
  }

  protected nextPage(): void {
    console.log('===nextPage', this.form);
    this.collaborationUploadButtonTouched = true;
    if (this.currentStep === this.progressBarSteps.length) {
      this.submitForm();
      return;
    }

    if (this.currentStep === 0 && this.collaborateComponent.validToGoNext()) {
      this.currentStep++;
    } else if (
      this.currentStep === 1 &&
      this.generalDetailsComponent.validToGoNext()
    ) {
      this.currentStep++;
    } else if (this.currentStep === 2) {
      this.currentStep++;
    } else if (this.currentStep === 3) {
      this.currentStep++;
    } else if (this.currentStep === 4) {
      this.currentStep++;
    }
  }

  handleFilesChanged(files: FileList) {
    this.collaborationFiles = files;
  }

  clearSelectedFiles() {
    this.collaborationFiles = null;
  }

  submitForm() {
    console.log('===SUBMIT this.form', this.form);
    const formData = new FormData();
    if (this.collaborationFiles) {
      for (let i = 0; i < this.collaborationFiles.length; i++) {
        formData.append('files', this.collaborationFiles[i]);
      }
    }
    formData.append('form', JSON.stringify(this.form.value));
    this.subs.push(
      this.projectService.addProject(formData).subscribe((result) => {
        console.log('===result', result);
      })
    );
  }

  reduceStep() {
    this.currentStep -= 1;
  }
}
