import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { InputNumberComponent } from '../../components/input-number/input-number.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { RadioItemComponent } from '../../components/radio-item/radio-item.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';
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
    CommonModule,
    RadioItemComponent,
    InputNumberComponent,
    TextareaComponent,
  ],
  templateUrl: './plan-and-details.component.html',
  styleUrl: './plan-and-details.component.scss',
})
export class PlanAndDetailsComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;
  @Input() criteria: ApplicantCriteria[] = [];
  @Input() devModeOn = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  protected formTouched = false;

  get detailsFormGroup(): FormGroup {
    return this.form.get('details') as FormGroup;
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

  get scoreFormGroup(): FormGroup {
    return this.form.get('details.score') as FormGroup;
  }

  get facebookHowToControl() {
    return this.form.get('details.marketing.online.howTo.facebook');
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

  get hasAed(): boolean {
    return this.form.value.details.safety.ready.aed;
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
      display:
        '<u>ก่อนและระหว่างการจัดกิจกรรม</u>มีการติดตั้งป้ายขออภัยในความไม่สะดวกในการใช้เส้นทาง',
      controlName: 'askPermission',
    },
    {
      id: 2,
      display: 'มีผู้ช่วยดูแลความปลอดภัย เช่น ตำรวจ อาสาสมัครในพื้นที่',
      controlName: 'hasSupporter',
    },
    {
      id: 3,
      display: 'ขออนุญาตหน่วยงานปิดถนน หรือแบ่งช่องทางการจราจร',
      controlName: 'roadClosure',
    },
    {
      id: 4,
      display: 'ตั้งป้ายสัญลักษณ์ เช่น ป้ายบอกระยะทาง ป้ายจุดบริการน้ำดื่ม',
      controlName: 'signs',
    },
    {
      id: 5,
      display: 'มีการจัดแสงไฟในเส้นทางวิ่ง ในช่วงเส้นทางมืด',
      controlName: 'lighting',
    },
  ];

  protected judgeTypeOptions: RadioOption[] = [
    {
      id: 1,
      value: 'manual',
      display:
        'การตัดสินโดยใช้กรรมการที่มีประสบการณ์และมีความชำนาญทำหน้าที่บันทึก ณ จุดเริ่มต้น ตลอดจนบนเส้นทางวิ่ง และเส้นชัย เพื่อเป็นข้อมูลตัดสินผลการจัดกิจกรรม (Manual)',
    },
    {
      id: 2,
      value: 'auto',
      display:
        'การตัดสินโดยใช้เครื่องประมวลผลอัตโนมัติ (Auto) ร่วมกับกรรมการตัดสินชี้ขาด',
    },
    {
      id: 3,
      value: 'other',
      display: 'อื่น ๆ โปรดระบุ',
    },
  ];

  protected safetyOptions: CheckboxOption[] = [
    {
      id: 1,
      controlName: 'runnerInformation',
      display:
        'มีข้อมูลส่วนบุคคลของนักวิ่ง ทั้งข้อมูลส่วนตัวและข้อมูลสุขภาพในระบบลงทะเบียนรับสมัคร',
    },
    {
      id: 2,
      controlName: 'healthDecider',
      display:
        'กำหนดผู้รับผิดชอบเพื่อตัดสินใจ กรณีเกิดปัญหาด้านสุขภาพฉุกเฉินแก่นักวิ่ง',
    },
    {
      id: 3,
      controlName: 'ambulance',
      display:
        'มีรถพยาบาลฉุกเฉิน (ambulance) พร้อมแพทย์/พยาบาลวิชาชีพ/เจ้าหน้าที่ที่ผ่านการอบรมด้านการกู้ชีพฉุกเฉิน',
    },
    {
      id: 4,
      controlName: 'firstAid',
      display:
        'จุดปฐมพยาบาลพร้อมเวชภัณฑ์ เช่น แอมโมเนีย ที่ติดแผล สเปรย์ฉีดคลายกล้ามเนื้อ',
    },
    {
      id: 5,
      controlName: 'aed',
      display: 'เครื่อง AED',
      onChanged: this.onHasAedChanged.bind(this),
    },
    {
      id: 6,
      controlName: 'volunteerDoctor',
      display:
        'มีอาสาสมัครด้านการแพทย์ฉุกเฉินในรูปแบบจักรยานหรือจักรยานยนต์ พร้อมเครื่อง AED',
    },
    {
      id: 7,
      controlName: 'insurance',
      display: 'ประกันชีวิตสำหรับนักวิ่ง',
    },
    {
      id: 8,
      controlName: 'other',
      display: 'อื่น ๆ โปรดระบุ',
      onChanged: this.onOtherSafetyTypeChanged.bind(this),
    },
  ];

  protected supportOrganizationOptions: CheckboxOption[] = [
    {
      id: 1,
      controlName: 'provincialAdministration',
      display:
        'หน่วยงานด้านการปกครอง เช่น ผู้ว่าราชการ นายอำเภอ นายกเทศบาล ทต. อบต.',
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
      display: 'องค์กรระดับชุมชน เช่น โรงเรียน วัด ชุมชน อสม.',
    },
    {
      id: 6,
      controlName: 'other',
      display: 'อื่น ๆ ระบุ',
      onChanged: this.onOtherOrganizationChanged.bind(this),
    },
  ];

  protected offlineAvailableOptions: CheckboxOption[] = [
    {
      id: 1,
      controlName: 'pr',
      display: 'ส่งหนังสือให้กับหน่วยงาน/องค์กรอื่นช่วยประชาสัมพันธ์',
    },
    {
      id: 2,
      controlName: 'localOfficial',
      display:
        'ประชาสัมพันธ์ผ่านบุคคลในพื้นที่ เช่น กำนัน ผู้ใหญ่บ้าน อสม. ชมรมวิ่ง',
    },
    {
      id: 3,
      controlName: 'booth',
      display:
        'การตั้งบูธประชาสัมพันธ์/รับสมัครในงานวิ่งอื่นหรือสถานที่ในชุมชน',
    },
    {
      id: 4,
      controlName: 'billboard',
      display: 'กระจายสื่อในพื้นที่ เช่น ป้าย ไวนิล รถประชาสัมพันธ์',
    },
    {
      id: 5,
      controlName: 'tv',
      display: 'การลงข่าวหรือโฆษณาทาง TV',
    },
    {
      id: 6,
      controlName: 'other',
      display: 'ช่องทางออฟไลน์อื่น ๆ ระบุ',
      onChanged: this.onOfflineAdditionChanged.bind(this),
    },
  ];

  protected scoreOptions: RadioOption[] = [
    {
      id: 5,
      value: 5,
    },
    {
      id: 4,
      value: 4,
    },
    {
      id: 3,
      value: 3,
    },
    {
      id: 2,
      value: 2,
    },
    {
      id: 1,
      value: 1,
    },
  ];

  protected scoreHeader = [
    '5. มั่นใจอย่างยิ่ง',
    '4. มั่นใจ',
    '3. กลาง ๆ',
    '2. ไม่มั่นใจ',
    '1. ไม่มั่นใจอย่างยิ่ง',
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

  onHasAedChanged() {
    if (this.hasAed) {
      this.safetyFormGroup.addControl(
        'aedCount',
        new FormControl(null, Validators.required)
      );
      return;
    }
    this.safetyFormGroup.removeControl('aedCount');
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
      const newControl = new FormControl(null, [Validators.required]);
      this.onlineHowToFormGroup.addControl('website', newControl);
      return;
    }
    this.onlineHowToFormGroup.removeControl('website');
  }

  onHasFacebookChanged() {
    if (this.hasFacebook) {
      const newControl = new FormControl(null, [Validators.required]);
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

  generateCriteriaControlName(c: ApplicantCriteria): string {
    return `q_${c.criteriaVersion}_${c.orderNumber}`;
  }

  getCriteriaId(c: ApplicantCriteria): string {
    return `score.q_${c.criteriaVersion}_${c.orderNumber}`;
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 110]);
    this.scroller.scrollToAnchor(id);
  }

  private isFormValid(): boolean {
    return this.form.get('details')?.valid ?? false;
  }

  protected patchForm() {
    const group = this.form.get('details') as FormGroup;
    group.patchValue({
      background:
        'ประเทศไทยได้รับการยอมรับว่าเป็นผู้นำระดับโลกและระดับภูมิภาคในการส่งเสริมการออกกำลังกาย ด้วยตระหนักถึงประโยชน์ต่อสุขภาพของการออกกำลังกาย ในปี พ.ศ. 2560 ประเทศไทยและประเทศสมาชิกอื่นๆ จากภูมิภาคเอเชียตะวันออกเฉียงใต้เห็นพ้องกันว่าจำเป็นต้องมีการดำเนินการที่เป็นรูปธรรมมากขึ้นในการส่งเสริมการออกกำลังกาย และตัดสินใจจัดทำข้อมติ RC SEA/RC69/R4 ว่าด้วยการส่งเสริมกิจกรรมทางกาย ในภูมิภาคเอเชียตะวันออกเฉียงใต้ ประเทศไทยยังเห็นชอบข้อเสนอเพื่อจัดทำรายงานและร่างแผนปฏิบัติการระดับโลกด้านกิจกรรมทางกายด้วย แผนปฏิบัติการระดับโลก (GAPPA) ได้รับการพิจารณาโดยสมัชชาอนามัยโลกในเดือนพฤษภาคม พ.ศ. 2561 ผ่านการประชุมคณะกรรมการบริหารครั้งที่ 142 ในเดือนมกราคม พ.ศ. 2561 อย่างไรก็ตาม สถานการณ์การออกกำลังกายในประเทศไทยไม่ได้สะท้อนถึงความเป็นผู้นำที่กระตือรือร้นของประเทศในเวทีโลก ข้อมูลล่าสุดเกี่ยวกับสถานการณ์การออกกำลังกายของประเทศไทย (WHO-SEARO, 2018) แสดงให้เห็นว่าเด็กในประเทศไทยร้อยละ 15 ยังคงเป็นโรคอ้วน และวัยรุ่นร้อยละ 84.4 มีการออกกำลังกายไม่เพียงพอ\n\nความสำคัญของสภาพแวดล้อมที่สร้างขึ้นในฐานะปัจจัยสำคัญที่มีอิทธิพลต่อสุขภาพได้รับการยอมรับมากขึ้น เนื่องจากมีศักยภาพที่จะส่งผลกระทบเชิงบวกหรือเชิงลบต่อการออกกำลังกาย สิ่งสำคัญประการหนึ่งของโครงสร้างพื้นฐานด้านสุขภาพที่สามารถมีอิทธิพลอย่างมากต่อสุขภาพและความเป็นอยู่ที่ดีคือความพร้อมของพื้นที่เปิดโล่งสีเขียวและสวนสาธารณะ มุมมองนี้สอดคล้องกับความคิดริเริ่มระดับโลกที่โดดเด่นสองประการในสภาพแวดล้อมในเมือง: เป้าหมายที่ 11 ของเป้าหมายการพัฒนาที่ยั่งยืน (SDGs) และวาระการพัฒนาเมืองใหม่ (NUA) โครงการริเริ่มทั้งสองนี้มีจุดมุ่งหมายเพื่อปรับปรุงสุขภาพและความเป็นอยู่ที่ดีในระดับโลกโดยการสร้างสภาพแวดล้อมที่สร้างขึ้นเพื่อส่งเสริมสุขภาพที่ดี\n\nสสส. ได้แสดงให้เห็นถึงความมุ่งมั่นในการส่งเสริมการออกกำลังกายผ่านการมีส่วนร่วมในการสนับสนุนแผนปฏิบัติการระดับโลกว่าด้วยกิจกรรมทางกาย (GAPPA) ในปี พ.ศ. 2561 และมติระดับภูมิภาคใน WHO-SEARO ในปี พ.ศ. 2560 สสส. มีส่วนร่วมอย่างแข็งขันในการส่งเสริมการพัฒนา สภาพแวดล้อมที่ใช้งานตั้งแต่ปี 2013 ก่อนที่จะมีการจัดตั้ง GAPPA เสียด้วยซ้ำ โครงการเริ่มแรกชื่อ "Healthy Space" มีวัตถุประสงค์เพื่อสร้างพื้นที่และสถานที่ที่ให้โอกาสในการออกกำลังกายมากขึ้น เป็นความพยายามร่วมกันที่เกี่ยวข้องกับพันธมิตรจากภาคส่วนต่างๆ นอกเหนือจากการดูแลสุขภาพ เมื่อเวลาผ่านไป โครงการริเริ่มนี้ได้พัฒนาจนเป็นหนึ่งในโครงการสำคัญของสสส. ซึ่งเรียกว่า โครงการพื้นที่เพื่อสุขภาพ (HSP) อย่างไรก็ตาม สถานะปัจจุบันของ HSP ครอบคลุมเพียงขอบเขตเดียวของการออกกำลังกาย: การออกกำลังกายเพื่อสันทนาการ มีอีกโดเมนที่สำคัญอีกประการหนึ่งของการออกกำลังกายที่ต้องจำ: การออกกำลังกายแบบขนส่ง',
      objective:
        'ประเทศไทยได้รับการยอมรับว่าเป็นผู้นำระดับโลกและระดับภูมิภาคในการส่งเสริมการออกกำลังกาย ด้วยตระหนักถึงประโยชน์ต่อสุขภาพของการออกกำลังกาย ในปี พ.ศ. 2560 ประเทศไทยและประเทศสมาชิกอื่นๆ จากภูมิภาคเอเชียตะวันออกเฉียงใต้เห็นพ้องกันว่าจำเป็นต้องมีการดำเนินการที่เป็นรูปธรรมมากขึ้นในการส่งเสริมการออกกำลังกาย และตัดสินใจจัดทำข้อมติ RC SEA/RC69/R4 ว่าด้วยการส่งเสริมกิจกรรมทางกาย ในภูมิภาคเอเชียตะวันออกเฉียงใต้ ประเทศไทยยังเห็นชอบข้อเสนอเพื่อจัดทำรายงานและร่างแผนปฏิบัติการระดับโลกด้านกิจกรรมทางกายด้วย แผนปฏิบัติการระดับโลก (GAPPA) ได้รับการพิจารณาโดยสมัชชาอนามัยโลกในเดือนพฤษภาคม พ.ศ. 2561 ผ่านการประชุมคณะกรรมการบริหารครั้งที่ 142 ในเดือนมกราคม พ.ศ. 2561 อย่างไรก็ตาม สถานการณ์การออกกำลังกายในประเทศไทยไม่ได้สะท้อนถึงความเป็นผู้นำที่กระตือรือร้นของประเทศในเวทีโลก ข้อมูลล่าสุดเกี่ยวกับสถานการณ์การออกกำลังกายของประเทศไทย (WHO-SEARO, 2018) แสดงให้เห็นว่าเด็กในประเทศไทยร้อยละ 15 ยังคงเป็นโรคอ้วน และวัยรุ่นร้อยละ 84.4 มีการออกกำลังกายไม่เพียงพอ\n\nความสำคัญของสภาพแวดล้อมที่สร้างขึ้นในฐานะปัจจัยสำคัญที่มีอิทธิพลต่อสุขภาพได้รับการยอมรับมากขึ้น เนื่องจากมีศักยภาพที่จะส่งผลกระทบเชิงบวกหรือเชิงลบต่อการออกกำลังกาย สิ่งสำคัญประการหนึ่งของโครงสร้างพื้นฐานด้านสุขภาพที่สามารถมีอิทธิพลอย่างมากต่อสุขภาพและความเป็นอยู่ที่ดีคือความพร้อมของพื้นที่เปิดโล่งสีเขียวและสวนสาธารณะ มุมมองนี้สอดคล้องกับความคิดริเริ่มระดับโลกที่โดดเด่นสองประการในสภาพแวดล้อมในเมือง: เป้าหมายที่ 11 ของเป้าหมายการพัฒนาที่ยั่งยืน (SDGs) และวาระการพัฒนาเมืองใหม่ (NUA) โครงการริเริ่มทั้งสองนี้มีจุดมุ่งหมายเพื่อปรับปรุงสุขภาพและความเป็นอยู่ที่ดีในระดับโลกโดยการสร้างสภาพแวดล้อมที่สร้างขึ้นเพื่อส่งเสริมสุขภาพที่ดี\n\nสสส. ได้แสดงให้เห็นถึงความมุ่งมั่นในการส่งเสริมการออกกำลังกายผ่านการมีส่วนร่วมในการสนับสนุนแผนปฏิบัติการระดับโลกว่าด้วยกิจกรรมทางกาย (GAPPA) ในปี พ.ศ. 2561 และมติระดับภูมิภาคใน WHO-SEARO ในปี พ.ศ. 2560 สสส. มีส่วนร่วมอย่างแข็งขันในการส่งเสริมการพัฒนา สภาพแวดล้อมที่ใช้งานตั้งแต่ปี 2013 ก่อนที่จะมีการจัดตั้ง GAPPA เสียด้วยซ้ำ โครงการเริ่มแรกชื่อ "Healthy Space" มีวัตถุประสงค์เพื่อสร้างพื้นที่และสถานที่ที่ให้โอกาสในการออกกำลังกายมากขึ้น เป็นความพยายามร่วมกันที่เกี่ยวข้องกับพันธมิตรจากภาคส่วนต่างๆ นอกเหนือจากการดูแลสุขภาพ เมื่อเวลาผ่านไป โครงการริเริ่มนี้ได้พัฒนาจนเป็นหนึ่งในโครงการสำคัญของสสส. ซึ่งเรียกว่า โครงการพื้นที่เพื่อสุขภาพ (HSP) อย่างไรก็ตาม สถานะปัจจุบันของ HSP ครอบคลุมเพียงขอบเขตเดียวของการออกกำลังกาย: การออกกำลังกายเพื่อสันทนาการ มีอีกโดเมนที่สำคัญอีกประการหนึ่งของการออกกำลังกายที่ต้องจำ: การออกกำลังกายแบบขนส่ง',
      marketing: {
        online: {
          available: {
            facebook: false,
            website: false,
            onlinePage: true,
            other: false,
          },
        },
        offline: {
          available: {
            pr: true,
            localOfficial: true,
            booth: true,
            billboard: false,
            tv: true,
            other: false,
          },
        },
      },
      score: {
        q_1_1: 5,
        q_1_2: 4,
        q_1_3: 3,
        q_1_4: 2,
        q_1_5: 1,
        q_1_6: 2,
        q_1_7: 3,
        q_1_8: 4,
        q_1_9: 5,
        q_1_10: 5,
        q_1_11: 4,
      },
      safety: {
        ready: {
          runnerInformation: true,
          healthDecider: false,
          ambulance: true,
          firstAid: false,
          aed: false,
          volunteerDoctor: true,
          insurance: false,
          other: false,
        },
      },
      route: {
        measurement: {
          athleticsAssociation: true,
          calibratedBicycle: true,
          selfMeasurement: false,
        },
        trafficManagement: {
          askPermission: true,
          hasSupporter: true,
          roadClosure: true,
          signs: false,
          lighting: false,
        },
      },
      judge: {
        type: 'auto',
      },
      support: {
        organization: {
          provincialAdministration: true,
          safety: true,
          health: true,
          volunteer: false,
          community: false,
          other: false,
        },
      },
      feedback:
        'ประเทศไทยได้รับการยอมรับว่าเป็นผู้นำระดับโลกและระดับภูมิภาคในการส่งเสริมการออกกำลังกาย ด้วยตระหนักถึงประโยชน์ต่อสุขภาพของการออกกำลังกาย ในปี พ.ศ. 2560 ประเทศไทยและประเทศสมาชิกอื่นๆ จากภูมิภาคเอเชียตะวันออกเฉียงใต้เห็นพ้องกันว่าจำเป็นต้องมีการดำเนินการที่เป็นรูปธรรมมากขึ้นในการส่งเสริมการออกกำลังกาย และตัดสินใจจัดทำข้อมติ RC SEA/RC69/R4 ว่าด้วยการส่งเสริมกิจกรรมทางกาย ในภูมิภาคเอเชียตะวันออกเฉียงใต้ ประเทศไทยยังเห็นชอบข้อเสนอเพื่อจัดทำรายงานและร่างแผนปฏิบัติการระดับโลกด้านกิจกรรมทางกายด้วย แผนปฏิบัติการระดับโลก (GAPPA) ได้รับการพิจารณาโดยสมัชชาอนามัยโลกในเดือนพฤษภาคม พ.ศ. 2561 ผ่านการประชุมคณะกรรมการบริหารครั้งที่ 142 ในเดือนมกราคม พ.ศ. 2561 อย่างไรก็ตาม สถานการณ์การออกกำลังกายในประเทศไทยไม่ได้สะท้อนถึงความเป็นผู้นำที่กระตือรือร้นของประเทศในเวทีโลก ข้อมูลล่าสุดเกี่ยวกับสถานการณ์การออกกำลังกายของประเทศไทย (WHO-SEARO, 2018) แสดงให้เห็นว่าเด็กในประเทศไทยร้อยละ 15 ยังคงเป็นโรคอ้วน และวัยรุ่นร้อยละ 84.4 มีการออกกำลังกายไม่เพียงพอ\n\nความสำคัญของสภาพแวดล้อมที่สร้างขึ้นในฐานะปัจจัยสำคัญที่มีอิทธิพลต่อสุขภาพได้รับการยอมรับมากขึ้น เนื่องจากมีศักยภาพที่จะส่งผลกระทบเชิงบวกหรือเชิงลบต่อการออกกำลังกาย สิ่งสำคัญประการหนึ่งของโครงสร้างพื้นฐานด้านสุขภาพที่สามารถมีอิทธิพลอย่างมากต่อสุขภาพและความเป็นอยู่ที่ดีคือความพร้อมของพื้นที่เปิดโล่งสีเขียวและสวนสาธารณะ มุมมองนี้สอดคล้องกับความคิดริเริ่มระดับโลกที่โดดเด่นสองประการในสภาพแวดล้อมในเมือง: เป้าหมายที่ 11 ของเป้าหมายการพัฒนาที่ยั่งยืน (SDGs) และวาระการพัฒนาเมืองใหม่ (NUA) โครงการริเริ่มทั้งสองนี้มีจุดมุ่งหมายเพื่อปรับปรุงสุขภาพและความเป็นอยู่ที่ดีในระดับโลกโดยการสร้างสภาพแวดล้อมที่สร้างขึ้นเพื่อส่งเสริมสุขภาพที่ดี\n\nสสส. ได้แสดงให้เห็นถึงความมุ่งมั่นในการส่งเสริมการออกกำลังกายผ่านการมีส่วนร่วมในการสนับสนุนแผนปฏิบัติการระดับโลกว่าด้วยกิจกรรมทางกาย (GAPPA) ในปี พ.ศ. 2561 และมติระดับภูมิภาคใน WHO-SEARO ในปี พ.ศ. 2560 สสส. มีส่วนร่วมอย่างแข็งขันในการส่งเสริมการพัฒนา สภาพแวดล้อมที่ใช้งานตั้งแต่ปี 2013 ก่อนที่จะมีการจัดตั้ง GAPPA เสียด้วยซ้ำ โครงการเริ่มแรกชื่อ "Healthy Space" มีวัตถุประสงค์เพื่อสร้างพื้นที่และสถานที่ที่ให้โอกาสในการออกกำลังกายมากขึ้น เป็นความพยายามร่วมกันที่เกี่ยวข้องกับพันธมิตรจากภาคส่วนต่างๆ นอกเหนือจากการดูแลสุขภาพ เมื่อเวลาผ่านไป โครงการริเริ่มนี้ได้พัฒนาจนเป็นหนึ่งในโครงการสำคัญของสสส. ซึ่งเรียกว่า โครงการพื้นที่เพื่อสุขภาพ (HSP) อย่างไรก็ตาม สถานะปัจจุบันของ HSP ครอบคลุมเพียงขอบเขตเดียวของการออกกำลังกาย: การออกกำลังกายเพื่อสันทนาการ มีอีกโดเมนที่สำคัญอีกประการหนึ่งของการออกกำลังกายที่ต้องจำ: การออกกำลังกายแบบขนส่ง',
    });

    // patch details.online.howTo.onlinePage
    this.onHasOnlinePageChanged();
    this.form.patchValue({
      details: {
        marketing: {
          online: {
            howTo: {
              onlinePage: 'Test Page',
            },
          },
        },
      },
    });
  }
}
