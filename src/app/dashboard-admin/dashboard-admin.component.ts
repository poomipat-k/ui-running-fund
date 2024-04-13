import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../components/button/button/button.component';
import { FilterComponent } from '../components/filter/filter.component';
import { SelectDropdownComponent } from '../components/select-dropdown/select-dropdown.component';
import { TableComponent } from '../components/table/table.component';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { months } from '../shared/constants/date-objects';
import { BackgroundColor } from '../shared/enums/background-color';
import { ColumnTypeEnum } from '../shared/enums/column-type';
import { AdminDashboardSummaryData } from '../shared/models/admin-dashboard-summary-data';
import { AdminRequestDashboardRow } from '../shared/models/admin-request-dashboard-row';
import { FilterOption } from '../shared/models/filter-option';
import { RadioOption } from '../shared/models/radio-option';
import { TableCell } from '../shared/models/table-cell';
import { TableColumn } from '../shared/models/table-column';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    SelectDropdownComponent,
    ButtonComponent,
    CommonModule,
    FilterComponent,
    TableComponent,
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss',
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  protected form: FormGroup;
  protected monthOptions: RadioOption[] = [];
  protected yearOptions: RadioOption[] = [];
  protected currentYear = 0;

  protected requestData: TableCell[][] = [];

  protected readonly minHistoryYear = 2023;
  protected summaryData = new AdminDashboardSummaryData();
  protected numberFormatter = Intl.NumberFormat();

  private readonly pageSize = 5;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly dateService: DateService = inject(DateService);
  private readonly projectService: ProjectService = inject(ProjectService);

  private readonly subs: Subscription[] = [];

  protected filterOptions: FilterOption[] = [
    {
      id: 1,
      display: 'เรียงตามตัวอักษร',
      name: 'ชื่อโครงการ',
      order: 'ASC',
    },
    {
      id: 2,
      display: 'วันที่สร้าง ใหม่ - เก่า',
      name: 'วันที่สร้าง',
      order: 'DESC',
    },
    {
      id: 3,
      display: 'วันที่สร้าง เก่า - ใหม่',
      name: 'วันที่สร้าง',
      order: 'ASC',
    },
    {
      id: 4,
      display: 'วันที่แก้ไขล่าสุด ใหม่ - เก่า',
      name: 'วันที่แก้ไขล่าสุด',
      order: 'DESC',
    },
    {
      id: 5,
      display: 'วันที่แก้ไขล่าสุด เก่า - ใหม่',
      name: 'วันที่แก้ไขล่าสุด',
      order: 'ASC',
    },
    {
      id: 6,
      display: 'สถานะการกลั่นกรอง',
      name: 'priority',
      order: 'ASC',
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
      class: 'col-applyDate',
    },
    {
      name: 'ชื่อโครงการ',
      class: 'col-projectName',
    },
    {
      name: 'สถานะการดำเนินงาน',
      class: 'col-applicantStatus',
      type: ColumnTypeEnum.Badge,
    },
    {
      name: 'วันที่แก้ไขล่าสุด',
      format: 'datetime',
      class: 'col-updateDate',
    },
    {
      name: 'หมายเหตุ',
      class: 'col-adminComment',
    },
    {
      name: 'คะแนน',
    },
  ];

  get periodFormGroup(): FormGroup {
    return this.form.get('period') as FormGroup;
  }

  get fromYear(): number {
    return this.form.value.period.fromYear;
  }

  get toYear(): number {
    return this.form.value.period.toYear;
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);

    this.currentYear = this.dateService.getCurrentYear();
    this.monthOptions = months;
    this.getYearOptions();

    this.initForm();

    this.getRequestDashboard();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  getRequestDashboard() {
    this.subs.push(
      this.projectService
        .getAdminRequestDashboard(
          2024,
          2024,
          1,
          this.pageSize,
          ['created_at'],
          true
        )
        .subscribe((dashboardRows: AdminRequestDashboardRow[]) => {
          console.log('==top dashboard dashboardRows:', dashboardRows);
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
            this.requestData = data;
          }
        })
    );
  }

  onSortRequestFilterChanged() {
    console.log('==[onSortRequestFilterChanged]');
  }

  onTableRowClicked(row: TableCell[]) {
    console.log('===onTableRowClicked', row);
    if (row.length > 0) {
      // this.routerService.navigate(['applicant', 'project', row[0].value]);
    }
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

  private initForm() {
    this.form = new FormGroup({
      period: new FormGroup({
        fromMonth: new FormControl(null, Validators.required),
        fromYear: new FormControl(null, Validators.required),
        toMonth: new FormControl(null, Validators.required),
        toYear: new FormControl(null, Validators.required),
      }),
    });
  }

  private getStatusDisplay(row: AdminRequestDashboardRow): string {
    return `standard__${row.projectStatus}`;
  }
}
