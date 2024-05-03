import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectDropdownComponent } from '../../components/select-dropdown/select-dropdown.component';
import { TableComponent } from '../../components/table/table.component';
import { DateService } from '../../services/date.service';
import {
  days28,
  days29,
  days30,
  days31,
  months,
} from '../../shared/constants/date-objects';
import { ColumnTypeEnum } from '../../shared/enums/column-type';
import { RadioOption } from '../../shared/models/radio-option';
import { TableCell } from '../../shared/models/table-cell';
import { TableColumn } from '../../shared/models/table-column';

@Component({
  selector: 'app-website-config-dashboard',
  standalone: true,
  imports: [SelectDropdownComponent, TableComponent],
  templateUrl: './website-config-dashboard.component.html',
  styleUrl: './website-config-dashboard.component.scss',
})
export class WebsiteConfigDashboardComponent implements OnInit {
  // dashboard formGroup
  @Input() form: FormGroup;
  @Input() dashboardData: TableCell[][] = [];

  private readonly dateService: DateService = inject(DateService);

  protected readonly minHistoryYear = 2024;

  protected dashboardItemCount = 0;

  private readonly thirtyDaysMonths = [4, 6, 9, 11];
  protected currentYear = 0;
  private febLeap: RadioOption[] = [];
  private febNormal: RadioOption[] = [];
  private thirtyDays: RadioOption[] = [];
  private thirtyOneDays: RadioOption[] = [];

  protected yearOptions: RadioOption[] = [];
  protected monthOptions: RadioOption[] = [];

  protected columns: TableColumn[] = [
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
      type: ColumnTypeEnum.Badge,
      width: '19rem',
    },
  ];

  get fromDaysInMonthOptions() {
    const year = this.form.value.fromYear;
    const month = this.form.value.fromMonth;
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
    const year = this.form.value.toYear;
    const month = this.form.value.toMonth;
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
    this.currentYear = this.dateService.getCurrentYear();
    this.monthOptions = months;
    this.febNormal = days28;
    this.febLeap = days29;
    this.thirtyDays = days30;
    this.thirtyOneDays = days31;
    this.getYearOptions();
  }

  onFromYearOrMonthChanged() {
    const year = this.form.value.fromYear;
    const month = this.form.value.fromMonth;
    const day = this.form.value.fromDay;
    if (!this.isValidDate(year, month, day)) {
      this.form.patchValue({
        fromDay: null,
      });
    }
  }

  onToYearOrMonthChanged() {
    const year = this.form.value.toYear;
    const month = this.form.value.toMonth;
    const day = this.form.value.toDay;
    if (!this.isValidDate(year, month, day)) {
      this.form.patchValue({
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

  private isLeapYear(year: number): boolean {
    return new Date(year, 1, 29).getDate() === 29;
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
}
