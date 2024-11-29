import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
import { ErrorPopupComponent } from '../components/error-popup/error-popup.component';
import { ProgressBarStepsComponent } from '../components/progress-bar-steps/progress-bar-steps.component';
import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';
import { ArrowForwardComponent } from '../components/svg/arrow-forward/arrow-forward.component';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { ApplicantCriteria } from '../shared/models/applicant-criteria';
import { requiredCheckBoxToBeCheckedValidator } from '../shared/validators/requiredCheckbox';
import { requiredCheckBoxFormArrayToBeCheckedValidator } from '../shared/validators/requiredCheckboxFormArray';
import { AttachmentComponent } from './attachment/attachment.component';
import { CollaborateComponent } from './collaborate/collaborate.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ContactComponent } from './contact/contact.component';
import { ExperienceComponent } from './experience/experience.component';
import { FundRequestComponent } from './fund-request/fund-request.component';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { PlanAndDetailsComponent } from './plan-and-details/plan-and-details.component';
import { SuccessComponent } from './success/success.component';

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
    ArrowForwardComponent,
    SuccessComponent,
    SuccessPopupComponent,
    ErrorPopupComponent,
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
  @ViewChild('fundRequestComponent') fundRequestComponent: FundRequestComponent;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly dateService: DateService = inject(DateService);

  private readonly subs: Subscription[] = [];
  private router: Router = inject(Router);

  private readonly minHistoryYear = 1957;

  // Files upload variables
  protected collaborationFiles: File[] = [];
  protected collaborationFilesSubject = new BehaviorSubject<File[]>([]);

  protected marketingFiles: File[] = [];
  protected marketingFilesSubject = new BehaviorSubject<File[]>([]);

  protected routeFiles: File[] = [];
  protected routeFilesSubject = new BehaviorSubject<File[]>([]);

  protected eventMapFiles: File[] = [];
  protected eventMapFilesSubject = new BehaviorSubject<File[]>([]);

  protected eventDetailsFiles: File[] = [];
  protected eventDetailsFilesSubject = new BehaviorSubject<File[]>([]);

  protected etcFiles: File[] = [];
  protected etcFilesSubject = new BehaviorSubject<File[]>([]);

  // Files upload end

  protected collaborationUploadButtonTouched = false;
  protected marketingUploadButtonTouched = false;
  protected routeUploadButtonTouched = false;
  protected eventMapUploadButtonTouched = false;
  protected eventDetailsUploadButtonTouched = false;
  protected etcUploadButtonTouched = false;

  protected showSuccessPopup = false;
  protected showErrorPopup = false;
  protected errorPopupText = 'ส่งข้อเสนอโครงการไม่สำเร็จ โปรดลองอีกครั้ง';

  protected apiLoading = false;

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
  protected devModeOn = true;

  constructor() {
    this.incrementStep = this.incrementStep.bind(this);
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);

    this.initForm();
    this.loadApplicantSelfScoreCriteria();
    // Change page
    // TODO: comment this line
    // this.currentStep = 4;
    this.devModeOn = !environment.production;

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

    this.subs.push(
      this.etcFilesSubject.subscribe((files) => {
        this.etcFiles = files;
      })
    );
  }

  private initForm() {
    const currentYear = this.dateService.getCurrentYear();
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
          postcodeId: new FormControl(null, Validators.required),
        }),
        startPoint: new FormControl(null, Validators.required),
        finishPoint: new FormControl(null, Validators.required),
        // 1.5
        eventDetails: new FormGroup({
          category: new FormGroup({
            available: new FormGroup(
              {
                roadRace: new FormControl(false),
                trailRunning: new FormControl(false),
                other: new FormControl(false),
              },
              requiredCheckBoxToBeCheckedValidator()
            ),
            // otherType: new FormControl(null, Validators.required)s
          }),
          distanceAndFee: new FormArray(
            [
              new FormGroup({
                checked: new FormControl(false),
                dynamic: new FormControl(false),
                type: new FormControl('fun'),
                display: new FormControl('Fun run (ระยะทางไม่เกิน 10 km)'),
                fee: new FormControl(null),
              }),
              new FormGroup({
                checked: new FormControl(false),
                dynamic: new FormControl(false),
                type: new FormControl('mini'),
                display: new FormControl('Mini Marathon (ระยะทาง 10 km)'),
                fee: new FormControl(null),
              }),
              new FormGroup({
                checked: new FormControl(false),
                dynamic: new FormControl(false),
                type: new FormControl('half'),
                display: new FormControl('Half Marathon (ระยะทาง 21.1 km)'),
                fee: new FormControl(null),
              }),
              new FormGroup({
                checked: new FormControl(false),
                dynamic: new FormControl(false),
                type: new FormControl('full'),
                display: new FormControl('Marathon (ระยะทาง 42.195 km)'),
                fee: new FormControl(null),
              }),
              new FormGroup({
                checked: new FormControl(false),
                dynamic: new FormControl(true),
                type: new FormControl(null),
                display: new FormControl('อื่น ๆ (โปรดระบุ)'),
                fee: new FormControl(null),
              }),
            ],
            requiredCheckBoxFormArrayToBeCheckedValidator()
          ),
          vip: new FormControl(null, Validators.required),
          vipFee: new FormControl(
            {
              value: null,
              disabled: true,
            },
            [Validators.required, Validators.min(0)]
          ),
        }),
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
          address: new FormGroup({
            address: new FormControl(null, Validators.required),
            provinceId: new FormControl(null, Validators.required),
            districtId: new FormControl(null, Validators.required),
            subdistrictId: new FormControl(null, Validators.required),
            postcodeId: new FormControl(null, Validators.required),
          }),
          email: new FormControl(null, [Validators.required]),
          lineId: new FormControl(null, [Validators.required]),
          phoneNumber: new FormControl(null, [
            Validators.required,
            // Allow only number len >= 9
            Validators.pattern('[0-9]{9,}'),
          ]),
        }),
        projectManager: new FormGroup({
          sameAsProjectHead: new FormControl(false),
          prefix: new FormControl(null, Validators.required),
          firstName: new FormControl(null, Validators.required),
          lastName: new FormControl(null, Validators.required),
          organizationPosition: new FormControl(null, Validators.required),
          eventPosition: new FormControl(null, Validators.required),
          address: new FormGroup({
            address: new FormControl(null, Validators.required),
            provinceId: new FormControl(null, Validators.required),
            districtId: new FormControl(null, Validators.required),
            subdistrictId: new FormControl(null, Validators.required),
            postcodeId: new FormControl(null, Validators.required),
          }),
          email: new FormControl(null, [Validators.required]),
          lineId: new FormControl(null, [Validators.required]),
          phoneNumber: new FormControl(null, [
            Validators.required,
            // Allow only number len >= 9
            Validators.pattern('[0-9]{9,}'),
          ]),
        }),
        projectCoordinator: new FormGroup({
          sameAsProjectHead: new FormControl(false),
          sameAsProjectManager: new FormControl(false),
          prefix: new FormControl(null, Validators.required),
          firstName: new FormControl(null, Validators.required),
          lastName: new FormControl(null, Validators.required),
          organizationPosition: new FormControl(null, Validators.required),
          eventPosition: new FormControl(null, Validators.required),
          address: new FormGroup({
            address: new FormControl(null, Validators.required),
            provinceId: new FormControl(null, Validators.required),
            districtId: new FormControl(null, Validators.required),
            subdistrictId: new FormControl(null, Validators.required),
            postcodeId: new FormControl(null, Validators.required),
          }),
          email: new FormControl(null, [Validators.required]),
          lineId: new FormControl(null, [Validators.required]),
          phoneNumber: new FormControl(null, [
            Validators.required,
            // Allow only number len >= 9
            Validators.pattern('[0-9]{9,}'),
          ]),
        }),
        raceDirector: new FormGroup({
          who: new FormControl(null, Validators.required),
          // alternative formGroup
        }),
        organization: new FormGroup({
          type: new FormControl(null, Validators.required),
          name: new FormControl(null, Validators.required),
        }),
      }),
      details: new FormGroup({
        background: new FormControl(null, Validators.required),
        objective: new FormControl(null, Validators.required),
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
                pr: new FormControl(false),
                localOfficial: new FormControl(false),
                booth: new FormControl(false),
                billboard: new FormControl(false),
                tv: new FormControl(false),
                other: new FormControl(false),
              },
              requiredCheckBoxToBeCheckedValidator()
            ),
            // Conditionally set
            // addition: new FormControl(null),
          }),
        }),
        score: new FormGroup({}),
        safety: new FormGroup({
          ready: new FormGroup(
            {
              runnerInformation: new FormControl(false),
              healthDecider: new FormControl(false),
              ambulance: new FormControl(false),
              firstAid: new FormControl(false),
              aed: new FormControl(false),
              volunteerDoctor: new FormControl(false),
              insurance: new FormControl(false),
              other: new FormControl(false),
            },
            requiredCheckBoxToBeCheckedValidator()
          ),
          // Conditionally set
          // addition: new FormControl(null, Validators.required)
          // aedCount: new FormControl(null, Validators.required)
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
              askPermission: new FormControl(false),
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
        feedback: new FormControl(null, Validators.required),
      }),
      experience: new FormGroup({
        thisSeries: new FormGroup({
          firstTime: new FormControl(null, Validators.required),
          history: new FormGroup({
            ordinalNumber: new FormControl(null, [
              Validators.required,
              Validators.min(2),
            ]),
            year: new FormControl(null, [Validators.required]),
            month: new FormControl(null, Validators.required),
            day: new FormControl(null, Validators.required),
            completed1: new FormGroup({
              year: new FormControl(null, [
                Validators.required,
                Validators.max(currentYear + 543),
                Validators.min(this.minHistoryYear + 543),
              ]),
              participant: new FormControl(null, [
                Validators.required,
                Validators.min(0),
              ]),
            }),
            completed2: new FormGroup({
              year: new FormControl(null, [
                Validators.max(currentYear + 543),
                Validators.min(this.minHistoryYear + 543),
              ]),
              participant: new FormControl(null, [Validators.min(0)]),
            }),
            completed3: new FormGroup({
              year: new FormControl(null, [
                Validators.max(currentYear + 543),
                Validators.min(this.minHistoryYear + 543),
              ]),
              participant: new FormControl(null, [Validators.min(0)]),
            }),
          }),
        }),
        otherSeries: new FormGroup({
          doneBefore: new FormControl(null, Validators.required),
          history: new FormGroup({
            completed1: new FormGroup({
              year: new FormControl(null, [
                Validators.required,
                Validators.max(currentYear + 543),
                Validators.min(this.minHistoryYear + 543),
              ]),
              name: new FormControl(null, Validators.required),
              participant: new FormControl(null, [
                Validators.required,
                Validators.min(0),
              ]),
            }),
            completed2: new FormGroup({
              year: new FormControl(null, [
                Validators.max(currentYear + 543),
                Validators.min(this.minHistoryYear + 543),
              ]),
              name: new FormControl(null),
              participant: new FormControl(null, [Validators.min(0)]),
            }),
            completed3: new FormGroup({
              year: new FormControl(null, [
                Validators.max(currentYear + 543),
                Validators.min(this.minHistoryYear + 543),
              ]),
              name: new FormControl(null),
              participant: new FormControl(null, [Validators.min(0)]),
            }),
          }),
        }),
      }),
      fund: new FormGroup({
        budget: new FormGroup({
          total: new FormControl(null, [
            Validators.required,
            Validators.min(0),
          ]),
          supportOrganization: new FormControl(null, Validators.required),
          noAlcoholSponsor: new FormControl(false, Validators.requiredTrue),
        }),
        request: new FormGroup({
          type: new FormGroup(
            {
              fund: new FormControl(false),
              bib: new FormControl(false),
              pr: new FormControl(false),
              seminar: new FormControl(false),
              other: new FormControl(false),
            },
            requiredCheckBoxToBeCheckedValidator()
          ),
          details: new FormGroup({
            // fundAmount: new FormControl(null, Validators.required),
            // bibAmount: new FormControl(null, Validators.required),
            // seminar: new FormControl(null, Validators.required),
            // other: new FormControl(null, Validators.required),
          }),
        }),
      }),
    });
  }

  protected nextPage(): void {
    this.collaborationUploadButtonTouched = true;
    if (this.currentStep >= 6) {
      this.marketingUploadButtonTouched = true;
      this.routeUploadButtonTouched = true;
      this.eventMapUploadButtonTouched = true;
      this.eventDetailsUploadButtonTouched = true;
    }

    if (this.currentStep === this.progressBarSteps.length) {
      if (this.form.valid && !this.form.disabled) {
        this.submitForm();
      } else {
        console.error('FORM IS NOT VALID!');
      }
      return;
    }

    if (this.currentStep === 0 && this.collaborateComponent.validToGoNext()) {
      this.incrementStep();
    } else if (
      this.currentStep === 1 &&
      this.generalDetailsComponent.validToGoNext()
    ) {
      this.incrementStep();
    } else if (
      this.currentStep === 2 &&
      this.contactComponent.validToGoNext()
    ) {
      this.incrementStep();
    } else if (
      this.currentStep === 3 &&
      this.planAndDetailsComponent.validToGoNext()
    ) {
      this.incrementStep();
    } else if (
      this.currentStep === 4 &&
      this.experienceComponent.validToGoNext()
    ) {
      this.incrementStep();
    } else if (
      this.currentStep === 5 &&
      this.fundRequestComponent.validToGoNext()
    ) {
      this.incrementStep();
    } else if (
      this.currentStep === 6 &&
      this.attachmentComponent.validToGoNext()
    ) {
      this.incrementStep();
    } else {
      console.error('form is not valid, form:', this.form);
    }
  }

  clearSelectedFiles() {
    this.collaborationFiles = [];
    this.collaborationFilesSubject.next([]);
  }

  private getSubmitFormData() {
    const data = cloneDeep(this.form.value);
    const thisHistory = data.experience.thisSeries?.history;
    const otherHistory = data.experience.otherSeries?.history;
    if (thisHistory?.completed1?.year) {
      thisHistory.completed1.year = thisHistory.completed1.year - 543;
    }
    if (thisHistory?.completed2?.year) {
      thisHistory.completed2.year = thisHistory.completed2.year - 543;
    }
    if (thisHistory?.completed3?.year) {
      thisHistory.completed3.year = thisHistory.completed3.year - 543;
    }
    if (otherHistory?.completed1?.year) {
      otherHistory.completed1.year = otherHistory.completed1.year - 543;
    }
    if (otherHistory?.completed2?.year) {
      otherHistory.completed2.year = otherHistory.completed2.year - 543;
    }
    if (otherHistory?.completed3?.year) {
      otherHistory.completed3.year = otherHistory.completed3.year - 543;
    }
    return data;
  }

  submitForm() {
    this.apiLoading = true;
    const formData = new FormData();
    if (this.collaborationFiles) {
      for (let i = 0; i < this.collaborationFiles.length; i++) {
        formData.append('collaborationFiles', this.collaborationFiles[i]);
      }
    }
    if (this.marketingFiles) {
      for (let i = 0; i < this.marketingFiles.length; i++) {
        formData.append('marketingFiles', this.marketingFiles[i]);
      }
    }
    if (this.routeFiles) {
      for (let i = 0; i < this.routeFiles.length; i++) {
        formData.append('routeFiles', this.routeFiles[i]);
      }
    }
    if (this.eventMapFiles) {
      for (let i = 0; i < this.eventMapFiles.length; i++) {
        formData.append('eventMapFiles', this.eventMapFiles[i]);
      }
    }
    if (this.eventDetailsFiles) {
      for (let i = 0; i < this.eventDetailsFiles.length; i++) {
        formData.append('eventDetailsFiles', this.eventDetailsFiles[i]);
      }
    }
    if (this.etcFiles) {
      for (let i = 0; i < this.etcFiles.length; i++) {
        formData.append('etcFiles', this.etcFiles[i]);
      }
    }

    formData.append('form', JSON.stringify(this.getSubmitFormData()));
    // upload snapshots
    this.subs.push(
      this.projectService.addProject(formData).subscribe({
        next: (result) => {
          this.apiLoading = false;
          if (result) {
            // TODO: uncomment this
            this.form.disable();
            this.showSuccessPopup = true;
            setTimeout(() => {
              this.showSuccessPopup = false;
              // TODO: uncomment this
              this.incrementStep();
            }, 2000);
          }
        },
        error: (err) => {
          console.error('submit error:', err);
          this.apiLoading = false;
          this.showErrorPopup = true;

          setTimeout(() => {
            this.showErrorPopup = false;
            this.errorPopupText = 'ส่งข้อเสนอโครงการไม่สำเร็จ โปรดลองอีกครั้ง';
          }, 2000);
        },
        complete: () => {
          this.apiLoading = false;
        },
      })
    );
  }

  prevPage() {
    if (this.currentStep > 0) {
      this.currentStep -= 1;
      return;
    }
    this.router.navigate(['/dashboard']);
  }

  protected redirectToHomePage(): void {
    this.router.navigate(['/dashboard']);
  }

  private loadApplicantSelfScoreCriteria() {
    this.subs.push(
      this.projectService.getApplicantCriteria(1).subscribe((criteria) => {
        if (criteria) {
          this.addApplicantSelfScoreFormGroup(criteria);
          this.applicantSelfScoreCriteria = criteria;
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

  private incrementStep(): void {
    this.currentStep += 1;
  }
}
