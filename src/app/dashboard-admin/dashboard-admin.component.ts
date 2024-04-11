import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../components/button/button/button.component';
import { SelectDropdownComponent } from '../components/select-dropdown/select-dropdown.component';
import { DateService } from '../services/date.service';
import { ThemeService } from '../services/theme.service';
import { months } from '../shared/constants/date-objects';
import { BackgroundColor } from '../shared/enums/background-color';
import { AdminDashboardSummaryData } from '../shared/models/admin-dashboard-summary-data';
import { RadioOption } from '../shared/models/radio-option';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [SelectDropdownComponent, ButtonComponent, CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss',
})
export class DashboardAdminComponent implements OnInit {
  protected form: FormGroup;
  protected monthOptions: RadioOption[] = [];
  protected yearOptions: RadioOption[] = [];
  protected currentYear = 0;

  protected readonly minHistoryYear = 2023;
  protected summaryData = new AdminDashboardSummaryData();
  protected numberFormatter = Intl.NumberFormat();

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly dateService: DateService = inject(DateService);

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
