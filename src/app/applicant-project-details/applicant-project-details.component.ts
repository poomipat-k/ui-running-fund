import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Subscription, concatMap } from 'rxjs';

import { CommonModule, ViewportScroller } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { environment } from '../../environments/environment';
import { ButtonComponent } from '../components/button/button/button.component';
import { ErrorPopupComponent } from '../components/error-popup/error-popup.component';
import { InputNumberComponent } from '../components/input-number/input-number.component';
import { RadioComponent } from '../components/radio/radio.component';
import { SelectDropdownTemplateComponent } from '../components/select-dropdown-template/select-dropdown-template.component';
import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';
import { TableCellTemplateComponent } from '../components/table-cell-template/table-cell-template.component';
import { TextareaComponent } from '../components/textarea/textarea.component';
import { UploadButtonComponent } from '../components/upload-button/upload-button.component';
import { ProjectService } from '../services/project.service';
import { S3Service } from '../services/s3.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { STATUS_ORDER } from '../shared/constants/status-order';
import { BackgroundColor } from '../shared/enums/background-color';
import { ColumnTypeEnum } from '../shared/enums/column-type';
import { ApplicantDetailsItem } from '../shared/models/applicant-details-item';
import { RadioOption } from '../shared/models/radio-option';
import { S3ObjectMetadata } from '../shared/models/s3-object-metadata';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-applicant-project-details',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    TableCellTemplateComponent,
    UploadButtonComponent,
    SuccessPopupComponent,
    ErrorPopupComponent,
    RouterModule,
    RadioComponent,
    SelectDropdownTemplateComponent,
    InputNumberComponent,
    TextareaComponent,
  ],
  templateUrl: './applicant-project-details.component.html',
  styleUrl: './applicant-project-details.component.scss',
})
export class ApplicantProjectDetailsComponent implements OnInit, OnDestroy {
  // url params
  @Input() projectCode: string;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  protected enableScroll = true;
  protected formTouched = false;

  protected currentUser: User;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly s3Service: S3Service = inject(S3Service);
  private readonly router: Router = inject(Router);
  private readonly userService: UserService = inject(UserService);
  private readonly subs: Subscription[] = [];

  protected form: FormGroup;

  protected showSuccessPopup = false;
  protected showErrorPopup = false;

  private numberFormatter = Intl.NumberFormat();

  protected data: ApplicantDetailsItem[] = [];

  protected additionFiles: File[] = [];
  protected etcFiles: File[] = [];
  protected additionFilesSubject = new BehaviorSubject<File[]>([]);
  protected etcFilesSubject = new BehaviorSubject<File[]>([]);

  protected applicantEditMode = false;
  protected adminEditMode = false;

  protected pathDisplay = '';
  protected downloadButtonAction = '';
  protected reportTemplateUrl = environment.exampleFiles.reportTemplate;

  protected statusCellType = ColumnTypeEnum.Badge;
  protected s3ObjectItems: {
    collaboration: S3ObjectMetadata[];
    marketing: S3ObjectMetadata[];
    route: S3ObjectMetadata[];
    eventMap: S3ObjectMetadata[];
    eventDetails: S3ObjectMetadata[];
    // additional files
    addition: S3ObjectMetadata[];
    // etc files
    etc: S3ObjectMetadata[];
    // to satisfy ts in .html file
    [key: string]: S3ObjectMetadata[];
  } = {
    collaboration: [],
    marketing: [],
    route: [],
    eventMap: [],
    eventDetails: [],
    addition: [],
    etc: [],
  };

  protected projectStatusSecondaryOptions: RadioOption[] = [
    {
      id: 1,
      value: 'standard__Reviewing',
      display: 'Reviewing',
    },
    {
      id: 2,
      value: 'standard__Reviewed',
      display: 'Reviewed',
    },
    {
      id: 3,
      value: 'standard__Revise',
      display: 'Revised',
    },
    {
      id: 4,
      value: 'standard__NotApproved',
      display: 'NotApproved',
    },
    {
      id: 5,
      value: 'standard__Approved',
      display: 'Approved',
    },
    {
      id: 6,
      value: 'standard__Start',
      display: 'Start',
    },
    {
      id: 7,
      value: 'standard__Completed',
      display: 'Completed',
    },
  ];

