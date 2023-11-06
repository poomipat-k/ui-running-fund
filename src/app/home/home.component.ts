import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FilterComponent } from '../components/filter/filter.component';
import { TableComponent } from '../components/table/table.component';
import { BadgeType } from '../enums/badge-type';
import { ColumnTypeEnum } from '../enums/column-type';
import { FilterOption } from '../models/filter-option';
import { ReviewPeriod } from '../models/review-period';
import { TableColumn } from '../models/table-column';
import { User } from '../models/user';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TableComponent, FilterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  reviewers: User[] = [];
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly userService: UserService = inject(UserService);

  private reviewPeriod: ReviewPeriod;

  protected fromDate: string;
  protected toDate: string;
  protected data: string[][] = [];

  protected columns: TableColumn[] = [
    {
      name: 'รหัสโครงการ',
      class: 'width-135',
      bold: true,
    },
    {
      name: 'วันที่สร้าง',
      format: 'datetime',
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
      format: 'datetime',
      class: 'width-255',
    },
    {
      name: 'ดาวน์โหลด',
      class: 'width-92',
      type: ColumnTypeEnum.DownloadIcon,
      compact: true,
    },
  ];

  protected filterOptions: FilterOption[] = [
    {
      id: 1,
      display: 'เรียงตามตัวอักษร',
      name: 'ชื่อโครงการ',
      order: 'ASC',
    },
    {
      id: 2,
      display: 'ใหม่ - เก่า',
      name: 'วันที่สร้าง',
      order: 'DESC',
    },
    { id: 3, display: 'เก่า - ใหม่', name: 'วันที่สร้าง', order: 'ASC' },
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

  onSortFilterChanged(option: FilterOption) {
    console.log('===MAIN onFilterChanged option:', option);
    this.sortRows(this.data, option);
  }

  private sortRows(data: string[][], option: FilterOption) {
    if (!this.data) {
      return;
    }
    const columnIndex = this.columns.findIndex((c) => c.name === option.name);
    if (columnIndex === -1) {
      return;
    }
    console.log('===this.data', this.data);
    const isAsc = option.order === 'ASC';
    console.log('===columnIndex', columnIndex);
    if (this.columns[columnIndex].format === 'datetime') {
      console.log('==datetime');
      data.sort((a, b) => {
        const aDate = new Date(a[columnIndex]);
        const bDate = new Date(b[columnIndex]);
        console.log(a);
        console.log(b);
        console.log(aDate);
        console.log(bDate);
        console.log('=====');
        if (aDate > bDate) {
          return isAsc ? 1 : -1;
        }
        if (aDate < bDate) {
          return isAsc ? -1 : 1;
        }
        return 0;
      });
    } else {
      data.sort((a, b) => {
        if (a[columnIndex] > b[columnIndex]) {
          return isAsc ? 1 : -1;
        }
        if (a[columnIndex] < b[columnIndex]) {
          return isAsc ? -1 : 1;
        }
        return 0;
      });
    }
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
