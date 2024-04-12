import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../components/button/button/button.component';
import { FilterComponent } from '../components/filter/filter.component';
import { SelectDropdownComponent } from '../components/select-dropdown/select-dropdown.component';
import { TableComponent } from '../components/table/table.component';
import { DateService } from '../services/date.service';
import { ThemeService } from '../services/theme.service';
import { months } from '../shared/constants/date-objects';
import { BackgroundColor } from '../shared/enums/background-color';
import { ColumnTypeEnum } from '../shared/enums/column-type';
import { AdminDashboardSummaryData } from '../shared/models/admin-dashboard-summary-data';
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
export class DashboardAdminComponent implements OnInit {
  protected form: FormGroup;
  protected monthOptions: RadioOption[] = [];
  protected yearOptions: RadioOption[] = [];
  protected currentYear = 0;

  protected requestData: TableCell[][] = [];

  protected readonly minHistoryYear = 2023;
  protected summaryData = new AdminDashboardSummaryData();
  protected numberFormatter = Intl.NumberFormat();

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly dateService: DateService = inject(DateService);

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

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);

    this.currentYear = this.dateService.getCurrentYear();
    this.monthOptions = months;
    this.getYearOptions();

    this.initForm();
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
}
