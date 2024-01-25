import { ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RadioComponent } from '../../components/radio/radio.component';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-experience',
  standalone: true,
  imports: [RadioComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  protected formTouched = false;

  protected firstTimeDoThisSeriesOptions: RadioOption[] = [
    {
      id: 1,
      value: true,
      display: 'ใช่ (ข้ามไปส่วนที่ 5)',
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

  get thisSeriesFormGroup(): FormGroup {
    return this.form.get('experience.thisSeries') as FormGroup;
  }

  get otherSeriesFormGroup(): FormGroup {
    return this.form.get('experience.otherSeries') as FormGroup;
  }

  constructor() {}

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

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }

  private isFormValid(): boolean {
    return this.form.get('experience')?.valid ?? false;
  }
}