  protected projectStatusPrimaryOptions: RadioOption[] = [
    { id: 1, value: 'CurrentBeforeApprove', display: 'อยู่ในขั้นพิจารณา' },
    { id: 2, value: 'Approved', display: 'ผ่านการอนุมัติ' },
    { id: 3, value: 'NotApproved', display: 'ไม่ผ่านการอนุมัติ' },
  ];

  protected readonly attachmentGroupNames = [
    {
      topic: 'หนังสือนำส่งข้อเสนอโครงการ',
      key: 'collaboration',
    },
    {
      topic: '6.1 ป้ายประชาสัมพันธ์งาน',
      key: 'marketing',
    },
    {
      topic: '6.2 เส้นทาง',
      key: 'route',
    },
    {
      topic: '6.3 แผนผังบริเวณ',
      key: 'eventMap',
    },
    {
      topic: '6.4 รายละเอียดการจัดงาน',
      key: 'eventDetails',
    },
  ];

  get adminScore(): string {
    return this.data?.[0]?.adminScore?.toString() || '-';
  }

  get fundApprovedAmount(): string {
    const amount = this.data?.[0]?.fundApprovedAmount || 0;
    if (amount > 0) {
      return this.numberFormatter.format(amount);
    }
    return '-';
  }

  get adminComment(): string {
    return this.data?.[0]?.adminComment || '-';
  }
  get projectStatus(): string {
    return this.data?.[0]?.projectStatus || '';
  }

  get projectCreatedBy(): number {
    return this.data?.[0]?.userId || 0;
  }

  get isAdmin(): boolean {
    return this.currentUser?.userRole === 'admin';
  }

