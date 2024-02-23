import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription, pairwise, startWith } from 'rxjs';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { InputNumberComponent } from '../../components/input-number/input-number.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { SelectDropdownComponent } from '../../components/select-dropdown/select-dropdown.component';
import { AddressService } from '../../services/address.service';
import { DateService } from '../../services/date.service';
import {
  days28,
  days29,
  days30,
  days31,
  hours,
  minutes,
  months,
} from '../../shared/constants/date-objects';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-general-details',
  standalone: true,
  imports: [
    CommonModule,
    InputTextComponent,
    RadioComponent,
    SelectDropdownComponent,
    CheckboxComponent,
    ReactiveFormsModule,
    InputNumberComponent,
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
  protected postcodeOptions: RadioOption[] = [];

  private readonly initialDistanceAndFee = [
    {
      checked: false,
      dynamic: false,
      type: 'fun',
      display: 'Fun run (ระยะทางไม่เกิน 10 km)',
      fee: 23,
    },
    {
      checked: false,
      dynamic: false,
      type: 'mini',
      display: 'Mini Marathon (ระยะทาง 10 km)',
      fee: null,
    },
    {
      checked: false,
      dynamic: false,
      type: 'half',
      display: 'Half Marathon (ระยะทาง 21.1 km)',
      fee: null,
    },
    {
      checked: false,
      dynamic: false,
      type: 'full',
      display: 'Marathon (ระยะทาง 42.195 km)',
      fee: null,
    },
    {
      checked: false,
      dynamic: true,
      type: null,
      display: 'อื่น ๆ (โปรดระบุ)',
      fee: null,
    },
  ];

  get generalFormGroup() {
    return this.form.get('general') as FormGroup;
  }

  get eventDateFormGroup() {
    return this.form.get('general.eventDate') as FormGroup;
  }

  get addressFormGroup() {
    return this.form.get('general.address') as FormGroup;
  }

  get eventDetailsFormGroup() {
    return this.form.get('general.eventDetails') as FormGroup;
  }

  get distanceAndFeeFormArray() {
    return this.form.get('general.eventDetails.distanceAndFee') as FormArray;
  }

  get categoryFormGroup() {
    return this.form.get('general.eventDetails.category') as FormGroup;
  }

  get categoryAvailableFormGroup() {
    return this.form.get(
      'general.eventDetails.category.available'
    ) as FormGroup;
  }

  get disableAddDistance() {
    const distanceFormArray = this.form.get(
      'general.eventDetails.distanceAndFee'
    ) as FormArray;
    const n = distanceFormArray.controls.length;
    if (!distanceFormArray.controls[n - 1].value.dynamic) {
      return false;
    }
    if (
      distanceFormArray.controls[n - 1].value.dynamic &&
      distanceFormArray.controls[n - 1].value.checked &&
      distanceFormArray.controls[n - 1].valid
    ) {
      return false;
    }
    return true;
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

  get hasOtherEventType() {
    return this.form.value.general.eventDetails.category.available.other;
  }

  protected readonly vipOptions: RadioOption[] = [
    {
      id: 1,
      value: true,
      display: 'มี',
    },
    {
      id: 2,
      value: false,
      display: 'ไม่มี',
    },
  ];

  protected readonly expectedParticipantsOptions: RadioOption[] = [
    {
      id: 1,
      value: '<=500',
      display: 'ต่ำกว่า 500 คน',
    },
    {
      id: 2,
      value: '501-1500',
      display: '501 - 1,500 คน',
    },
    {
      id: 3,
      value: '1501-2500',
      display: '1,501 - 2,500 คน',
    },
    {
      id: 4,
      value: '2501-3500',
      display: '2,501 - 3,500 คน',
    },
    {
      id: 5,
      value: '3501-4500',
      display: '3,501 - 4,500 คน',
    },
    {
      id: 6,
      value: '4501-5500',
      display: '4,501 - 5,500 คน',
    },
    {
      id: 7,
      value: '>=5501',
      display: '5,501 คนขึ้นไป',
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
    this.onSubdistrictChanged = this.onSubdistrictChanged.bind(this);
    this.onOtherEventTypeChanged = this.onOtherEventTypeChanged.bind(this);
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

    const provinceId = this.form.value?.general?.address?.provinceId;
    const districtId = this.form.value?.general?.address?.districtId;
    const subdistrictId = this.form.value?.general?.address?.subdistrictId;

    if (provinceId) {
      this.getDistrictsByProvinceId(provinceId);
    }
    if (districtId) {
      this.getSubdistrictsByDistrictId(districtId);
    }
    if (subdistrictId) {
      this.getPostcodeBySubdistrictId(subdistrictId);
    }

    this.manageDistanceFeeValidator();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private manageDistanceFeeValidator() {
    this.subs.push(
      this.distanceAndFeeFormArray.valueChanges
        .pipe(startWith(this.initialDistanceAndFee), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          next?.forEach((item: any, index: number) => {
            const feeFormControl = this.getDistanceFormGroup(index)?.get(
              'fee'
            ) as FormControl;
            const typeFormControl = this.getDistanceFormGroup(index)?.get(
              'type'
            ) as FormControl;
            // Determine which field is changed
            const checkedStateChanged = item.checked !== prev?.[index]?.checked;
            const feeChanged = item.fee !== prev?.[index]?.fee;
            const typeChanged = item.type !== prev?.[index]?.type;
            if (typeChanged && item.type && !item.checked) {
              this.distanceAndFeeFormArray.controls[index].patchValue({
                checked: true,
              });
            }
            if (feeChanged && item.fee && !item.checked) {
              this.distanceAndFeeFormArray.controls[index].patchValue({
                checked: true,
              });
            }
            if (checkedStateChanged) {
              if (item.checked) {
                this.addRequiredValidator(feeFormControl);
                if (item.dynamic) {
                  this.addRequiredValidator(typeFormControl);
                }
              } else {
                this.clearFormControl(feeFormControl);
                if (item.dynamic) {
                  this.clearFormControl(typeFormControl);
                }
              }
            }
          });
        })
    );
  }

  private addRequiredValidator(formControl: AbstractControl<any, any>) {
    formControl.addValidators(Validators.required);
    formControl.updateValueAndValidity({ emitEvent: false });
  }

  private clearFormControl(formControl: AbstractControl<any, any>) {
    formControl.clearValidators();
    formControl.reset(null, { emitEvent: false });
    formControl.updateValueAndValidity({ emitEvent: false });
  }

  addDistance() {
    this.distanceAndFeeFormArray.push(
      new FormGroup({
        checked: new FormControl(false),
        dynamic: new FormControl(true),
        type: new FormControl({ value: null, disabled: false }),
        display: new FormControl('อื่น ๆ (โปรดระบุ)'),
        fee: new FormControl({ value: null, disabled: false }),
      })
    );
  }

  removeDistance(index: number) {
    this.distanceAndFeeFormArray.removeAt(index);
  }

  onOtherEventTypeChanged() {
    if (this.hasOtherEventType) {
      this.categoryFormGroup.addControl(
        'otherType',
        new FormControl(null, Validators.required)
      );
      return;
    }
    this.categoryFormGroup.removeControl('otherType');
  }

  onProvinceChanged() {
    this.addressFormGroup.patchValue({ districtId: null, subdistrictId: null });
    const provinceId = this.form.value.general.address.provinceId;
    this.getDistrictsByProvinceId(provinceId);
  }

  onDistrictChanged() {
    // Clear subdistrict
    this.addressFormGroup.patchValue({ subdistrictId: null });
    const districtId = this.form.value.general.address.districtId;
    this.getSubdistrictsByDistrictId(districtId);
  }

  onSubdistrictChanged() {
    // Clear postcode
    this.addressFormGroup.patchValue({ postcodeId: null });
    const subdistrictId = this.form.value.general.address.subdistrictId;
    this.getPostcodeBySubdistrictId(subdistrictId);
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

  getDistanceFormGroup(index: number): FormGroup {
    return this.distanceAndFeeFormArray.at(index) as FormGroup;
  }

  private getDistrictsByProvinceId(provinceId: number) {
    this.subs.push(
      this.addressService
        .getDistrictsByProvinceId(provinceId)
        .subscribe((result) => {
          if (result && result?.length > 0) {
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
          if (result && result?.length > 0) {
            this.subdistrictOptions = result.map((d) => ({
              id: d.id,
              value: d.id,
              display: d.name,
            }));
          }
        })
    );
  }

  private getPostcodeBySubdistrictId(subdistrictId: number) {
    this.subs.push(
      this.addressService
        .getPostcodesBySubdistrictId(subdistrictId)
        .subscribe((result) => {
          if (result && result?.length > 0) {
            this.postcodeOptions = result.map((post) => ({
              id: post.id,
              value: post.id,
              display: post.code,
            }));
          }
        })
    );
  }

  private getProvinces() {
    this.subs.push(
      this.addressService.getProvinces().subscribe((result) => {
        if (result && result?.length > 0) {
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

  getDistanceRowId(index: number, fieldName: string) {
    return `eventDetails.distanceAndFee.${index}.${fieldName}`;
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
    // const errorId = this.getFirstErrorId(generalFormGroup);
    const errorId = this.getFirstErrorIdWithPrefix(generalFormGroup, '');
    console.log('===errorId', errorId);
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

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

  private isLeapYear(year: number): boolean {
    return new Date(year, 1, 29).getDate() === 29;
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 120]);
    this.scroller.scrollToAnchor(id);
  }

  // TODO: remove this func for dev purpose
  patchForm() {
    this.generalFormGroup.patchValue({
      projectName: 'พี่อุิ๊กระบี่',
      eventDate: {
        year: 2024,
        month: 2,
        day: 3,
        fromHour: 5,
        fromMinute: 2,
        toHour: 8,
        toMinute: 2,
      },
      address: {
        address: 'พี่อุิ๊กระบี่',
      },
      startPoint: 'x',
      finishPoint: 'y',
      eventDetails: {
        category: {
          available: {
            roadRace: true,
            trailRunning: true,
            other: false,
          },
        },
        vip: false,
      },
      expectedParticipants: '>=5501',
      hasOrganizer: false,
    });
  }
}
