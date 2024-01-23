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
import { requiredCheckBoxToBeCheckedValidator } from '../shared/validators/requiredCheckbox';
import { CollaborateComponent } from './collaborate/collaborate.component';
import { ContactComponent } from './contact/contact.component';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { PlanAndDetailsComponent } from './plan-and-details/plan-and-details.component';

@Component({
  selector: 'app-applicant-flow-pages',
  standalone: true,
  imports: [
    ProgressBarStepsComponent,
    CollaborateComponent,
    ReactiveFormsModule,
    GeneralDetailsComponent,
    ContactComponent,
    PlanAndDetailsComponent,
  ],
  templateUrl: './applicant-flow-pages.component.html',
  styleUrl: './applicant-flow-pages.component.scss',
})
export class ApplicantFlowPagesComponent implements OnInit, OnDestroy {
  @ViewChild('collaborateComponent') collaborateComponent: CollaborateComponent;
  @ViewChild('generalDetailsComponent')
  generalDetailsComponent: GeneralDetailsComponent;
  @ViewChild('contactComponent') contactComponent: ContactComponent;
  @ViewChild('planAndDetails') planAndDetailsComponent: PlanAndDetailsComponent;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);

  private readonly subs: Subscription[] = [];

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
    this.currentStep = 3;
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
        address: new FormGroup({
          address: new FormControl(null, Validators.required),
          provinceId: new FormControl(null, Validators.required),
          districtId: new FormControl(null, Validators.required),
          subdistrictId: new FormControl(null, Validators.required),
        }),
        startPoint: new FormControl(null, Validators.required),
        finishPoint: new FormControl(null, Validators.required),
        expectedParticipants: new FormControl(null, Validators.required),
        hasOrganizer: new FormControl(null, Validators.required),
      }),
      contact: new FormGroup({
        projectHead: new FormGroup({
          prefix: new FormControl(null, Validators.required),
          firstName: new FormControl(null, Validators.required),
          lastName: new FormControl(null, Validators.required),
          organizationPosition: new FormControl(null, Validators.required),
          eventPosition: new FormControl(null, Validators.required),
        }),
        projectManager: new FormGroup({
          sameAsProjectHead: new FormControl(false),
          prefix: new FormControl(null, Validators.required),
          firstName: new FormControl(null, Validators.required),
          lastName: new FormControl(null, Validators.required),
          organizationPosition: new FormControl(null, Validators.required),
          eventPosition: new FormControl(null, Validators.required),
        }),
        projectCoordinator: new FormGroup({
          sameAsProjectHead: new FormControl(false),
          sameAsProjectManager: new FormControl(false),
          prefix: new FormControl(null, Validators.required),
          firstName: new FormControl(null, Validators.required),
          lastName: new FormControl(null, Validators.required),
          organizationPosition: new FormControl(null, Validators.required),
          eventPosition: new FormControl(null, Validators.required),
          address: new FormControl(null, Validators.required),
          email: new FormControl(null, [Validators.required, Validators.email]),
          phoneNumber: new FormControl(null, [
            Validators.required,
            // Allow only number len >= 9
            Validators.pattern('[0-9]{9,}'),
          ]),
        }),
        organization: new FormGroup({
          type: new FormControl(null, Validators.required),
          name: new FormControl(null, Validators.required),
        }),
      }),
      details: new FormGroup({
        background: new FormControl(null, Validators.required),
        emergencyContact: new FormGroup({
          prefix: new FormControl(null, Validators.required),
          firstName: new FormControl(null, Validators.required),
          lastName: new FormControl(null, Validators.required),
          eventPosition: new FormControl(null, Validators.required),
        }),
        route: new FormGroup({
          measurement: new FormGroup(
            {
              athleticsAssociation: new FormControl(false),
              calibratedBicycle: new FormControl(false),
              selfMeasurement: new FormControl(false),
            },
            requiredCheckBoxToBeCheckedValidator()
          ),
          // conditional measurement tools field
          // tool: new FormControl(null, Validators.required)
          trafficManagement: new FormGroup(
            {
              hasSupporter: new FormControl(false),
              roadClosure: new FormControl(false),
              signs: new FormControl(false),
              lighting: new FormControl(false),
            },
            requiredCheckBoxToBeCheckedValidator()
          ),
        }),
      }),
    });
  }

  protected nextPage(): void {
    this.collaborationUploadButtonTouched = true;
    if (this.currentStep === this.progressBarSteps.length) {
      this.submitForm();
      console.log('===nextPage', this.form);
      return;
    }

    if (this.currentStep === 0 && this.collaborateComponent.validToGoNext()) {
      console.log('===nextPage', this.form);
      this.currentStep++;
    } else if (
      this.currentStep === 1 &&
      this.generalDetailsComponent.validToGoNext()
    ) {
      console.log('===nextPage', this.form);
      this.currentStep++;
    } else if (
      this.currentStep === 2 &&
      this.contactComponent.validToGoNext()
    ) {
      console.log('===nextPage', this.form);
      this.currentStep++;
    } else if (
      this.currentStep === 3 &&
      this.planAndDetailsComponent.validToGoNext()
    ) {
      console.log('===nextPage', this.form);
      this.currentStep++;
    } else if (this.currentStep === 4) {
      console.log('===nextPage', this.form);
      this.currentStep++;
    } else {
      console.log('==error form', this.form);
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
