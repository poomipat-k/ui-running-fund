import { animate, style, transition, trigger } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputNumberComponent } from '../../components/input-number/input-number.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { SelectDropdownComponent } from '../../components/select-dropdown/select-dropdown.component';
import { DateService } from '../../services/date.service';
import {
  days28,
  days29,
  days30,
  days31,
  months,
} from '../../shared/constants/date-objects';
import { RadioOption } from '../../shared/models/radio-option';
@Component({
  selector: 'app-applicant-experience',
  standalone: true,
  imports: [
    RadioComponent,
    InputTextComponent,
    SelectDropdownComponent,
    InputNumberComponent,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  animations: [
    trigger('thisSeriesDisplay', [
      transition(':enter', [
        style({ opacity: 0, maxHeight: 0 }),
        animate('300ms ease-out', style({ opacity: 1, maxHeight: '44rem' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, maxHeight: '44rem' }),
        animate('300ms ease-out', style({ opacity: 0, maxHeight: 0 })),
      ]),
    ]),
  ],
})
export class ExperienceComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly dateService: DateService = inject(DateService);

  protected formTouched = false;
  private readonly thirtyDaysMonths = [4, 6, 9, 11];
  private febLeap: RadioOption[] = [];
  private febNormal: RadioOption[] = [];
  private thirtyDays: RadioOption[] = [];
  private thirtyOneDays: RadioOption[] = [];
  protected yearOptions: RadioOption[] = [];
  protected monthOptions: RadioOption[] = [];
  protected dayDropdownDisabled = true;
  protected completedEvent = [1, 2, 3];
  protected currentYear = this.dateService.getCurrentYear();

  protected firstTimeDoThisSeriesOptions: RadioOption[] = [
    {
      id: 1,
      value: true,
      display: 'ครั้งแรก (ข้ามไปส่วนที่ 4.2)',
    },
    {
      id: 2,
      value: false,
      display: 'ไม่ใช่',
    },
  ];

  protected hasOtherRunEventExperience: RadioOption[] = [
    {
      id: 1,
      value: false,
      display: 'ไม่มี (ข้ามไปส่วนที่ 5)',
    },
    {
      id: 2,
      value: true,
      display: 'มี',
    },
  ];

  get daysInMonthOptions() {
    const year = this.form.value.experience.thisSeries.history.year;
    const month = this.form.value.experience.thisSeries.history.month;
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

  get thisSeriesFormGroup(): FormGroup {
    return this.form.get('experience.thisSeries') as FormGroup;
  }

  get thisSeriesHistoryFormGroup(): FormGroup {
    return this.form.get('experience.thisSeries.history') as FormGroup;
  }
  get otherSeriesHistoryFormGroup(): FormGroup {
    return this.form.get('experience.otherSeries.history') as FormGroup;
  }

  get otherSeriesFormGroup(): FormGroup {
    return this.form.get('experience.otherSeries') as FormGroup;
  }

  get isThisSeriesFirstTime(): boolean {
    return this.form.get('experience.thisSeries.firstTime')?.value;
  }

  get hasDoneOtherSeriesBefore(): boolean {
    return this.form.get('experience.otherSeries.doneBefore')?.value;
  }

  constructor() {
    this.onYearOrMonthChanged = this.onYearOrMonthChanged.bind(this);
    this.onThisSeriesFirstTimeChanged =
      this.onThisSeriesFirstTimeChanged.bind(this);
    this.onDoneOtherSeriesBeforeChanged =
      this.onDoneOtherSeriesBeforeChanged.bind(this);
  }

  ngOnInit(): void {
    this.getYearsOptions();
    this.monthOptions = months;
    this.febNormal = days28;
    this.febLeap = days29;
    this.thirtyDays = days30;
    this.thirtyOneDays = days31;
  }

  public validToGoNext(): boolean {
    if (!this.formTouched) {
      this.formTouched = true;
    }
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  getThisSeriesCompletedFormGroup(item: number): FormGroup {
    return this.thisSeriesHistoryFormGroup.get('completed' + item) as FormGroup;
  }

  getOtherSeriesCompletedFormGroup(item: number): FormGroup {
    return this.otherSeriesHistoryFormGroup.get(
      'completed' + item
    ) as FormGroup;
  }

  onThisSeriesFirstTimeChanged() {
    if (this.isThisSeriesFirstTime === true) {
      this.thisSeriesFormGroup.removeControl('history');
      return;
    }
    if (!this.thisSeriesFormGroup.get('history')) {
      const historyFormGroup = this.generateHistoryFormGroup();
      this.thisSeriesFormGroup.addControl('history', historyFormGroup);
    }
  }

  onDoneOtherSeriesBeforeChanged() {
    if (this.hasDoneOtherSeriesBefore === false) {
      this.otherSeriesFormGroup.removeControl('history');
      return;
    }
    if (!this.otherSeriesFormGroup.get('history')) {
      const historyFormGroup = this.generateOtherSeriesHistoryFormGroup();
      this.otherSeriesFormGroup.addControl('history', historyFormGroup);
    }
  }

  private generateOtherSeriesHistoryFormGroup(): FormGroup {
    return new FormGroup({
      completed1: new FormGroup({
        year: new FormControl(null, [
          Validators.required,
          Validators.max(this.currentYear + 543),
          Validators.min(this.currentYear - 3 + 543),
        ]),
        name: new FormControl(null, Validators.required),
        participant: new FormControl(null, [
          Validators.required,
          Validators.min(0),
        ]),
      }),
      completed2: new FormGroup({
        year: new FormControl(null, [
          Validators.max(this.currentYear + 543),
          Validators.min(this.currentYear - 3 + 543),
        ]),
        name: new FormControl(null),
        participant: new FormControl(null, [Validators.min(0)]),
      }),
      completed3: new FormGroup({
        year: new FormControl(null, [
          Validators.max(this.currentYear + 543),
          Validators.min(this.currentYear - 3 + 543),
        ]),
        name: new FormControl(null),
        participant: new FormControl(null, [Validators.min(0)]),
      }),
    });
  }

  private generateHistoryFormGroup(): FormGroup {
    return new FormGroup({
      ordinalNumber: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required),
      month: new FormControl(null, Validators.required),
      day: new FormControl(null, Validators.required),
      completed1: new FormGroup({
        year: new FormControl(null, [
          Validators.required,
          Validators.max(this.currentYear + 543),
          Validators.min(this.currentYear - 3 + 543),
        ]),
        name: new FormControl(null, Validators.required),
        participant: new FormControl(null, [
          Validators.required,
          Validators.min(0),
        ]),
      }),
      completed2: new FormGroup({
        year: new FormControl(null, [
          Validators.max(this.currentYear + 543),
          Validators.min(this.currentYear - 3 + 543),
        ]),
        name: new FormControl(null),
        participant: new FormControl(null, [Validators.min(0)]),
      }),
      completed3: new FormGroup({
        year: new FormControl(null, [
          Validators.max(this.currentYear + 543),
          Validators.min(this.currentYear - 3 + 543),
        ]),
        name: new FormControl(null),
        participant: new FormControl(null, [Validators.min(0)]),
      }),
    });
  }

  private markFieldsTouched() {
    const groupControl = this.form.get('experience');
    if (groupControl) {
      groupControl.markAllAsTouched();
    }

    const fromGroup = this.form.get('experience') as FormGroup;
    const errorId = this.getFirstErrorIdWithPrefix(fromGroup, '');
    console.log('===errorId', errorId);
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

  // DFS to get formControl error first then check formGroup
  private getFirstErrorIdWithPrefix(
    rootGroup: FormGroup,
    prefix: string
  ): string {
    const keys = Object.keys(rootGroup.controls);
    for (const k of keys) {
      if ((rootGroup.controls[k] as FormGroup)?.controls) {
        const val = this.getFirstErrorIdWithPrefix(
          rootGroup.controls[k] as FormGroup,
          prefix ? `${prefix}.${k}` : k
        );
        if (val) {
          return val;
        }
      }
      if (!rootGroup.controls[k].valid) {
        return prefix ? `${prefix}.${k}` : k;
      }
    }
    return '';
  }

  onYearOrMonthChanged() {
    const year = this.form.value.experience.thisSeries.history.year;
    const month = this.form.value.experience.thisSeries.history.month;
    const day = this.form.value.experience.thisSeries.history.day;
    if (!year || !month) {
      this.dayDropdownDisabled = true;
      return;
    }
    this.dayDropdownDisabled = false;
    if (!this.isValidDate(year, month, day)) {
      this.thisSeriesHistoryFormGroup.patchValue({
        day: null,
      });
    }
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }

  private isFormValid(): boolean {
    return this.form.get('experience')?.valid ?? false;
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

  private getYearsOptions() {
    const currentYear = this.dateService.getCurrentYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 3; y--) {
      years.push({
        id: y,
        value: y,
        display: y + 543,
      });
    }
    this.yearOptions = years;
  }
}
