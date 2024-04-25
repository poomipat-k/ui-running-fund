import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../components/button/button/button.component';
import { FilterComponent } from '../components/filter/filter.component';
import { InputTextComponent } from '../components/input-text/input-text.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { SelectDropdownTemplateComponent } from '../components/select-dropdown-template/select-dropdown-template.component';
import { SelectDropdownComponent } from '../components/select-dropdown/select-dropdown.component';
import { TableComponent } from '../components/table/table.component';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import {
  days28,
  days29,
  days30,
  days31,
  months,
} from '../shared/constants/date-objects';
import { STATUS_ORDER } from '../shared/constants/status-order';
import { BackgroundColor } from '../shared/enums/background-color';
import { ColumnTypeEnum } from '../shared/enums/column-type';
import { AdminDashboardFilter } from '../shared/models/admin-dashboard-filter';
import { AdminDashboardSummaryData } from '../shared/models/admin-dashboard-summary-data';

import { AdminDashboardRow } from '../shared/models/admin-request-dashboard-row';
import { FilterOption } from '../shared/models/filter-option';
import { RadioOption } from '../shared/models/radio-option';
import { TableCell } from '../shared/models/table-cell';
import { TableColumn } from '../shared/models/table-column';
import { fromDateBeforeToDateValidator } from '../shared/validators/fromDateBeforeToDate';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    SelectDropdownComponent,
    ButtonComponent,
    CommonModule,
    FilterComponent,
    TableComponent,
    PaginationComponent,
    InputTextComponent,
    SelectDropdownTemplateComponent,
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss',
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  protected form: FormGroup;
  protected monthOptions: RadioOption[] = [];
  protected yearOptions: RadioOption[] = [];
  protected currentYear = 0;

  protected requestCurrentPage = 1;
  protected startedCurrentPage = 1;

  protected allDateHasBeenTouched = false;

  protected requestData: TableCell[][] = [];
  protected startedData: TableCell[][] = [];
  protected summaryStartedProjectCount = 0;
  protected requestDashboardItemCount = 0;
  protected startedDashboardItemCount = 0;

  protected readonly minHistoryYear = 2023;
  protected summaryData = new AdminDashboardSummaryData();
  protected numberFormatter = Intl.NumberFormat();

  private readonly pageSize = 5;

  private readonly thirtyDaysMonths = [4, 6, 9, 11];
  private febLeap: RadioOption[] = [];
  private febNormal: RadioOption[] = [];
  private thirtyDays: RadioOption[] = [];
  private thirtyOneDays: RadioOption[] = [];

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly dateService: DateService = inject(DateService);
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly router: Router = inject(Router);

  private readonly subs: Subscription[] = [];

  protected activeSearchFilter: any = {};

  protected requestDashboardSortedBy = ['project_history.created_at'];
  protected requestDashboardASC = true;
  protected startedDashboardSortedBy = ['project_history.created_at'];
  protected startedDashboardASC = true;

  protected requestFilterOptions: FilterOption[] = [
    {
      id: 1,
      display: 'วันที่สร้าง ใหม่ - เก่า',
      name: 'วันที่สร้าง',
      dbSortBy: ['project_history.created_at'],
      isAsc: false,
    },
    {
      id: 2,
      display: 'วันที่สร้าง เก่า - ใหม่',
      name: 'วันที่สร้าง',
      dbSortBy: ['project_history.created_at'],
      isAsc: true,
    },
    {
      id: 3,
      display: 'เรียงตามตัวอักษร',
      name: 'ชื่อโครงการ',
      dbSortBy: ['project_history.project_name'],
      isAsc: true,
    },
    {
      id: 4,
      display: 'วันที่แก้ไขล่าสุด ใหม่ - เก่า',
      name: 'วันที่แก้ไขล่าสุด',
      dbSortBy: ['project_history.updated_at'],
      isAsc: false,
    },
    {
      id: 5,
      display: 'วันที่แก้ไขล่าสุด เก่า - ใหม่',
      name: 'วันที่แก้ไขล่าสุด',
      dbSortBy: ['project_history.updated_at'],
      isAsc: true,
    },
    {
      id: 6,
      display: 'สถานะการกลั่นกรอง',
      name: 'priority',
      dbSortBy: [
        "POSITION(project_history.status::text IN 'Reviewing,Reviewed,Revise,NotApproved,Approved')",
        'project_history.created_at',
      ],
      isAsc: true,
    },
  ];

  protected startedFilterOptions: FilterOption[] = [
    {
      id: 1,
      display: 'วันที่สร้าง ใหม่ - เก่า',
      name: 'วันที่สร้าง',
      dbSortBy: ['project_history.created_at'],
      isAsc: false,
    },
    {
      id: 2,
      display: 'วันที่สร้าง เก่า - ใหม่',
      name: 'วันที่สร้าง',
      dbSortBy: ['project_history.created_at'],
      isAsc: true,
    },
    {
      id: 3,
      display: 'เรียงตามตัวอักษร',
      name: 'ชื่อโครงการ',
      dbSortBy: ['project_history.project_name'],
      isAsc: true,
    },
    {
      id: 4,
      display: 'วันที่แก้ไขล่าสุด ใหม่ - เก่า',
      name: 'วันที่แก้ไขล่าสุด',
      dbSortBy: ['project_history.updated_at'],
      isAsc: false,
    },
    {
      id: 5,
      display: 'วันที่แก้ไขล่าสุด เก่า - ใหม่',
      name: 'วันที่แก้ไขล่าสุด',
      dbSortBy: ['project_history.updated_at'],
      isAsc: true,
    },
    {
      id: 6,
      display: 'สถานะการกลั่นกรอง',
      name: 'priority',
      dbSortBy: [
        "POSITION(project_history.status::text IN 'Start,Completed')",
        'project_history.created_at',
      ],
      isAsc: true,
    },
  ];

  protected requestColumns: TableColumn[] = [
    {
      name: 'รหัสโครงการ',
      class: 'col-projectCode',
      bold: true,
    },
    {
      name: 'วันที่ส่งใบขอทุน',
      format: 'datetime',
      class: 'col-longDate',
    },
    {
      name: 'ชื่อโครงการ',
      class: 'col-projectName',
    },
    {
      name: 'สถานะการดำเนินงาน',
      class: 'col-standardStatus',
      type: ColumnTypeEnum.Badge,
    },
    {
      name: 'วันที่แก้ไขล่าสุด',
      format: 'datetime',
      class: 'col-longDate',
    },
    {
      name: 'หมายเหตุ',
      class: 'col-adminComment',
    },
    {
      name: 'คะแนน',
      class: 'col-score',
    },
  ];

  protected startedColumns: TableColumn[] = [
    {
      name: 'รหัสโครงการ',
      class: 'col-projectCode',
      bold: true,
    },
    {
      name: 'วันที่ส่งใบขอทุน',
      format: 'datetime',
      class: 'col-longDate',
    },
    {
      name: 'ชื่อโครงการ',
      class: 'col-projectName',
    },
    {
      name: 'สถานะโครงการ',
      class: 'col-standardStatus',
      type: ColumnTypeEnum.Badge,
    },
    {
      name: 'วันที่แก้ไขล่าสุด',
      format: 'datetime',
      class: 'col-longDate',
    },
    {
      name: 'หมายเหตุ',
      class: 'col-adminComment',
    },
    {
      name: 'คะแนน',
      class: 'col-score',
    },
  ];

  protected statusSearchOptions: RadioOption[] = [
    {
      id: 1,
      value: '',
      display: '',
    },
    {
      id: 2,
      value: 'Reviewing',
      display: 'ยังไม่ได้กลั่นกรอง',
    },
    {
      id: 3,
      value: 'Reviewed',
      display: 'กลั่นกรองเรียบร้อย',
    },
    {
      id: 4,
      value: 'Revise',
      display: 'มีการแก้ไข',
    },
    {
      id: 5,
      value: 'NotApproved',
      display: 'ไม่ผ่านการอนุมัติ',
    },
    {
      id: 6,
      value: 'Approved',
      display: 'ผ่านการอนุมัติ',
    },
    {
      id: 7,
      value: 'Start',
      display: 'กำลังดำเนินโครงการ',
    },
    {
      id: 8,
      value: 'Completed',
      display: 'ปิดโครงการ',
    },
  ];

  get dateFormGroup(): FormGroup {
    return this.form.get('date') as FormGroup;
  }

  get searchFormGroup(): FormGroup {
    return this.form.get('search') as FormGroup;
  }

  get fromYear(): number {
    return this.form.value.date.fromYear;
  }

  get toYear(): number {
    return this.form.value.date.toYear;
  }

  get fromDaysInMonthOptions() {
    const year = this.form.value.date.fromYear;
    const month = this.form.value.date.fromMonth;
    if (!year || !month) {
      return [];
    }
    if (this.thirtyDaysMonths.includes(month)) {
      return this.thirtyDays;
    }
    if (month !== 2) {
      return this.thirtyOneDays;
    }
    return this.isLeapYear(year) ? this.febLeap : this.febNormal;
  }

  get toDaysInMonthOptions() {
    const year = this.form.value.date.toYear;
    const month = this.form.value.date.toMonth;
    if (!year || !month) {
      return [];
    }
    if (this.thirtyDaysMonths.includes(month)) {
      return this.thirtyDays;
    }
    if (month !== 2) {
      return this.thirtyOneDays;
    }
    return this.isLeapYear(year) ? this.febLeap : this.febNormal;
  }

  constructor() {
    this.onFromYearOrMonthChanged = this.onFromYearOrMonthChanged.bind(this);
    this.onToYearOrMonthChanged = this.onToYearOrMonthChanged.bind(this);
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);

    this.currentYear = this.dateService.getCurrentYear();
    this.monthOptions = months;
    this.febNormal = days28;
    this.febLeap = days29;
    this.thirtyDays = days30;
    this.thirtyOneDays = days31;
    this.getYearOptions();

    this.initForm();

    this.watchDateChanges();
  }

  private watchDateChanges() {
    this.subs.push(
      this.dateFormGroup.valueChanges.subscribe((values) => {
        console.log('==values:', values);
        if (this.dateFormGroup.valid) {
          console.log('==date is valid');
          // summary
          this.getAdminSummary(this.dateFormGroup.value);
          // request dashboard
          this.onRequestDashboardPageChanged(1);
          // started dashboard
          this.onStartedDashboardPageChanged(1);
        } else {
          console.log('==date is invalid');
        }
      })
    );
  }

  private initForm() {
    this.form = new FormGroup({
      date: new FormGroup(
        {
          fromDay: new FormControl(null, Validators.required),
          fromMonth: new FormControl(null, Validators.required),
          fromYear: new FormControl(null, Validators.required),
          toDay: new FormControl(null, Validators.required),
          toMonth: new FormControl(null, Validators.required),
          toYear: new FormControl(null, Validators.required),
        },
        fromDateBeforeToDateValidator()
      ),
      search: new FormGroup({
        projectCode: new FormControl(null),
        projectName: new FormControl(null),
        projectStatus: new FormControl(null),
      }),
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  onFromYearOrMonthChanged() {
    const year = this.form.value.date.fromYear;
    const month = this.form.value.date.fromMonth;
    const day = this.form.value.date.fromDay;
    if (!this.isValidDate(year, month, day)) {
      this.dateFormGroup.patchValue({
        fromDay: null,
      });
    }
  }

  onToYearOrMonthChanged() {
    const year = this.form.value.date.toYear;
    const month = this.form.value.date.toMonth;
    const day = this.form.value.date.toDay;
    if (!this.isValidDate(year, month, day)) {
      this.dateFormGroup.patchValue({
        toDay: null,
      });
    }
  }

  private isValidDate(year: number, month: number, day: number): boolean {
    if (!year || !month || !day) {
      return false;
    }
    if (month > 12 || day > 31) {
      return false;
    }
    return new Date(year, month - 1, day).getDate() === day;
  }

  private getAdminSummary({
    fromYear,
    fromMonth,
    fromDay,
    toYear,
    toMonth,
    toDay,
  }: {
    fromYear: number;
    fromMonth: number;
    fromDay: number;
    toYear: number;
    toMonth: number;
    toDay: number;
  }) {
    this.subs.push(
      this.projectService
        .getAdminSummary({
          fromYear,
          fromMonth,
          fromDay,
          toYear,
          toMonth,
          toDay,
        })
        .subscribe((summaryRows) => {
          if (summaryRows) {
            let count = 0;
            let approvedCount = 0;
            let approvedFundSum = 0;
            let startedProjectCount = 0;

            summaryRows.forEach((group) => {
              count += group.count;
              const statusVal = STATUS_ORDER[group.status];
              if (
                statusVal === STATUS_ORDER.Approved ||
                statusVal === STATUS_ORDER.Start ||
                statusVal === STATUS_ORDER.Completed
              ) {
                approvedCount += group.count;
              }
              if (
                statusVal === STATUS_ORDER.Start ||
                statusVal === STATUS_ORDER.Completed
              ) {
                startedProjectCount += group.count;
              }
              approvedFundSum += group.fundSum;
            });
            this.summaryStartedProjectCount = startedProjectCount;
            const approvedFundAvg = Math.round(approvedFundSum / approvedCount);
            const summaryData = new AdminDashboardSummaryData();
            summaryData.projectCount = count;
            summaryData.approvedProjectCount = approvedCount;
            summaryData.approvedFundSum = approvedFundSum;
            summaryData.averageFund = approvedFundAvg;

            this.summaryData = summaryData;
          } else {
            const summaryData = new AdminDashboardSummaryData();
            summaryData.projectCount = 0;
            summaryData.approvedProjectCount = 0;
            summaryData.approvedFundSum = 0;
            summaryData.averageFund = 0;
            this.summaryData = summaryData;
          }
        })
    );
  }

  onSearchClick() {
    this.activeSearchFilter = this.form.value;
    console.log('===this.form', this.form);
    // reset current page to 1 and reload data
    if (this.form.valid) {
      this.onRequestDashboardPageChanged(1);
    } else {
      console.error(this.dateFormGroup.errors);
    }
  }

  private getRequestDashboard(
    {
      fromYear,
      fromMonth,
      fromDay,
      toYear,
      toMonth,
      toDay,
    }: {
      fromYear: number;
      fromMonth: number;
      fromDay: number;
      toYear: number;
      toMonth: number;
      toDay: number;
    },
    pageNo: number,
    sortBy: string[],
    isAsc: boolean,
    searchFilter?: AdminDashboardFilter
  ) {
    this.subs.push(
      this.projectService
        .getAdminRequestDashboard(
          {
            fromYear,
            fromMonth,
            fromDay,
            toYear,
            toMonth,
            toDay,
          },
          pageNo,
          this.pageSize,
          sortBy,
          isAsc,
          searchFilter
        )
        .subscribe((dashboardRows: AdminDashboardRow[]) => {
          console.log('==request dashboardRows', dashboardRows);
          if (dashboardRows) {
            const data = dashboardRows.map((row) => {
              return [
                {
                  display: row.projectCode,
                  value: row.projectCode,
                },
                {
                  display: this.dateService.dateToStringWithLongMonth(
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
                  display: this.dateService.dateToStringWithLongMonth(
                    row.projectUpdatedAt
                  ),
                  value: row.projectUpdatedAt,
                },
                {
                  display: row.adminComment,
                  value: row.adminComment,
                },
                {
                  display: row.avgScore,
                  value: row.avgScore,
                },
              ];
            });
            const count = dashboardRows[0].count;
            this.requestDashboardItemCount = count;
            this.requestData = data;
          } else {
            this.requestDashboardItemCount = 0;
            this.requestData = [];
          }
        })
    );
  }

  private getStartedDashboard(
    {
      fromYear,
      fromMonth,
      fromDay,
      toYear,
      toMonth,
      toDay,
    }: {
      fromYear: number;
      fromMonth: number;
      fromDay: number;
      toYear: number;
      toMonth: number;
      toDay: number;
    },
    pageNo: number,
    sortBy: string[],
    isAsc: boolean,
    searchFilter?: AdminDashboardFilter
  ) {
    this.subs.push(
      this.projectService
        .getAdminStartedDashboard(
          {
            fromYear,
            fromMonth,
            fromDay,
            toYear,
            toMonth,
            toDay,
          },
          pageNo,
          this.pageSize,
          sortBy,
          isAsc,
          searchFilter
        )
        .subscribe((dashboardRows: AdminDashboardRow[]) => {
          console.log('==started dashboardRows', dashboardRows);
          if (dashboardRows) {
            const data = dashboardRows.map((row) => {
              return [
                {
                  display: row.projectCode,
                  value: row.projectCode,
                },
                {
                  display: this.dateService.dateToStringWithLongMonth(
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
                  display: this.dateService.dateToStringWithLongMonth(
                    row.projectUpdatedAt
                  ),
                  value: row.projectUpdatedAt,
                },
                {
                  display: row.adminComment,
                  value: row.adminComment,
                },
                {
                  display: row.avgScore,
                  value: row.avgScore,
                },
              ];
            });
            const count = dashboardRows[0].count;
            this.startedDashboardItemCount = count;
            this.startedData = data;
          } else {
            this.startedDashboardItemCount = 0;
            this.startedData = [];
          }
        })
    );
  }

  onSortRequestFilterChanged(option: FilterOption) {
    console.log('==[onSortRequestFilterChanged] option', option);
    if (!option) {
      return;
    }
    if (option.dbSortBy) {
      this.requestDashboardSortedBy = option.dbSortBy;
      this.requestDashboardASC = option.isAsc;
      this.refreshRequestDashboard();
    }
  }

  onSortStartedFilterChanged(option: FilterOption) {
    console.log('==[onSortStartedFilterChanged] option', option);
    if (!option) {
      return;
    }
    if (option.dbSortBy) {
      this.startedDashboardSortedBy = option.dbSortBy;
      this.startedDashboardASC = option.isAsc;
      this.refreshStartedDashboard();
    }
  }

  onRequestTableRowClicked(row: TableCell[]) {
    if (row.length > 0) {
      this.router.navigate(['admin', 'project', row[0].value]);
    }
  }

  onRequestDashboardPageChanged(currentPage: number) {
    if (currentPage >= 1) {
      this.requestCurrentPage = currentPage;
      this.refreshRequestDashboard();
    }
  }

  onStartedDashboardPageChanged(currentPage: number) {
    if (currentPage >= 1) {
      this.startedCurrentPage = currentPage;
      this.refreshStartedDashboard();
    }
  }

  private refreshRequestDashboard() {
    this.getRequestDashboard(
      this.dateFormGroup.value,
      this.requestCurrentPage,
      this.requestDashboardSortedBy,
      this.requestDashboardASC,
      {
        projectCode: this.activeSearchFilter?.search?.projectCode || null,
        projectName: this.activeSearchFilter?.search?.projectName || null,
        projectStatus: this.activeSearchFilter?.search?.projectStatus || null,
      }
    );
  }

  private refreshStartedDashboard() {
    this.getStartedDashboard(
      this.dateFormGroup.value,
      this.startedCurrentPage,
      this.startedDashboardSortedBy,
      this.startedDashboardASC,
      {
        projectCode: this.activeSearchFilter?.search?.projectCode || null,
        projectName: this.activeSearchFilter?.search?.projectName || null,
        projectStatus: this.activeSearchFilter?.search?.projectStatus || null,
      }
    );
  }

  private getYearOptions() {
    const years = [];
    const minYear = this.minHistoryYear;
    for (let y = this.currentYear; y >= minYear; y--) {
      years.push({
        id: y,
        value: y,
        display: y + 543,
      });
    }
    this.yearOptions = years;
  }

  private getStatusDisplay(row: AdminDashboardRow): string {
    return `standard__${row.projectStatus}`;
  }

  private isLeapYear(year: number): boolean {
    return new Date(year, 1, 29).getDate() === 29;
  }

  patchDate() {
    this.dateFormGroup.patchValue({
      fromYear: 2024,
      fromMonth: 4,
      fromDay: 22,
      toYear: 2024,
      toMonth: 6,
      toDay: 22,
    });
  }
}
