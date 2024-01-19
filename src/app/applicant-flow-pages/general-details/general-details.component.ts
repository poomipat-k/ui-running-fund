import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-general-details',
  standalone: true,
  imports: [InputTextComponent, ReactiveFormsModule, RadioComponent],
  templateUrl: './general-details.component.html',
  styleUrl: './general-details.component.scss',
})
export class GeneralDetailsComponent {
  @Input() form: FormGroup;

  get generalFormGroup() {
    return this.form.get('general') as FormGroup;
  }

  readonly expectedParticipantsOptions: RadioOption[] = [
    {
      id: 1,
      value: 1,
      display: 'ต่ำกว่า 500 คน',
    },
    {
      id: 2,
      value: 2,
      display: '500 - 1,499 คน',
    },
    {
      id: 3,
      value: 3,
      display: '1,500 - 2,499 คน',
    },
    {
      id: 4,
      value: 4,
      display: '2,500 - 3,499 คน',
    },
    {
      id: 5,
      value: 5,
      display: '3,500 - 4,499 คน',
    },
    {
      id: 6,
      value: 6,
      display: '4,500 - 5,499 คน',
    },
    {
      id: 7,
      value: 7,
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

  constructor() {
    this.onHasOrganizerChanged = this.onHasOrganizerChanged.bind(this);
  }

  isLeapYear(year: number): boolean {
    return new Date(year, 1, 29).getDate() === 29;
  }

  validToGoNext(): boolean {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  onHasOrganizerChanged(): void {
    const groupControl = this.form.get('general') as FormGroup;
    console.log('==groupControl', groupControl);
    if (this.form.value?.general?.hasOrganizer) {
      console.log('===add control');
      groupControl.addControl(
        'organizerName',
        new FormControl(null, Validators.required)
      );
      return;
    }
    console.log('==removeControl');
    groupControl.removeControl('organizerName');
  }

  private isFormValid(): boolean {
    return this.form.get('general')?.valid ?? false;
  }

  private markFieldsTouched() {
    const groupControl = this.form.get('general');
    if (groupControl) {
      groupControl.markAllAsTouched();
    }
  }
}
