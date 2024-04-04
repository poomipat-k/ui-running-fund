import { Component, inject } from '@angular/core';
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

  private reviewPeriod: ReviewPeriod;

  protected fromDate: string;
  protected toDate: string;
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
    {
      id: 4,
      display: 'สถานะการกลั่นกรอง',
      name: 'priority',
      order: 'ASC',
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
            this.toDate = this.dateService.dateToStringWithShortMonth(p.toDate);
            this.reviewPeriod = p;
            return this.projectService.getReviewDashboard(
              this.reviewPeriod?.fromDate,
              this.reviewPeriod?.toDate
            );
          })
        )
        .subscribe((result) => {
          if (result) {
            const newData = result.map((row) => {
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
                          `${row.projectCode}/zip/${row.projectCode}_เอกสารแนบ.zip`,
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
            this.sortByStatusCreatedAt(newData);
            this.data = newData;
          }
        })
    );
  }

  onSortFilterChanged(option: FilterOption) {
    if (option.name === 'priority') {
      this.sortByStatusCreatedAt(this.data);
      return;
    }
    this.sortRows(this.data, option);
  }

  private sortByStatusCreatedAt(data: TableCell[][]) {
    if (!this.data) {
      return;
    }
    const statusIndex = this.columns.findIndex(
      (c) => c.name === 'สถานะการกลั่นกรอง'
    );
    const createdIndex = this.columns.findIndex(
      (c) => c.name === 'วันที่สร้าง'
    );
    data.sort((a, b) => {
      const aDate = new Date(a[createdIndex].value);
      const bDate = new Date(b[createdIndex].value);
      return (
        a[statusIndex].display.localeCompare(b[statusIndex].display) ||
        this.dateCompareAsc(aDate, bDate)
      );
    });
  }

  private dateCompareAsc(aDate: Date, bDate: Date) {
    if (aDate > bDate) {
      return 1;
    }
    if (aDate < bDate) {
      return -1;
    }
    return 0;
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
}
