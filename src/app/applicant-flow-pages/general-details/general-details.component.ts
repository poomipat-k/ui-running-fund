import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { SelectDropdownComponent } from '../../components/select-dropdown/select-dropdown.component';
import { DateService } from '../../services/date.service';
import { RadioOption } from '../../shared/models/radio-option';

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
export class GeneralDetailsComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  protected formTouched = false;
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly dateService: DateService = inject(DateService);

  get generalFormGroup() {
    return this.form.get('general') as FormGroup;
  }

  get eventDateFormGroup() {
    return this.form.get('general.eventDate') as FormGroup;
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

  protected readonly monthOptions: RadioOption[] = [
    {
      id: 1,
      value: 1,
      display: 'มกราคม',
    },
    {
      id: 2,
      value: 2,
      display: 'กุมภาพันธ์',
    },
    {
      id: 3,
      value: 3,
      display: 'มีนาคม',
    },
    {
      id: 4,
      value: 4,
      display: 'เมษายน',
    },
    {
      id: 5,
      value: 5,
      display: 'พฤษภาคม',
    },
    {
      id: 6,
      value: 6,
      display: 'มิถุนายน',
    },
    {
      id: 7,
      value: 7,
      display: 'กรกฎาคม',
    },
    {
      id: 8,
      value: 8,
      display: 'สิงหาคม',
    },
    {
      id: 9,
      value: 9,
      display: 'กันยายน',
    },
    {
      id: 10,
      value: 10,
      display: 'ตุลาคม',
    },
    {
      id: 11,
      value: 11,
      display: 'พฤศจิกายน',
    },
    {
      id: 12,
      value: 12,
      display: 'ธันวาคม',
    },
  ];

  constructor() {
    this.onHasOrganizerChanged = this.onHasOrganizerChanged.bind(this);
  }

  ngOnInit(): void {
    this.getYearsOptions();
  }

  isLeapYear(year: number): boolean {
    return new Date(year, 1, 29).getDate() === 29;
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

    const errorId = this.getFirstErrorId();
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

  private getFirstErrorId(): string {
    const group = this.form.get('general') as FormGroup;
    const keys = Object.keys(group.controls);
    for (const k of keys) {
      if (!group.controls[k].valid) {
        return k;
      }
    }
    return '';
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }
}
