import { ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { CheckboxOption } from '../../shared/models/checkbox-option';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-plan-and-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    RadioComponent,
    CheckboxComponent,
  ],
  templateUrl: './plan-and-details.component.html',
  styleUrl: './plan-and-details.component.scss',
})
export class PlanAndDetailsComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  protected formTouched = false;

  get detailsFormGroup(): FormGroup {
    return this.form.get('details') as FormGroup;
  }

  get emergencyFormGroup(): FormGroup {
    return this.form.get('details.emergencyContact') as FormGroup;
  }

  get routeFormGroup(): FormGroup {
    return this.form.get('details.route') as FormGroup;
  }

  get measurementFormGroup(): FormGroup {
    return this.form.get('details.route.measurement') as FormGroup;
  }

  get trafficManagementFormGroup(): FormGroup {
    return this.form.get('details.route.trafficManagement') as FormGroup;
  }

  get judgeFormGroup(): FormGroup {
    return this.form.get('details.judge') as FormGroup;
  }

  get isSelfMeasured(): boolean {
    return (
      this.form.value?.details?.route?.measurement?.selfMeasurement ?? false
    );
  }

  get isOtherJudgementType(): boolean {
    return this.form.value?.details?.judge?.type === 'other';
  }

  protected measurementOptions: CheckboxOption[] = [
    {
      id: 1,
      display: 'ได้รับการวัดและรับรองจากสมาคมกีฬากรีฑาแห่งประเทศไทย',
      controlName: 'athleticsAssociation',
    },
    {
      id: 2,
      display: 'การวัดระยะทางด้วยจักรยานที่สอบเทียบ (Calibrated Bicycle)',
      controlName: 'calibratedBicycle',
    },
    {
      id: 3,
      display: 'ผู้จัดการแข่งขันวัดระยะทางเอง โปรดระบุเครื่องมือ',
      controlName: 'selfMeasurement',
      onChanged: this.onSelfMeasurementValueChanged.bind(this),
    },
  ];

  protected trafficManagementOptions: CheckboxOption[] = [
    {
      id: 1,
      display: 'มีผู้ช่วยดูแลความปลอดภัย เช่น ตำรวจ อาสาสมัครในพื้นที่',
      controlName: 'hasSupporter',
    },
    {
      id: 2,
      display: 'ขออนุญาตหน่วยงานปิดถนน หรือแบ่งช่องทางการจราจร',
      controlName: 'roadClosure',
    },
    {
      id: 3,
      display: 'ตั้งป้ายสัญลักษณ์ เช่น ป้ายบอกระยะทาง ป้ายจุดบริการน้ำดื่ม',
      controlName: 'signs',
    },
    {
      id: 4,
      display: 'มีการจัดแสงไฟในเส้นทางวิ่ง ในช่วงเส้นทางมืด',
      controlName: 'lighting',
    },
  ];

  protected judgeTypeOptions: RadioOption[] = [
    {
      id: 1,
      value: 'manual',
      display: 'ระบบ Manual ใช้กรรมการตัดสิน',
    },
    {
      id: 2,
      value: 'auto',
      display:
        'ระบบ Auto (Chip time) ใช้เครื่องประมวลผลร่วมกับกรรมการตัดสินชี้ขาด',
    },
    {
      id: 3,
      value: 'other',
      display: 'อื่น ๆ เช่น กรณีใช้การตัดสินทั้ง 2 ระบบ โปรดระบุรายละเอียด',
    },
  ];

  constructor() {
    this.onJudgementTypeChanged = this.onJudgementTypeChanged.bind(this);
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

  onSelfMeasurementValueChanged() {
    const group = this.form.get('details.route') as FormGroup;
    if (this.isSelfMeasured) {
      const toolControl = new FormControl(null, Validators.required);
      group.addControl('tool', toolControl);
      return;
    }
    group.removeControl('tool');
  }

  onJudgementTypeChanged() {
    if (this.isOtherJudgementType) {
      const otherJudgeType = new FormControl(null, Validators.required);
      this.judgeFormGroup.addControl('otherType', otherJudgeType);
      return;
    }
    this.judgeFormGroup.removeControl('otherType');
  }

  private markFieldsTouched() {
    const groupControl = this.form.get('details');
    if (groupControl) {
      groupControl.markAllAsTouched();
    }

    const fromGroup = this.form.get('details') as FormGroup;
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
    return this.form.get('details')?.valid ?? false;
  }
}