  get isApplicant(): boolean {
    return this.currentUser?.userRole === 'applicant';
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
    this.subs.push(
      this.userService.currentUserSubject$.subscribe((user) => {
        if (user?.id > 0) {
          this.currentUser = user;
          if (user.userRole === 'admin') {
            this.initForm();
          }
        }
      })
    );

    this.loadProjectDetails();

    this.subToSelectedFilesChanged();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm() {
    this.form = new FormGroup({
      projectStatusPrimary: new FormControl(null, Validators.required),
      projectStatusSecondary: new FormControl(null, Validators.required),
      adminScore: new FormControl(null, [
        Validators.min(0),
        Validators.max(100),
      ]),
      fundApprovedAmount: new FormControl(null, [Validators.min(0)]),
      adminComment: new FormControl(null),
    });
    this.form.disable();
  }

  private subToSelectedFilesChanged() {
    this.subs.push(
      this.additionFilesSubject.subscribe((files) => {
        this.additionFiles = files;
      })
    );

    this.subs.push(
      this.etcFilesSubject.subscribe((files) => {
        this.etcFiles = files;
      })
    );
  }

  loadProjectDetails() {
    this.subs.push(
      this.projectService
        .getApplicantProjectDetails(this.projectCode)
        .pipe(
          concatMap((result: ApplicantDetailsItem[]) => {
            if (result && result.length > 0) {
              this.pathDisplay = `${this.projectCode} ${result[0].projectName}`;
              this.data = result;

              if (this.isAdmin) {
                this.reloadAdminFormData();
                return this.projectService.listApplicantFiles(
                  this.projectCode,
                  result[0].userId
                );
              } else {
                return this.projectService.listApplicantFiles(this.projectCode);
              }
            } else {
              console.error(`project ${this.projectCode} does not exist`);
              this.router.navigate(['/dashboard']);
              return [];
            }
          })
        )
        .subscribe((s3ObjectList) => {
          console.log('==s3ObjectList', s3ObjectList);
          if (s3ObjectList && s3ObjectList.length > 0) {
            this.s3ObjectItems.collaboration = this.filterFileByType(
              s3ObjectList,
              'หนังสือนำส่ง'
            );
            this.s3ObjectItems.marketing = this.filterFileByType(
              s3ObjectList,
              'เอกสารแนบ/ป้ายประชาสัมพันธ์กิจกรรม'
            );
            this.s3ObjectItems.route = this.filterFileByType(
              s3ObjectList,
              'เอกสารแนบ/เส้นทางจุดเริ่มต้นถึงจุดสิ้นสุดและเส้นทางวิ่งในทุกระยะ'
            );
            this.s3ObjectItems.eventMap = this.filterFileByType(
              s3ObjectList,
              'เอกสารแนบ/แผนผังบริเวณการจัดงาน'
            );
            this.s3ObjectItems.eventDetails = this.filterFileByType(
              s3ObjectList,
              'เอกสารแนบ/กำหนดการการจัดกิจกรรม'
            );
            this.s3ObjectItems.addition = this.filterFileByType(
              s3ObjectList,
              'addition'
            );
            this.s3ObjectItems.etc = this.filterFileByType(
              s3ObjectList,
              'เอกสารแนบ/เอกสารอื่นๆ'
            );
          }
        })
    );
  }

  getStatusDisplay(status: string): string {
    const statusVal = STATUS_ORDER[status];
    if (!statusVal) {
      return '';
    }
    return `standard__${status}`;
  }

  private updateProjectStatusPrimary(data: ApplicantDetailsItem) {
    const orderValue = STATUS_ORDER[data.projectStatus];
    if (!orderValue) {
      return;
    }
    if (orderValue < STATUS_ORDER['NotApproved']) {
      this.form.patchValue({
        projectStatusPrimary: 'CurrentBeforeApprove',
      });
    } else if (orderValue === STATUS_ORDER['NotApproved']) {
      this.form.patchValue({
        projectStatusPrimary: 'NotApproved',
      });
    } else if (orderValue >= STATUS_ORDER['Approved']) {
      this.form.patchValue({
        projectStatusPrimary: 'Approved',
      });
    }
  }

  getReviewerPath(item: ApplicantDetailsItem) {
    if (this.currentUser.userRole === 'admin') {
      return `/admin/project/review-details/${this.projectCode}/${item.reviewerId}`;
    } else if (this.currentUser.userRole === 'applicant') {
      return `/applicant/project/review-details/${this.projectCode}/${item.reviewerId}`;
    }
    return '';
  }

  private filterFileByType(
    s3ObjectList: S3ObjectMetadata[],
    folderPrefix: string
  ) {
    return s3ObjectList
      .filter((item) =>
        item.key.includes(`${this.projectCode}/${folderPrefix}`)
      )
      .map((item) => {
        const splitItems = item.key.split('/');
        const fileName = splitItems[splitItems.length - 1];
        const displayDate = this.getDisplayDate(item.lastModified);
        return { key: item.key, display: fileName, lastModified: displayDate };
      });
  }

  onDownloadFormPdfClicked() {
    if (this.isApplicant) {
      this.subs.push(
        this.s3Service
          .getAttachmentsPresigned(
            `${this.projectCode}/${this.projectCode}_แบบฟอร์ม.pdf`
          )
          .subscribe((result) => {
            if (result?.URL) {
              window.open(result.URL);
            }
          })
      );
    } else {
      this.subs.push(
        this.s3Service
          .getAttachmentsPresigned(
            `${this.projectCode}/${this.projectCode}_แบบฟอร์ม.pdf`,
            this.projectCreatedBy
          )
          .subscribe((result) => {
            if (result?.URL) {
              window.open(result.URL);
            }
          })
      );
    }
  }

  onDownloadItemClick(objectKey: string) {
    const split = objectKey.split(`/${this.projectCode}/`);
    if (!split || split.length === 0) {
      return;
    }
    const prefix = split[split.length - 1];
    if (this.isApplicant) {
      this.subs.push(
        this.s3Service
          .getAttachmentsPresigned(`${this.projectCode}/${prefix}`)
          .subscribe((result) => {
            if (result?.URL) {
              window.open(result.URL);
            }
          })
      );
    } else {
      this.subs.push(
        this.s3Service
          .getAttachmentsPresigned(
            `${this.projectCode}/${prefix}`,
            this.projectCreatedBy
          )
          .subscribe((result) => {
            if (result?.URL) {
              window.open(result.URL);
            }
          })
      );
    }
  }

  getDisplayDate(dateStr: string): string {
    if (!dateStr) {
      return '';
    }
    const date = new Date(dateStr);
    const local = date.toLocaleDateString('en-US', {
      timeZone: 'Asia/bangkok',
    });
    return local
      .split('/')
      .map((x) => x.padStart(2, '0'))
      .join('-');
  }

  changeToApplicantEditMode() {
    this.applicantEditMode = true;
  }

  changeToApplicantViewMode() {
    this.additionFilesSubject.next([]);
    this.etcFilesSubject.next([]);
    this.applicantEditMode = false;
  }

  changeToAdminEditMode() {
    this.adminEditMode = true;
    this.form.enable();
  }

  changeToAdminViewMode() {
    this.adminEditMode = false;
    this.reloadAdminFormData();
    this.form.disable();
  }

  private reloadAdminFormData() {
    const first = this.data?.[0];
    if (first) {
      this.form.patchValue({
        projectStatusSecondary: first.projectStatus,
        adminScore: first.adminScore,
        fundApprovedAmount: first.fundApprovedAmount,
        adminComment: first.adminComment,
      });
      this.updateProjectStatusPrimary(first);
    }
  }

  onBackToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onAdminSubmitForm() {
    if (!this.formTouched) {
      this.formTouched = true;
    }
    if (!this.validToSubmit()) {
      return;
    }
    const dataToSubmit = this.getFormValueForSubmit();

    const formData = new FormData();
    formData.append('form', JSON.stringify(dataToSubmit));
    if (this.additionFiles) {
      for (let i = 0; i < this.additionFiles.length; i++) {
        formData.append('additionFiles', this.additionFiles[i]);
      }
    }
    if (this.etcFiles) {
      for (let i = 0; i < this.etcFiles.length; i++) {
        formData.append('etcFiles', this.etcFiles[i]);
      }
    }

    this.subs.push(
      this.projectService
        .adminUpdateProject(formData, this.projectCode)
        .subscribe({
          next: (result) => {
            if (result) {
              this.loadProjectDetails();
              this.displaySuccessPopup();
              setTimeout(() => {
                this.closeSuccessPopup();
                this.changeToAdminViewMode();
              }, 2000);
            }
          },
          error: (err) => {
            console.error(err);
            this.displayErrorPopup();
            setTimeout(() => {
              this.closeErrorPopup();
            }, 2000);
          },
        })
    );
  }

  private getFormValueForSubmit() {
    const clonedData = cloneDeep(this.form.value);
    let secondaryStatus: string = clonedData.projectStatusSecondary;
    secondaryStatus = secondaryStatus.replace(/^(standard__)/, '');
    clonedData.projectStatusSecondary = secondaryStatus;
    return clonedData;
  }

  private validToSubmit() {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  private markFieldsTouched() {
    this.form.markAllAsTouched();
    const errorId = this.getFirstErrorIdWithPrefix(this.form, '');
    console.error('error field:', errorId);
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 120]);
    this.scroller.scrollToAnchor(id);
  }

