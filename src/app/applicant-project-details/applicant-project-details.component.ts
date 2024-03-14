import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../components/button/button/button.component';
import { ErrorPopupComponent } from '../components/error-popup/error-popup.component';
import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';
import { TableCellTemplateComponent } from '../components/table-cell-template/table-cell-template.component';
import { UploadButtonComponent } from '../components/upload-button/upload-button.component';
import { ProjectService } from '../services/project.service';
import { S3Service } from '../services/s3.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { ColumnTypeEnum } from '../shared/enums/column-type';
import { ApplicantDetailsItem } from '../shared/models/applicant-details-item';
import { S3ObjectMetadata } from '../shared/models/s3-object-metadata';

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
  ],
  templateUrl: './applicant-project-details.component.html',
  styleUrl: './applicant-project-details.component.scss',
})
export class ApplicantProjectDetailsComponent implements OnInit, OnDestroy {
  // url params
  @Input() projectCode: string;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly s3Service: S3Service = inject(S3Service);
  private readonly router: Router = inject(Router);
  private readonly subs: Subscription[] = [];

  protected showSuccessPopup = false;
  protected showErrorPopup = false;

  private numberFormatter = Intl.NumberFormat();

  protected data: ApplicantDetailsItem[] = [];

  protected additionFiles: File[] = [];
  protected additionFilesSubject = new BehaviorSubject<File[]>([]);

  protected editMode = false;
  protected pathDisplay = '';
  protected downloadButtonAction = '';

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

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
    this.loadProjectDetails();
    this.loadProjectFiles();

    this.subToSelectedFilesChanged();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private subToSelectedFilesChanged() {
    this.subs.push(
      this.additionFilesSubject.subscribe((files) => {
        console.log('===files', files);
        this.additionFiles = files;
      })
    );
  }

  loadProjectDetails() {
    this.subs.push(
      this.projectService
        .getApplicantProjectDetails(this.projectCode)
        .subscribe((result) => {
          console.log('===result1', result);
          if (result && result.length > 0) {
            this.pathDisplay = `${this.projectCode} ${result[0].projectName}`;
            this.data = result;
          } else {
            console.error(`project ${this.projectCode} does not exist`);
            this.router.navigate(['/dashboard']);
          }
        })
    );
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

  onDownloadFormZipClick() {
    this.subs.push(
      this.s3Service
        .getAttachmentsPresigned(
          `${this.projectCode}/zip/${this.projectCode}_แบบฟอร์ม.zip`
        )
        .subscribe((result) => {
          if (result?.URL) {
            window.open(result.URL);
          }
        })
    );
  }

  onDownloadItemClick(objectKey: string) {
    const split = objectKey.split(`/${this.projectCode}/`);
    if (!split || split.length === 0) {
      return;
    }
    const prefix = split[split.length - 1];
    this.subs.push(
      this.s3Service
        .getAttachmentsPresigned(`${this.projectCode}/${prefix}`)
        .subscribe((result) => {
          if (result?.URL) {
            window.open(result.URL);
          }
        })
    );
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

  changeToEditMode() {
    this.editMode = true;
  }

  changeToViewMode() {
    this.additionFilesSubject.next([]);
    this.editMode = false;
  }

  onBackToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onConfirmUpload() {
    console.log('===[onConfirmUpload]');
    console.log('===this.additionFiles', this.additionFiles);
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
          console.log('===result', result);
          if (result?.success) {
            this.showSuccessPopup = true;
            setTimeout(() => {
              this.showSuccessPopup = false;
              this.changeToViewMode();
            }, 2000);
          }
        },
        error: (err) => {
          console.error(err);
          this.showErrorPopup = true;
          setTimeout(() => {
            this.showErrorPopup = false;
          }, 2000);
        },
      })
    );
  }
}
