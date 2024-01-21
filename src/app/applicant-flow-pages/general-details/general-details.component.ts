import { ViewportScroller } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { SelectDropdownComponent } from '../../components/select-dropdown/select-dropdown.component';
import { AddressService } from '../../services/address.service';
import { DateService } from '../../services/date.service';
import { RadioOption } from '../../shared/models/radio-option';
import {
  days28,
  days29,
  days30,
  days31,
  hours,
  minutes,
  months,
} from './date-objects';

@Component({
  selector: 'app-applicant-general-details',
  standalone: true,
  imports: [
    InputTextComponent,
    ReactiveFormsModule,
    RadioComponent,
    SelectDropdownComponent,
  ],
  templateUrl: './general-details.component.html',
  styleUrl: './general-details.component.scss',
})
export class GeneralDetailsComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  protected formTouched = false;
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly dateService: DateService = inject(DateService);
  private readonly addressService: AddressService = inject(AddressService);

  private readonly thirtyDaysMonths = [4, 6, 9, 11];
  private febLeap: RadioOption[] = [];
  private febNormal: RadioOption[] = [];
  private thirtyDays: RadioOption[] = [];
  protected hourOptions: RadioOption[] = [];
  protected minuteOptions: RadioOption[] = [];
  private thirtyOneDays: RadioOption[] = [];
  protected dayDropdownDisabled = true;
  protected provinceOptions: RadioOption[] = [];
  protected districtOptions: RadioOption[] = [];
  protected subdistrictOptions: RadioOption[] = [];

  get generalFormGroup() {
    return this.form.get('general') as FormGroup;
  }

  get eventDateFormGroup() {
    return this.form.get('general.eventDate') as FormGroup;
  }

  get addressFormGroup() {
    return this.form.get('general.address') as FormGroup;
  }

  get daysInMonthOptions() {
    const year = this.form.value.general.eventDate.year;
    const month = this.form.value.general.eventDate.month;
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

  readonly expectedParticipantsOptions: RadioOption[] = [
    {
      id: 1,
      value: '<500',
      display: 'ต่ำกว่า 500 คน',
    },
    {
      id: 2,
      value: '500-1499',
      display: '500 - 1,499 คน',
    },
    {
      id: 3,
      value: '1500-2499',
      display: '1,500 - 2,499 คน',
    },
    {
      id: 4,
      value: '2500-3499',
      display: '2,500 - 3,499 คน',
    },
    {
      id: 5,
      value: '3500-4499',
      display: '3,500 - 4,499 คน',
    },
    {
      id: 6,
      value: '4500-5499',
      display: '4,500 - 5,499 คน',
    },
    {
      id: 7,
      value: '>=5500',
      display: '5,500 คน หรือมากกว่า',
    },
  ];

  readonly hasOrganizerOptions: RadioOption[] = [
    {
      id: 1,
      value: false,
      display: 'ไม่ใช้ (ผู้เสนอโครงการจัดงานเอง)',
    },
    {
      id: 2,
      value: true,
      display: 'ใช้ โปรดระบุชื่อบริษัทจัดงาน (Organizer)',
    },
  ];

  protected yearOptions: RadioOption[] = [];

  protected monthOptions: RadioOption[] = [];

  private readonly subs: Subscription[] = [];

  constructor() {
    this.onHasOrganizerChanged = this.onHasOrganizerChanged.bind(this);
    this.onYearOrMonthChanged = this.onYearOrMonthChanged.bind(this);
    this.onProvinceChanged = this.onProvinceChanged.bind(this);
    this.onDistrictChanged = this.onDistrictChanged.bind(this);
  }

  ngOnInit(): void {
    this.getYearsOptions();
    this.getProvinces();

    this.monthOptions = months;
    this.febNormal = days28;
    this.febLeap = days29;
    this.thirtyDays = days30;
    this.thirtyOneDays = days31;
    this.hourOptions = hours;
    this.minuteOptions = minutes;
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  onProvinceChanged() {
    const provinceId = this.form.value.general.address.province;
    this.getDistrictsByProvinceId(provinceId);
  }

  onDistrictChanged() {
    const districtId = this.form.value.general.address.district;
    this.getSubdistrictsByDistrictId(districtId);
  }

  onYearOrMonthChanged() {
    const year = this.form.value.general.eventDate.year;
    const month = this.form.value.general.eventDate.month;
    const day = this.form.value.general.eventDate.day;
    if (!year || !month) {
      this.dayDropdownDisabled = true;
      return;
    }
    this.dayDropdownDisabled = false;
    if (!this.isValidDate(year, month, day)) {
      this.eventDateFormGroup.patchValue({
        day: null,
      });
    }
  }

  private getDistrictsByProvinceId(provinceId: number) {
    this.subs.push(
      this.addressService
        .getDistrictsByProvinceId(provinceId)
        .subscribe((result) => {
          if (result) {
            this.districtOptions = result.map((d) => ({
              id: d.id,
              value: d.id,
              display: d.name,
            }));
          }
        })
    );
  }

  private getSubdistrictsByDistrictId(districtId: number) {
    this.subs.push(
      this.addressService
        .getSubdistrictsByDistrictId(districtId)
        .subscribe((result) => {
          if (result) {
            this.subdistrictOptions = result.map((d) => ({
              id: d.id,
              value: d.id,
              display: d.name,
            }));
          }
        })
    );
  }

  private getProvinces() {
    this.subs.push(
      this.addressService.getProvinces().subscribe((result) => {
        if (result) {
          this.provinceOptions = result.map((p) => ({
            id: p.id,
            value: p.id,
            display: p.name,
          }));
        }
      })
    );
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

  validToGoNext(): boolean {
    if (!this.formTouched) {
      this.formTouched = true;
    }
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  onHasOrganizerChanged(): void {
    const groupControl = this.form.get('general') as FormGroup;
    if (this.form.value?.general?.hasOrganizer) {
      groupControl.addControl(
        'organizerName',
        new FormControl(null, Validators.required)
      );
      return;
    }
    groupControl.removeControl('organizerName');
  }

  private getYearsOptions() {
    const currentYear = this.dateService.getCurrentYear();
    const years = [];
    for (let y = currentYear; y < currentYear + 10; y++) {
      years.push({
        id: y,
        value: y,
        display: y,
      });
    }
    this.yearOptions = years;
  }

  private isFormValid(): boolean {
    return this.form.get('general')?.valid ?? false;
  }

  private markFieldsTouched() {
    const groupControl = this.form.get('general');
    if (groupControl) {
      groupControl.markAllAsTouched();
    }

    const generalFormGroup = this.form.get('general') as FormGroup;
    const errorId = this.getFirstErrorId(generalFormGroup);
    console.log('===errorId', errorId);
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

  private getFirstErrorId(rootGroup: FormGroup): string {
    const keys = Object.keys(rootGroup.controls);
    for (const k of keys) {
      if ((rootGroup.controls[k] as FormGroup)?.controls) {
        const val = this.getFirstErrorId(rootGroup.controls[k] as FormGroup);
        if (val) {
          return val;
        }
      }
      if (!rootGroup.controls[k].valid) {
        return k;
      }
    }
    return '';
  }

  private isLeapYear(year: number): boolean {
    return new Date(year, 1, 29).getDate() === 29;
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }
}