  private getFirstErrorIdWithPrefix(
    rootGroup: FormGroup,
    prefix: string
  ): string {
    const keys = Object.keys(rootGroup.controls);
    for (const k of keys) {
      if ((rootGroup.controls[k] as FormGroup)?.controls) {
        const val = this.getFirstErrorIdWithPrefix(
          rootGroup.controls[k] as FormGroup,
          prefix ? `${prefix}.${k}` : k
        );
        if (val) {
          return val;
        }
      }
      if (!rootGroup.controls[k].valid) {
        return prefix ? `${prefix}.${k}` : k;
      }
    }
    return '';
  }

  private isFormValid(): boolean {
    return this.form?.valid ?? false;
  }

  onConfirmUpload() {
    const body = {
      projectCode: this.projectCode,
    };
    const formData = new FormData();
    formData.append('form', JSON.stringify(body));
    if (this.additionFiles) {
      for (let i = 0; i < this.additionFiles.length; i++) {
        formData.append('additionFiles', this.additionFiles[i]);
      }
    }

    if (this.etcFiles) {
      for (let i = 0; i < this.etcFiles.length; i++) {
        formData.append('etcFiles', this.etcFiles[i]);
      }
    }

    this.subs.push(
      this.projectService.addAdditionalFiles(formData).subscribe({
        next: (result) => {
          if (result?.success) {
            this.displaySuccessPopup();
            setTimeout(() => {
              this.closeSuccessPopup();
              this.changeToApplicantViewMode();
            }, 2000);
          }
        },
        error: (err) => {
          console.error(err);
          this.displayErrorPopup();
          setTimeout(() => {
            this.closeErrorPopup();
          }, 2000);
        },
      })
    );
  }

  private displaySuccessPopup() {
    this.showSuccessPopup = true;
  }

  private closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  private displayErrorPopup() {
    this.showErrorPopup = true;
  }

  private closeErrorPopup() {
    this.showErrorPopup = false;
  }
}
