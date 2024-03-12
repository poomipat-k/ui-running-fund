import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../components/button/button/button.component';
import { TableCellTemplateComponent } from '../components/table-cell-template/table-cell-template.component';
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
  imports: [ButtonComponent, CommonModule, TableCellTemplateComponent],
  templateUrl: './applicant-project-details.component.html',
  styleUrl: './applicant-project-details.component.scss',
})
export class ApplicantProjectDetailsComponent implements OnInit, OnDestroy {
  // url params
  @Input() projectCode: string;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly s3Service: S3Service = inject(S3Service);
  private readonly subs: Subscription[] = [];

  protected pathDisplay = '';
  protected downloadButtonAction = '';

  protected statusCellType = ColumnTypeEnum.Badge;
  protected s3ObjectItems: {
    collaboration: S3ObjectMetadata[];
    marketing: S3ObjectMetadata[];
    route: S3ObjectMetadata[];
    eventMap: S3ObjectMetadata[];
    eventDetails: S3ObjectMetadata[];
  } = {
    collaboration: [],
    marketing: [],
    route: [],
    eventMap: [],
    eventDetails: [],
  };

  protected data: ApplicantDetailsItem[] = [];

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
    this.loadProjectDetails();
    this.loadProjectFiles();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
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
            //

            console.log('==this.s3ObjectItems', this.s3ObjectItems);
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

  protected getDisplayDate(dateStr: string) {
    const date = new Date(dateStr);
    const local = date.toLocaleDateString('en-US', {
      timeZone: 'Asia/bangkok',
    });
    return local
      .split('/')
      .map((x) => x.padStart(2, '0'))
      .join('-');
  }
}
