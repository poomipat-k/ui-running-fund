import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { ButtonComponent } from '../components/button/button/button.component';
import { ErrorPopupComponent } from '../components/error-popup/error-popup.component';
import { RadioComponent } from '../components/radio/radio.component';
import { SelectDropdownTemplateComponent } from '../components/select-dropdown-template/select-dropdown-template.component';
import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';
import { TableCellTemplateComponent } from '../components/table-cell-template/table-cell-template.component';
import { UploadButtonComponent } from '../components/upload-button/upload-button.component';
import { ProjectService } from '../services/project.service';
import { S3Service } from '../services/s3.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
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
  ],
  templateUrl: './applicant-project-details.component.html',
  styleUrl: './applicant-project-details.component.scss',
})
export class ApplicantProjectDetailsComponent implements OnInit, OnDestroy {
  // url params
  @Input() projectCode: string;

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
  protected additionFilesSubject = new BehaviorSubject<File[]>([]);

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
    // to satisfy ts in .html file
    [key: string]: S3ObjectMetadata[];
  } = {
    collaboration: [],
    marketing: [],
    route: [],
    eventMap: [],
    eventDetails: [],
    addition: [],
  };

  protected projectStatusOptions: RadioOption[] = [
    {
      id: 1,
      value: 'Reviewing',
      display: 'Reviewing',
    },
    {
      id: 2,
      value: 'Revise',
      display: 'Revise',
    },
    {
      id: 3,
      value: 'Approved',
      display: 'Approved',
    },
  ];

  protected adminStatusOptions: RadioOption[] = [
    { id: 1, value: 'AdminReviewing', display: 'อยู่ในขั้นพิจารณา' },
    { id: 2, value: 'AdminApproved', display: 'ผ่านการอนุมัติ' },
    { id: 3, value: 'AdminNotApproved', display: 'ไม่ผ่านการอนุมัติ' },
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

  get approvedFund(): string {
    const amount = this.data?.[0]?.fundApprovedAmount || 0;
    if (amount > 0) {
      return this.numberFormatter.format(amount);
    }
    return '-';
  }

  get adminComment(): string {
    return this.data?.[0]?.adminComment || '';
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
    this.loadProjectFiles();

    this.subToSelectedFilesChanged();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm() {
    this.form = new FormGroup({
      approveStatus: new FormControl(
        null,
        // { value: null, disabled: !this.adminEditMode },
        Validators.required
      ),
      projectStatus: new FormControl(
        null,
        // { value: null, disabled: !this.adminEditMode },
        Validators.required
      ),
    });
    this.form.disable();
  }

  private subToSelectedFilesChanged() {
    this.subs.push(
      this.additionFilesSubject.subscribe((files) => {
        this.additionFiles = files;
      })
    );
  }

  loadProjectDetails() {
    this.subs.push(
      this.projectService
        .getApplicantProjectDetails(this.projectCode)
        .subscribe((result: ApplicantDetailsItem[]) => {
          console.log('===result', result);
          if (result && result.length > 0) {
            this.pathDisplay = `${this.projectCode} ${result[0].projectName}`;
            this.data = result;
            console.log('===this.data', this.data);
          } else {
            console.error(`project ${this.projectCode} does not exist`);
            this.router.navigate(['/dashboard']);
          }
        })
    );
  }

  getReviewerPath(item: ApplicantDetailsItem) {
    if (this.currentUser.userRole === 'admin') {
      return `/admin/project/review-details/${this.projectCode}/${item.reviewerId}`;
    } else if (this.currentUser.userRole === 'applicant') {
      return `/applicant/project/review-details/${this.projectCode}/${item.reviewerId}`;
    }
    return '';
  }

  loadProjectFiles() {
    this.subs.push(
      this.projectService
        .listApplicantFiles(this.projectCode, 3)
        .subscribe((s3ObjectList) => {
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
          }
        })
    );
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
            `${this.projectCode}/zip/${this.projectCode}_แบบฟอร์ม.pdf`,
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
    this.applicantEditMode = false;
  }

  changeToAdminEditMode() {
    this.adminEditMode = true;
    this.form.enable();
  }

  changeToAdminViewMode() {
    this.adminEditMode = false;
    if (this.data?.[0]) {
      console.log('==this.data?.[0]', this.data?.[0]);
      this.form.patchValue({
        projectStatus: this.data[0].projectStatus,
      });
    }
    this.form.disable();
  }

  onBackToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onAdminSubmitForm() {
    console.log('===onAdminSubmitForm form', this.form);
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

    this.subs.push(
      this.projectService.addAdditionalFiles(formData).subscribe({
        next: (result) => {
          if (result?.success) {
            this.loadProjectFiles();
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
