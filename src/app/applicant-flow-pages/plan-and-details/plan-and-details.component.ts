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
import { ApplicantCriteria } from '../../shared/models/applicant-criteria';
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
  @Input() criteria: ApplicantCriteria[] = [];

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

  get safetyReadyFormGroup(): FormGroup {
    return this.form.get('details.safety.ready') as FormGroup;
  }

  get safetyFormGroup(): FormGroup {
    return this.form.get('details.safety') as FormGroup;
  }

  get supportFormGroup(): FormGroup {
    return this.form.get('details.support') as FormGroup;
  }

  get supportOrganizationFormGroup(): FormGroup {
    return this.form.get('details.support.organization') as FormGroup;
  }

  get onlineAvailableFormGroup(): FormGroup {
    return this.form.get('details.marketing.online.available') as FormGroup;
  }

  get offlineAvailableFormGroup(): FormGroup {
    return this.form.get('details.marketing.offline.available') as FormGroup;
  }

  get onlineHowToFormGroup(): FormGroup {
    return this.form.get('details.marketing.online.howTo') as FormGroup;
  }

  get offlineFormGroup(): FormGroup {
    return this.form.get('details.marketing.offline') as FormGroup;
  }

  get isSelfMeasured(): boolean {
    return (
      this.form.value?.details?.route?.measurement?.selfMeasurement ?? false
    );
  }

  get isOtherJudgementType(): boolean {
    return this.form.value?.details?.judge?.type === 'other';
  }

  get isOtherTypeSafety(): boolean {
    return this.form.value?.details?.safety?.ready?.other ?? false;
  }

  get hasOtherSupportOrganization(): boolean {
    return this.form.value?.details?.support?.organization?.other ?? false;
  }

  get hasFacebook(): boolean {
    return (
      this.form.value?.details?.marketing?.online?.available?.facebook ?? false
    );
  }

  get hasWebsite(): boolean {
    return (
      this.form.value?.details?.marketing?.online?.available?.website ?? false
    );
  }

  get hasOnlinePage(): boolean {
    return (
      this.form.value?.details?.marketing?.online?.available?.onlinePage ??
      false
    );
  }

  get hasOnlineOther(): boolean {
    return (
      this.form.value?.details?.marketing?.online?.available?.other ?? false
    );
  }

  get hasOfflineAddition(): boolean {
    return (
      this.form.value?.details?.marketing?.offline?.available?.other ?? false
    );
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

  protected safetyOptions: CheckboxOption[] = [
    {
      id: 1,
      controlName: 'runnerInformation',
      display:
        'ข้อมูลสุขภาพและเบอร์ติดต่อฉุกเฉินของนักวิ่งในแบบฟอร์มลงทะเบียน/ระบบ/BIB',
    },
    {
      id: 2,
      controlName: 'healthDecider',
      display: 'กำหนดผู้รับผิดชอบ/ผู้ตัดสินใจเรื่องความปลอดภัยด้านสุขภาพ',
    },
    {
      id: 3,
      controlName: 'ambulance',
      display:
        'รถพยาบาล (ambulance) /รถมูลนิธิ <u>พร้อมเจ้าหน้าที่และอุปกรณ์</u>',
    },
    {
      id: 4,
      controlName: 'firstAid',
      display: 'จุดปฐมพยาบาลพร้อมเวชภัณฑ์',
    },
    {
      id: 5,
      controlName: 'aed',
      display: 'เครื่อง AED',
    },
    {
      id: 6,
      controlName: 'insurance',
      display: 'ประกันภัยสำหรับนักวิ่ง',
    },
    {
      id: 7,
      controlName: 'other',
      display: 'อื่น ๆ โปรดระบุ',
      onChanged: this.onOtherSafetyTypeChanged.bind(this),
    },
  ];

  protected supportOrganizationOptions: CheckboxOption[] = [
    {
      id: 1,
      controlName: 'provincialAdministration',
      display: 'หน่วยงานด้านการปกครอง เช่น ผู้ว่าเมือง อบต.',
    },
    {
      id: 2,
      controlName: 'safety',
      display: 'หน่วยงานด้านความปลอดภัย เช่น ตำรวจ อปพร. วิทยุกู้ชีพ',
    },
    {
      id: 3,
      controlName: 'health',
      display: 'หน่วยงานด้านการแพทย์ เช่น โรงพยาบาล รพ.สต. อสม.',
    },
    {
      id: 4,
      controlName: 'volunteer',
      display: 'มูลนิธิ อาสาสมัครชุมชน',
    },
    {
      id: 5,
      controlName: 'community',
      display: 'องค์กรระดับชุมชน เช่น โรงเรียน วัด ชุมชน',
    },
    {
      id: 6,
      controlName: 'other',
      display: 'อื่น ๆ',
      onChanged: this.onOtherOrganizationChanged.bind(this),
    },
  ];

  protected offlineAvailableOptions: CheckboxOption[] = [
    {
      id: 1,
      controlName: 'booth',
      display: 'การตั้งบูธประชาสัมพันธ์/ รับสมัคร',
    },
    {
      id: 2,
      controlName: 'billboard',
      display: 'กระจายสื่อในพื้นที่ เช่น ป้าย ไวนิล รถประชาสัมพันธ์',
    },
    {
      id: 3,
      controlName: 'local',
      display:
        'ประชาสัมพันธ์ผ่านบุคคลในพื้นที่ เช่น กำนัน ผู้ใหญ่บ้าน อสม. ชมรมวิ่ง',
    },
    {
      id: 4,
      controlName: 'other',
      display: 'ช่องทางออฟไลน์อื่น ๆ ระบุ',
      onChanged: this.onOfflineAdditionChanged.bind(this),
    },
  ];

  constructor() {
    this.onJudgementTypeChanged = this.onJudgementTypeChanged.bind(this);
    this.onHasFacebookChanged = this.onHasFacebookChanged.bind(this);
    this.onHasWebsiteChanged = this.onHasWebsiteChanged.bind(this);
    this.onHasOnlinePageChanged = this.onHasOnlinePageChanged.bind(this);
    this.onHasOnlineOtherChanged = this.onHasOnlineOtherChanged.bind(this);
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

  onOfflineAdditionChanged() {
    if (this.hasOfflineAddition) {
      const newControl = new FormControl(null, Validators.required);
      this.offlineFormGroup.addControl('addition', newControl);
      return;
    }
    this.offlineFormGroup.removeControl('addition');
  }

  onHasOnlineOtherChanged() {
    if (this.hasOnlineOther) {
      const newControl = new FormControl(null, Validators.required);
      this.onlineHowToFormGroup.addControl('other', newControl);
      return;
    }
    this.onlineHowToFormGroup.removeControl('other');
  }

  onHasOnlinePageChanged() {
    if (this.hasOnlinePage) {
      const newControl = new FormControl(null, Validators.required);
      this.onlineHowToFormGroup.addControl('onlinePage', newControl);
      return;
    }
    this.onlineHowToFormGroup.removeControl('onlinePage');
  }

  onHasWebsiteChanged() {
    if (this.hasWebsite) {
      const newControl = new FormControl(null, Validators.required);
      this.onlineHowToFormGroup.addControl('website', newControl);
      return;
    }
    this.onlineHowToFormGroup.removeControl('website');
  }

  onHasFacebookChanged() {
    if (this.hasFacebook) {
      const newControl = new FormControl(null, Validators.required);
      this.onlineHowToFormGroup.addControl('facebook', newControl);
      return;
    }
    this.onlineHowToFormGroup.removeControl('facebook');
  }

  onOtherOrganizationChanged() {
    if (this.hasOtherSupportOrganization) {
      const addition = new FormControl(null, Validators.required);
      this.supportFormGroup.addControl('addition', addition);
      return;
    }
    this.supportFormGroup.removeControl('addition');
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

  onOtherSafetyTypeChanged() {
    if (this.isOtherTypeSafety) {
      const addition = new FormControl(null, Validators.required);
      this.safetyFormGroup.addControl('addition', addition);
      return;
    }
    this.safetyFormGroup.removeControl('addition');
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
