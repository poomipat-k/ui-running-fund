import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, concatMap } from 'rxjs';

import { FilterComponent } from '../components/filter/filter.component';
import { TableComponent } from '../components/table/table.component';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { S3Service } from '../services/s3.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { ColumnTypeEnum } from '../shared/enums/column-type';
import { FilterOption } from '../shared/models/filter-option';
import { ReviewPeriod } from '../shared/models/review-period';
import { ReviewerDashboardRow } from '../shared/models/reviewer-dashboard-row';
import { TableCell } from '../shared/models/table-cell';
import { TableColumn } from '../shared/models/table-column';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-dashboard-reviewer',
  standalone: true,
  imports: [RouterModule, TableComponent, FilterComponent],
  templateUrl: './dashboard-reviewer.component.html',
  styleUrl: './dashboard-reviewer.component.scss',
})
export class DashboardReviewerComponent {
  reviewers: User[] = [];
  private readonly projectService: ProjectService = inject(ProjectService);

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly s3Service: S3Service = inject(S3Service);
  private readonly changeDetectorRef: ChangeDetectorRef;

  private reviewPeriod: ReviewPeriod;

  protected fromDate: string;
  protected toDate: string;
  protected apiData: ReviewerDashboardRow[] = [];
  protected data: TableCell[][] = [];

  protected columns: TableColumn[] = [
    {
      name: 'รหัสโครงการ',
      class: 'col-projectCode',
      bold: true,
    },
    {
      name: 'วันที่สร้าง',
      format: 'datetime',
      class: 'col-applyDate',
    },
    {
      name: 'ชื่อโครงการ',
      class: 'col-projectName',
    },
    {
      name: 'ดาวน์โหลดเอกสาร',
      class: 'col-download',
      type: ColumnTypeEnum.DownloadIcon,
      compact: true,
    },
    {
      name: 'สถานะการกลั่นกรอง',
      class: 'col-status',
      type: ColumnTypeEnum.Badge,
    },
    {
      name: 'วันที่กลั่นกรองเสร็จ',
      format: 'datetime',
      class: 'col-reviewDate',
    },
  ];

  protected filterOptions: FilterOption[] = [
    {
      id: 1,
      display: 'เรียงตามตัวอักษร',
      name: 'projectName',
      isAsc: true,
    },
    {
      id: 2,
      display: 'ใหม่ - เก่า',
      name: 'projectCreatedAt',
      isAsc: false,
    },
    { id: 3, display: 'เก่า - ใหม่', name: 'projectCreatedAt', isAsc: true },
    {
      id: 4,
      display: 'สถานะการกลั่นกรอง',
      name: 'priority',
      isAsc: true,
    },
  ];

  private routerService: Router = inject(Router);
  private dateService: DateService = inject(DateService);

  private readonly subs: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.loadReviewDashboard();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  onTableRowClicked(row: TableCell[]) {
    if (row.length > 0) {
      this.routerService.navigate(['project', 'review', row[0].value]);
    }
  }

  private loadReviewDashboard() {
    this.subs.push(
      this.projectService
        .getReviewPeriod()
        .pipe(
          concatMap((p) => {
            this.fromDate = this.dateService.dateToStringWithShortMonth(
              p.fromDate
            );

            const rawToDate = new Date(p.toDate);
            const toDate = new Date(rawToDate.getTime() - 1000);
            this.toDate = this.dateService.dateToStringWithShortMonth(
              toDate.toISOString()
            );
            this.reviewPeriod = p;
            return this.projectService.getReviewDashboard(
              this.reviewPeriod?.fromDate,
              this.reviewPeriod?.toDate
            );
          })
        )
        .subscribe((result) => {
          if (result) {
            this.apiData = result;
            this.sortByStatusCreatedAt(this.apiData);
            const newData = this.apiData.map((row, index) => {
              return [
                {
                  display: row.projectCode,
                  value: row.projectCode,
                },
                {
                  display: this.dateService.dateToStringWithShortMonth(
                    row.projectCreatedAt
                  ),
                  value: row.projectCreatedAt,
                },
                {
                  display: row.projectName,
                  value: row.projectName,
                },
                {
                  display: 'ok', // anything not '' will work
                  value: 'ok', // anything not '' will work
                  onClick: (e: MouseEvent) => {
                    e.stopPropagation();
                    this.subs.push(
                      this.s3Service
                        .getAttachmentsPresigned(
                          `${this.apiData[index].projectCode}/zip/${this.apiData[index].projectCode}_เอกสารแนบ.zip`,
                          row.userId
                        )
                        .subscribe((result) => {
                          if (result?.URL) {
                            // Open the return s3 presigned url
                            window.open(result.URL);
                          }
                        })
                    );
                  },
                },
                {
                  display: row.reviewId
                    ? 'reviewer__Reviewed'
                    : 'reviewer__PendingReview',
                  value: row.reviewId,
                },
                {
                  display: this.dateService.dateToStringWithShortMonth(
                    row.reviewedAt
                  ),
                  value: row.reviewedAt,
                },
              ];
            });
            this.data = newData;
          }
        })
    );
  }

  onSortFilterChanged(option: FilterOption) {
    if (!this.apiData) {
      return;
    }

    this.sortData(this.apiData, option);
    const newData = this.apiData.map((row) => {
      return [
        {
          display: row.projectCode,
          value: row.projectCode,
        },
        {
          display: this.dateService.dateToStringWithShortMonth(
            row.projectCreatedAt
          ),
          value: row.projectCreatedAt,
        },
        {
          display: row.projectName,
          value: row.projectName,
        },
        // Download attachment icon
        {
          display: 'ok', // anything not '' will work
          value: 'ok', // anything not '' will work
          // passing onClick here will make no impact, it still use the first onClick when load the data from API
        },
        {
          display: row.reviewId
            ? 'reviewer__Reviewed'
            : 'reviewer__PendingReview',
          value: row.reviewId,
        },
        {
          display: this.dateService.dateToStringWithShortMonth(row.reviewedAt),
          value: row.reviewedAt,
        },
      ];
    });
    this.data = newData;
  }

  private sortData(data: ReviewerDashboardRow[], option: FilterOption): void {
    switch (option.name) {
      case 'projectName': {
        data.sort((a, b) => {
          if (a.projectName > b.projectName) {
            return option.isAsc ? 1 : -1;
          }
          if (a.projectName < b.projectName) {
            return option.isAsc ? -1 : 1;
          }
          return 0;
        });
        break;
      }
      case 'projectCreatedAt': {
        data.sort((a, b) => {
          const aDate = new Date(a.projectCreatedAt);
          const bDate = new Date(b.projectCreatedAt);
          return this.dateCompareAsc(aDate, bDate, option.isAsc);
        });
        break;
      }
      case 'priority': {
        this.sortByStatusCreatedAt(data);
        break;
      }
    }
  }

  private sortByStatusCreatedAt(data: ReviewerDashboardRow[]) {
    data.sort((a, b) => {
      const aDate = new Date(a.projectCreatedAt);
      const bDate = new Date(b.projectCreatedAt);
      const aReviewed = !!a.reviewId ? 1 : 0;
      const bReviewed = !!b.reviewId ? 1 : 0;
      return aReviewed - bReviewed || this.dateCompareAsc(aDate, bDate, true);
    });
  }

  private dateCompareAsc(aDate: Date, bDate: Date, isAsc: boolean) {
    if (aDate > bDate) {
      return isAsc ? 1 : -1;
    }
    if (aDate < bDate) {
      return isAsc ? -1 : 1;
    }
    return 0;
  }
}
