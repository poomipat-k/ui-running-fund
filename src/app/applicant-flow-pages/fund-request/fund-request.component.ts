import { ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { InputNumberComponent } from '../../components/input-number/input-number.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-fund-request',
  standalone: true,
  imports: [
    InputNumberComponent,
    ReactiveFormsModule,
    CheckboxComponent,
    RadioComponent,
  ],
  templateUrl: './fund-request.component.html',
  styleUrl: './fund-request.component.scss',
})
export class FundRequestComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;
  protected formTouched = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  protected fundAmountOptions: RadioOption[] = [
    {
      id: 1,
      value: 20000,
      display: '20,000 บาท',
    },
    {
      id: 2,
      value: 30000,
      display: '30,000 บาท',
    },
    {
      id: 3,
      value: 50000,
      display: '50,000 บาท',
    },
    {
      id: 4,
      value: 100000,
      display: '100,000 บาท',
    },
  ];

  get budgetFormGroup(): FormGroup {
    return this.form.get('fund.budget') as FormGroup;
  }

  get requestFormGroup(): FormGroup {
    return this.form.get('fund.request') as FormGroup;
  }

  get requestTypeFormGroup(): FormGroup {
    return this.form.get('fund.request.type') as FormGroup;
  }

  get requestDetailsFormGroup(): FormGroup {
    return this.form.get('fund.request.details') as FormGroup;
  }

  get needFund(): boolean {
    return this.form.value.fund.request.type.fund;
  }

  get needBib(): boolean {
    return this.form.value.fund.request.type.bib;
  }

  get errorAtLeastOneRequired(): boolean {
    return !!this.form.get('fund.request.type')?.errors?.[
      'requiredCheckBoxToBeChecked'
    ];
  }

  constructor() {
    this.onNeedFundChanged = this.onNeedFundChanged.bind(this);
    this.onNeedBibChanged = this.onNeedBibChanged.bind(this);
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

  onNeedFundChanged() {
    if (this.needFund) {
      const control = new FormControl(null, Validators.required);
      this.requestDetailsFormGroup.addControl('fundAmount', control);
      return;
    }
    this.requestDetailsFormGroup.removeControl('fundAmount');
  }

  onNeedBibChanged() {
    if (this.needBib) {
      const control = new FormControl(null, Validators.required);
      this.requestDetailsFormGroup.addControl('bibAmount', control);
      return;
    }
    this.requestDetailsFormGroup.removeControl('bibAmount');
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

  private markFieldsTouched() {
    const groupControl = this.form.get('fund');
    if (groupControl) {
      groupControl.markAllAsTouched();
    }

    const fromGroup = this.form.get('fund') as FormGroup;
    const errorId = this.getFirstErrorIdWithPrefix(fromGroup, '');
    console.log('===errorId', errorId);
    if (errorId && this.enableScroll) {
      this.scrollToId(errorId);
    }
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }

  private isFormValid(): boolean {
    return this.form.get('fund')?.valid ?? false;
  }
}
