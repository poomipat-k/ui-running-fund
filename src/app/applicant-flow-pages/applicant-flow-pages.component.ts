import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProgressBarStepsComponent } from '../components/progress-bar-steps/progress-bar-steps.component';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { ApplicantCriteria } from '../shared/models/applicant-criteria';
import { requiredCheckBoxToBeCheckedValidator } from '../shared/validators/requiredCheckbox';
import { AttachmentComponent } from './attachment/attachment.component';
import { CollaborateComponent } from './collaborate/collaborate.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ContactComponent } from './contact/contact.component';
import { ExperienceComponent } from './experience/experience.component';
import { FundRequestComponent } from './fund-request/fund-request.component';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { PlanAndDetailsComponent } from './plan-and-details/plan-and-details.component';

@Component({
  selector: 'app-applicant-flow-pages',
  standalone: true,
  imports: [
    CommonModule,
    ProgressBarStepsComponent,
    CollaborateComponent,
    ReactiveFormsModule,
    GeneralDetailsComponent,
    ContactComponent,
    PlanAndDetailsComponent,
    ExperienceComponent,
    FundRequestComponent,
    AttachmentComponent,
    ConfirmationComponent,
  ],
  templateUrl: './applicant-flow-pages.component.html',
  styleUrl: './applicant-flow-pages.component.scss',
})
export class ApplicantFlowPagesComponent implements OnInit, OnDestroy {
  @ViewChild('collaborateComponent') collaborateComponent: CollaborateComponent;
  @ViewChild('generalDetailsComponent')
  generalDetailsComponent: GeneralDetailsComponent;
  @ViewChild('contactComponent') contactComponent: ContactComponent;
  @ViewChild('planAndDetailsComponent')
  planAndDetailsComponent: PlanAndDetailsComponent;
  @ViewChild('experienceComponent') experienceComponent: ExperienceComponent;
  @ViewChild('attachmentComponent') attachmentComponent: AttachmentComponent;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);

  private readonly subs: Subscription[] = [];

  // Files upload variables
  protected collaborationFiles: File[] = [];
  protected collaborationFilesSubject = new BehaviorSubject<File[]>([]);

  protected proposalFiles: File[] = [];
  protected proposalFilesSubject = new BehaviorSubject<File[]>([]);

  protected marketingFiles: File[] = [];
  protected marketingFilesSubject = new BehaviorSubject<File[]>([]);

  protected routeFiles: File[] = [];
  protected routeFilesSubject = new BehaviorSubject<File[]>([]);

  protected eventMapFiles: File[] = [];
  protected eventMapFilesSubject = new BehaviorSubject<File[]>([]);

  protected eventDetailsFiles: File[] = [];
  protected eventDetailsFilesSubject = new BehaviorSubject<File[]>([]);

  // Files upload end

  protected collaborationUploadButtonTouched = false;
  protected proposalUploadButtonTouched = false;
  protected marketingUploadButtonTouched = false;
  protected routeUploadButtonTouched = false;
  protected eventMapUploadButtonTouched = false;

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

  protected applicantSelfScoreCriteria: ApplicantCriteria[] = [];

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);

    this.initForm();
    this.loadApplicantSelfScoreCriteria();
    this.currentStep = 0;

    this.subToUploadFileSubjects();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private subToUploadFileSubjects() {
    this.subs.push(
      this.collaborationFilesSubject.subscribe((files) => {
        this.collaborationFiles = files;
      })
    );

    this.subs.push(
      this.proposalFilesSubject.subscribe((files) => {
        this.proposalFiles = files;
      })
    );

    this.subs.push(
      this.marketingFilesSubject.subscribe((files) => {
        this.marketingFiles = files;
      })
    );

    this.subs.push(
      this.routeFilesSubject.subscribe((files) => {
        this.routeFiles = files;
      })
    );

    this.subs.push(
      this.eventMapFilesSubject.subscribe((files) => {
        this.eventMapFiles = files;
      })
    );

    this.subs.push(
      this.eventDetailsFilesSubject.subscribe((files) => {
        this.eventDetailsFiles = files;
      })
    );
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
        judge: new FormGroup({
          type: new FormControl(null, Validators.required),
          // Conditionally set
          // otherType: new FormControl(null, Validators.required),
        }),
        safety: new FormGroup({
          ready: new FormGroup(
            {
              runnerInformation: new FormControl(false),
              healthDecider: new FormControl(false),
              ambulance: new FormControl(false),
              firstAid: new FormControl(false),
              aed: new FormControl(false),
              insurance: new FormControl(false),
              other: new FormControl(false),
            },
            requiredCheckBoxToBeCheckedValidator()
          ),
          // Conditionally set
          // addition: new FormControl(null, Validators.required)
        }),
        support: new FormGroup({
          organization: new FormGroup(
            {
              provincialAdministration: new FormControl(false),
              safety: new FormControl(false),
              health: new FormControl(false),
              volunteer: new FormControl(false),
              community: new FormControl(false),
              other: new FormControl(false),
            },
            requiredCheckBoxToBeCheckedValidator()
          ),
          // Conditionally set
          // addition: new FormControl(null, Validators.required)
        }),
        marketing: new FormGroup({
          online: new FormGroup({
            available: new FormGroup(
              {
                facebook: new FormControl(false),
                website: new FormControl(false),
                onlinePage: new FormControl(false),
                other: new FormControl(false),
              },
              requiredCheckBoxToBeCheckedValidator()
            ),
            howTo: new FormGroup({}),
          }),

          offline: new FormGroup({
            available: new FormGroup(
              {
                booth: new FormControl(false),
                billboard: new FormControl(false),
                local: new FormControl(false),
                other: new FormControl(false),
              },
              requiredCheckBoxToBeCheckedValidator()
            ),
            // Conditionally set
            // addition: new FormControl(null),
          }),
        }),
        score: new FormGroup({}),
        feedback: new FormControl(null, Validators.required),
      }),
      experience: new FormGroup({
        thisSeries: new FormGroup({
          firstTime: new FormControl(null, Validators.required),
          // FormGroup conditionally added if doneBefore is true
        }),
        otherSeries: new FormGroup({
          doneBefore: new FormControl(null, Validators.required),
          // FormGroup conditionally added if doneBefore is true
        }),
      }),

      // Section 6
    });
  }

  protected nextPage(): void {
    this.collaborationUploadButtonTouched = true;
    this.proposalUploadButtonTouched = true;
    this.marketingUploadButtonTouched = true;
    this.routeUploadButtonTouched = true;
    this.eventMapUploadButtonTouched = true;

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
    } else if (
      this.currentStep === 4
      // this.experienceComponent.validToGoNext()
    ) {
      console.log('===nextPage', this.form);
      this.currentStep++;
    } else if (this.currentStep === 5) {
      console.log('===nextPage', this.form);
      this.currentStep++;
    } else if (
      this.currentStep === 6 &&
      this.attachmentComponent.validToGoNext()
    ) {
      console.log('===nextPage', this.form);
      this.currentStep++;
    } else {
      console.log('==error form', this.form);
    }
  }

  clearSelectedFiles() {
    this.collaborationFiles = [];
  }

  submitForm() {
    console.log('===SUBMIT this.form', this.form);
    const formData = new FormData();
    if (this.collaborationFiles) {
      for (let i = 0; i < this.collaborationFiles.length; i++) {
        // to change "files" to "collaborationFiles"
        formData.append('collaborationFiles', this.collaborationFiles[i]);
      }
    }
    if (this.proposalFiles) {
      for (let i = 0; i < this.proposalFiles.length; i++) {
        formData.append('files', this.proposalFiles[i]);
      }
    }
    if (this.marketingFiles) {
      for (let i = 0; i < this.marketingFiles.length; i++) {
        formData.append('files', this.marketingFiles[i]);
      }
    }
    if (this.routeFiles) {
      for (let i = 0; i < this.routeFiles.length; i++) {
        formData.append('files', this.routeFiles[i]);
      }
    }
    if (this.eventMapFiles) {
      for (let i = 0; i < this.eventMapFiles.length; i++) {
        formData.append('files', this.eventMapFiles[i]);
      }
    }
    if (this.eventDetailsFiles) {
      for (let i = 0; i < this.eventDetailsFiles.length; i++) {
        formData.append('files', this.eventDetailsFiles[i]);
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
    if (this.currentStep > 0) {
      this.currentStep -= 1;
    }
  }

  private loadApplicantSelfScoreCriteria() {
    this.subs.push(
      this.projectService.getApplicantCriteria(1).subscribe((criteria) => {
        if (criteria) {
          this.addApplicantSelfScoreFormGroup(criteria);
          this.applicantSelfScoreCriteria = criteria;
          console.log('==load form', this.form);
        }
      })
    );
  }

  private addApplicantSelfScoreFormGroup(criteria: ApplicantCriteria[]) {
    if (criteria) {
      const group = this.form.get('details.score') as FormGroup;
      criteria.forEach((c) => {
        group.addControl(
          `q_${c.criteriaVersion}_${c.orderNumber}`,
          new FormControl(null, Validators.required)
        );
      });
    }
  }
}
