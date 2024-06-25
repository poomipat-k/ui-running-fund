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
import { RadioComponent } from '../../components/radio/radio.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-applicant-fund-request',
  standalone: true,
  imports: [
    InputNumberComponent,
    InputTextComponent,
    ReactiveFormsModule,
    CheckboxComponent,
    RadioComponent,
    CommonModule,
    TextareaComponent,
  ],
  templateUrl: './fund-request.component.html',
  styleUrl: './fund-request.component.scss',
})
export class FundRequestComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;
  @Input() devModeOn = false;

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

  get needSeminar(): boolean {
    return this.form.value.fund.request.type.seminar;
  }

  get needOther(): boolean {
    return this.form.value.fund.request.type.other;
  }

  get errorAtLeastOneRequired(): boolean {
    return !!this.form.get('fund.request.type')?.errors?.[
      'requiredCheckBoxToBeChecked'
    ];
  }

  constructor() {
    this.onNeedFundChanged = this.onNeedFundChanged.bind(this);
    this.onNeedBibChanged = this.onNeedBibChanged.bind(this);
    this.onNeedSeminarChanged = this.onNeedSeminarChanged.bind(this);
    this.onNeedOtherChanged = this.onNeedOtherChanged.bind(this);
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

  onNeedSeminarChanged() {
    if (this.needSeminar) {
      const control = new FormControl(null, Validators.required);
      this.requestDetailsFormGroup.addControl('seminar', control);
      return;
    }
    this.requestDetailsFormGroup.removeControl('seminar');
  }

  onNeedOtherChanged() {
    if (this.needOther) {
      const control = new FormControl(null, Validators.required);
      this.requestDetailsFormGroup.addControl('other', control);
      return;
    }
    this.requestDetailsFormGroup.removeControl('other');
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

  protected patchForm() {
    const group = this.form.get('fund') as FormGroup;
    group.patchValue({
      budget: {
        total: 300000,
        supportOrganization:
          '4.\nประเทศไทยได้รับการยอมรับว่าเป็นผู้นำระดับโลกและระดับภูมิภาคในการส่งเสริมการออกกำลังกาย ด้วยตระหนักถึงประโยชน์ต่อสุขภาพของการออกกำลังกาย ในปี พ.ศ. 2560 ประเทศไทยและประเทศสมาชิกอื่นๆ จากภูมิภาคเอเชียตะวันออกเฉียงใต้เห็นพ้องกันว่าจำเป็นต้องมีการดำเนินการที่เป็นรูปธรรมมากขึ้นในการส่งเสริมการออกกำลังกาย และตัดสินใจจัดทำข้อมติ RC SEA/RC69/R4 ว่าด้วยการส่งเสริมกิจกรรมทางกาย ในภูมิภาคเอเชียตะวันออกเฉียงใต้ ประเทศไทยยังเห็นชอบข้อเสนอเพื่อจัดทำรายงานและร่างแผนปฏิบัติการระดับโลกด้านกิจกรรมทางกายด้วย แผนปฏิบัติการระดับโลก (GAPPA) ได้รับการพิจารณาโดยสมัชชาอนามัยโลกในเดือนพฤษภาคม พ.ศ. 2561 ผ่านการประชุมคณะกรรมการบริหารครั้งที่ 142 ในเดือนมกราคม พ.ศ. 2561 อย่างไรก็ตาม สถานการณ์การออกกำลังกายในประเทศไทยไม่ได้สะท้อนถึงความเป็นผู้นำที่กระตือรือร้นของประเทศในเวทีโลก ข้อมูลล่าสุดเกี่ยวกับสถานการณ์การออกกำลังกายของประเทศไทย (WHO-SEARO, 2018) แสดงให้เห็นว่าเด็กในประเทศไทยร้อยละ 15 ยังคงเป็นโรคอ้วน และวัยรุ่นร้อยละ 84.4 มีการออกกำลังกายไม่เพียงพอ\n\nความสำคัญของสภาพแวดล้อมที่สร้างขึ้นในฐานะปัจจัยสำคัญที่มีอิทธิพลต่อสุขภาพได้รับการยอมรับมากขึ้น เนื่องจากมีศักยภาพที่จะส่งผลกระทบเชิงบวกหรือเชิงลบต่อการออกกำลังกาย สิ่งสำคัญประการหนึ่งของโครงสร้างพื้นฐานด้านสุขภาพที่สามารถมีอิทธิพลอย่างมากต่อสุขภาพและความเป็นอยู่ที่ดีคือความพร้อมของพื้นที่เปิดโล่งสีเขียวและสวนสาธารณะ มุมมองนี้สอดคล้องกับความคิดริเริ่มระดับโลกที่โดดเด่นสองประการในสภาพแวดล้อมในเมือง: เป้าหมายที่ 11 ของเป้าหมายการพัฒนาที่ยั่งยืน (SDGs) และวาระการพัฒนาเมืองใหม่ (NUA) โครงการริเริ่มทั้งสองนี้มีจุดมุ่งหมายเพื่อปรับปรุงสุขภาพและความเป็นอยู่ที่ดีในระดับโลกโดยการสร้างสภาพแวดล้อมที่สร้างขึ้นเพื่อส่งเสริมสุขภาพที่ดี\n\nสสส. ได้แสดงให้เห็นถึงความมุ่งมั่นในการส่งเสริมการออกกำลังกายผ่านการมีส่วนร่วมในการสนับสนุนแผนปฏิบัติการระดับโลกว่าด้วยกิจกรรมทางกาย (GAPPA) ในปี พ.ศ. 2561 และมติระดับภูมิภาคใน WHO-SEARO ในปี พ.ศ. 2560 สสส. มีส่วนร่วมอย่างแข็งขันในการส่งเสริมการพัฒนา สภาพแวดล้อมที่ใช้งานตั้งแต่ปี 2013 ก่อนที่จะมีการจัดตั้ง GAPPA เสียด้วยซ้ำ โครงการเริ่มแรกชื่อ "Healthy Space" มีวัตถุประสงค์เพื่อสร้างพื้นที่และสถานที่ที่ให้โอกาสในการออกกำลังกายมากขึ้น เป็นความพยายามร่วมกันที่เกี่ยวข้องกับพันธมิตรจากภาคส่วนต่างๆ นอกเหนือจากการดูแลสุขภาพ เมื่อเวลาผ่านไป โครงการริเริ่มนี้ได้พัฒนาจนเป็นหนึ่งในโครงการสำคัญของสสส. ซึ่งเรียกว่า โครงการพื้นที่เพื่อสุขภาพ (HSP) อย่างไรก็ตาม สถานะปัจจุบันของ HSP ครอบคลุมเพียงขอบเขตเดียวของการออกกำลังกาย: การออกกำลังกายเพื่อสันทนาการ มีอีกโดเมนที่สำคัญอีกประการหนึ่งของการออกกำลังกายที่ต้องจำ: การออกกำลังกายแบบขนส่ง',
        noAlcoholSponsor: true,
      },
      request: {
        type: {
          fund: false,
          bib: false,
          pr: true,
          seminar: false,
          other: false,
        },
        details: {},
      },
    });
  }
}
