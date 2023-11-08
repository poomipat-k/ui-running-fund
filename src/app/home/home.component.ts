import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FilterComponent } from '../components/filter/filter.component';
import { TableComponent } from '../components/table/table.component';
import { BadgeType } from '../enums/badge-type';
import { ColumnTypeEnum } from '../enums/column-type';
import { FilterOption } from '../models/filter-option';
import { ReviewPeriod } from '../models/review-period';
import { TableCell } from '../models/table-cell';
import { TableColumn } from '../models/table-column';
import { User } from '../models/user';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { forkJoin, mergeMap, of } from 'rxjs';
import { BackgroundColor } from '../enums/background-color';
import { ThemeService } from '../services/theme.service';

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
  private readonly themeService: ThemeService = inject(ThemeService);

  private reviewPeriod: ReviewPeriod;

  protected fromDate: string;
  protected toDate: string;
  protected data: TableCell[][] = [];

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
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.loadReviewDashboard();
  }

  private loadReviewDashboard() {
    forkJoin([
      this.projectService.getReviewPeriod(),
      this.userService.isLoggedIn(),
    ])
      .pipe(
        mergeMap(([p, isLoggedIn]) => {
          if (!isLoggedIn || !p) {
            return of(null);
          }
          this.fromDate = this.dateToStringWithShortMonth(p.from_date);
          this.toDate = this.dateToStringWithShortMonth(p.to_date);
          this.reviewPeriod = p;
          const user = this.userService.getCurrentUser();
          return this.projectService.getReviewDashboard(
            user.id,
            this.reviewPeriod.from_date,
            this.reviewPeriod.to_date
          );
        })
      )
      .subscribe((result) => {
        console.log('==result', result);
        if (result) {
          this.data = result.map((row) => {
            return [
              {
                display: row.project_code,
                value: row.project_code,
              },
              {
                display: this.dateToStringWithLongMonth(row.project_created_at),
                value: row.project_created_at,
              },
              {
                display: row.project_name,
                value: row.project_name,
              },
              {
                display: row.review_id
                  ? BadgeType.Reviewed
                  : BadgeType.PendingReview,
                value: row.review_id,
              },
              {
                display: this.dateToStringWithLongMonth(row.reviewed_at),
                value: row.reviewed_at,
              },
              {
                display: row.download_link,
                value: row.download_link,
              },
            ];
          });
        }
      });
  }

  onSortFilterChanged(option: FilterOption) {
    this.sortRows(this.data, option);
  }

  private sortRows(data: TableCell[][], option: FilterOption) {
    if (!this.data) {
      return;
    }
    const columnIndex = this.columns.findIndex((c) => c.name === option.name);
    if (columnIndex === -1) {
      return;
    }
    const isAsc = option.order === 'ASC';
    if (this.columns[columnIndex].format === 'datetime') {
      data.sort((a, b) => {
        const aDate = new Date(a[columnIndex].value);
        const bDate = new Date(b[columnIndex].value);
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
        if (a[columnIndex].value > b[columnIndex].value) {
          return isAsc ? 1 : -1;
        }
        if (a[columnIndex].value < b[columnIndex].value) {
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
