import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterComponent } from '../components/filter/filter.component';
import { TableComponent } from '../components/table/table.component';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { WebsiteConfigService } from '../services/website-config.service';
import { STATUS_ORDER } from '../shared/constants/status-order';
import { BackgroundColor } from '../shared/enums/background-color';
import { ColumnTypeEnum } from '../shared/enums/column-type';
import { ApplicantDashboardRow } from '../shared/models/applicant-dashboard-row';
import { FilterOption } from '../shared/models/filter-option';
import { TableCell } from '../shared/models/table-cell';
import { TableColumn } from '../shared/models/table-column';

@Component({
  selector: 'app-dashboard-applicant',
  standalone: true,
  imports: [CommonModule, RouterModule, TableComponent, FilterComponent],
  templateUrl: './dashboard-applicant.component.html',
  styleUrl: './dashboard-applicant.component.scss',
})
export class DashboardApplicantComponent implements OnInit, OnDestroy {
  private readonly routerService: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly subs: Subscription[] = [];
  private readonly dateService: DateService = inject(DateService);
  private readonly websiteConfigService: WebsiteConfigService =
    inject(WebsiteConfigService);

  protected disableCreateNewProject = false;
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
      name: 'สถานะการกลั่นกรอง',
      class: 'col-applicantStatus',
      type: ColumnTypeEnum.Badge,
    },
    {
      name: 'วันที่แก้ไขล่าสุด',
      format: 'datetime',
      class: 'col-updateDate',
    },
    {
      name: 'ข้อเสนอแนะ',
      class: 'col-adminComment',
    },
  ];

  protected filterOptions: FilterOption[] = [
    {
      id: 1,
      display: 'เรียงตามตัวอักษร',
      name: 'ชื่อโครงการ',
      isAsc: true,
    },
    {
      id: 2,
      display: 'วันที่สร้าง ใหม่ - เก่า',
      name: 'วันที่สร้าง',
      isAsc: false,
    },
    {
      id: 3,
      display: 'วันที่สร้าง เก่า - ใหม่',
      name: 'วันที่สร้าง',
      isAsc: true,
    },
    {
      id: 4,
      display: 'วันที่แก้ไขล่าสุด ใหม่ - เก่า',
      name: 'วันที่แก้ไขล่าสุด',
      isAsc: false,
    },
    {
      id: 5,
      display: 'วันที่แก้ไขล่าสุด เก่า - ใหม่',
      name: 'วันที่แก้ไขล่าสุด',
      isAsc: true,
    },
    {
      id: 6,
      display: 'สถานะการกลั่นกรอง',
      name: 'priority',
      isAsc: true,
    },
  ];

  private statusOrder: { [key: string]: number } = {
    Reviewing: 1,
    Revise: 2,
    Approved: 3,
    NotApproved: 4,
  };

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.loadOperationConfig();
    this.loadApplicantDashboard();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private loadOperationConfig() {
    this.subs.push(
      this.websiteConfigService
        .getOperationConfig()
        .subscribe((operationConfig) => {
          this.disableCreateNewProject = !operationConfig.allowNewProject;
        })
    );
  }

  private loadApplicantDashboard() {
    this.subs.push(
      this.projectService.getApplicantDashboard().subscribe((dashboardRows) => {
        if (dashboardRows) {
          const data = dashboardRows.map((row) => {
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
                display: this.getStatusDisplay(row),
                value: row.projectStatus,
              },
              {
                display: this.dateService.dateToStringWithShortMonth(
                  row.projectUpdatedAt
                ),
                value: row.projectUpdatedAt,
              },
              {
                display: row.adminComment,
                value: row.adminComment,
              },
            ];
          });
          this.data = data;
        }
      })
    );
  }

  private getStatusDisplay(row: ApplicantDashboardRow): string {
    const statusVal = STATUS_ORDER[row?.projectStatus];
    if (!statusVal) {
      return '';
    }
    if (statusVal >= STATUS_ORDER.Approved) {
      return 'applicant__Approved';
    } else if (statusVal === STATUS_ORDER.Reviewed) {
      // Reviewed is considered to be Reviewing from applicant POV
      return 'applicant__Reviewing';
    }
    return `applicant__${row.projectStatus}`;
  }

  onCreateProjectClicked() {
    this.routerService.navigate(['/proposal/create']);
  }

  onTableRowClicked(row: TableCell[]) {
    if (row.length > 0) {
      this.routerService.navigate(['applicant', 'project', row[0].value]);
    }
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
      const aVal = a[statusIndex].value;
      const bVal = b[statusIndex].value;
      return (
        this.statusOrder[aVal] - this.statusOrder[bVal] ||
        this.dateCompareAsc(bDate, aDate)
      );
    });
  }

  private sortRows(data: TableCell[][], option: FilterOption) {
    if (!this.data) {
      return;
    }
    const columnIndex = this.columns.findIndex((c) => c.name === option.name);
    if (columnIndex === -1) {
      return;
    }
    if (this.columns[columnIndex].format === 'datetime') {
      data.sort((a, b) => {
        const aDate = new Date(a[columnIndex].value);
        const bDate = new Date(b[columnIndex].value);
        if (aDate > bDate) {
          return option.isAsc ? 1 : -1;
        }
        if (aDate < bDate) {
          return option.isAsc ? -1 : 1;
        }
        return 0;
      });
    } else {
      data.sort((a, b) => {
        if (a[columnIndex].value > b[columnIndex].value) {
          return option.isAsc ? 1 : -1;
        }
        if (a[columnIndex].value < b[columnIndex].value) {
          return option.isAsc ? -1 : 1;
        }
        return 0;
      });
    }
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
}
