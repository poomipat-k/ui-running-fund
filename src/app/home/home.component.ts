import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TableComponent } from '../components/table/table.component';
import { ReviewPeriod } from '../models/review-period';
import { User } from '../models/user';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { TableColumn } from '../models/table-column';
import { ColumnTypeEnum } from '../enums/column-type';
import { BadgeType } from '../enums/badge-type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TableComponent],
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  reviewers: User[] = [];
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly userService: UserService = inject(UserService);

  reviewPeriod: ReviewPeriod;
  fromDate: string;
  toDate: string;
  protected data: string[][] = [];
  protected columns: TableColumn[] = [
    {
      name: 'รหัสโครงการ',
      class: 'width-135',
    },
    {
      name: 'วันที่สร้าง',
      class: 'width-200',
    },
    {
      name: 'ชื่อโครงการ',
    },
    {
      name: 'สถานะการกลั่นกรอง',
      class: 'width-200',
      type: ColumnTypeEnum.Badge,
    },
    {
      name: 'หมายเหตุ',
      class: 'width-255',
    },
    {
      name: 'ดาวน์โหลด',
      class: 'width-92',
      type: ColumnTypeEnum.DownloadIcon,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.projectService.getReviewPeriod().subscribe((p) => {
      if (p) {
        this.fromDate = this.dateToStringWithShortMonth(p.from_date);
        this.toDate = this.dateToStringWithShortMonth(p.to_date);
        this.reviewPeriod = p;

        this.getReviewDashboard();
      }
    });
  }

  getReviewDashboard() {
    const user = this.userService.getCurrentUser();
    this.projectService
      .getReviewDashboard(
        user.id,
        this.reviewPeriod.from_date,
        this.reviewPeriod.to_date
      )
      .subscribe((result) => {
        console.log('===Dashboard result:', result);
        if (result) {
          this.data = result.map((row) => {
            return [
              row.project_code,
              this.dateToStringWithLongMonth(row.project_created_at),
              row.project_name,
              row.review_id ? BadgeType.Reviewed : BadgeType.PendingReview,
              this.dateToStringWithLongMonth(row.reviewed_at),
              row.download_link,
            ];
          });
        }
      });
  }

  toggleFilter(columnName = 'ชื่อโครงการ'): void {
    if (!this.data) {
      return;
    }
    const colIndex = this.columns.findIndex((c) => c.name === columnName);
    if (colIndex === -1) {
      return;
    }
    this.data.sort((a, b) => {
      if (a[colIndex] > b[colIndex]) {
        return -1;
      }
      if (a[colIndex] < b[colIndex]) {
        return 1;
      }
      return 0;
    });
  }

  private dateToStringWithShortMonth(dateStr: string) {
    return this.transformDateString(dateStr, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private dateToStringWithLongMonth(dateStr: string) {
    return this.transformDateString(dateStr, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private transformDateString(
    dateString: string,
    options?: Intl.DateTimeFormatOptions
  ): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    try {
      const result = date.toLocaleDateString('th-TH', options);
      return result;
    } catch (err) {
      console.error('Error in transformDateString(): ', err);
      return '';
    }
  }
}
