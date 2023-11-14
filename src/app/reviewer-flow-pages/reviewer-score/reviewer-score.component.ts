import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { RadioOption } from '../../shared/models/radio-option';
import { ReviewCriteria } from '../../shared/models/review-criteria';
import { CheckboxOption } from '../../shared/models/checkbox-option';

@Component({
  selector: 'app-reviewer-score',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioComponent,
    CheckboxComponent,
  ],
  templateUrl: './reviewer-score.component.html',
  styleUrls: ['./reviewer-score.component.scss'],
})
export class ReviewerScoreComponent {
  @Input() form: FormGroup;
  @Input() criteriaList: ReviewCriteria[] = [];

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  protected scoreOptions: RadioOption[] = [
    {
      id: 1,
      value: 1,
      display: 1,
    },
    {
      id: 2,
      value: 2,
      display: 2,
    },
    {
      id: 3,
      value: 3,
      display: 3,
    },
    {
      id: 4,
      value: 4,
      display: 4,
    },
    {
      id: 5,
      value: 5,
      display: 5,
    },
  ];

  protected groupHeaders = [
    {
      id: 1,
      groupName: '1. ความเป็นมา หลักการและเหตุผล มีความชัดเจนหรือไม่ อย่างไร',
    },
    {
      id: 2,
      groupName: '2. มาตรฐานการจัดงานวิ่งเพื่อสุขภาพ',
    },
    {
      id: 3,
      groupName:
        '3. แนวทางและภาพลักษณ์ที่สอดคล้องสำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)',
    },
    {
      id: 4,
      groupName: '4. ประโยชน์ของการนำเสนอองค์กร สสส. ในการสนับสนุนทุนอุปถัมภ์',
    },
    {
      id: 5,
      groupName: '5. ความน่าเชื่อถือและประสบการณ์การจัดงาน',
    },
    {
      id: 6,
      groupName: '6. งบประมาณที่ขอรับการสนับสนุน และผลที่คาดว่าจะได้รับ',
    },
  ];

  protected summaryDropdownOptions: RadioOption[] = [
    {
      id: 1,
      value: 'ok',
      display: 'โครงการมีความเหมาะสมต่อการสนับสนุนทุนอุปถัมภ์โดยไม่ต้องแก้ไข',
    },
    {
      id: 2,
      value: 'to_be_revised',
      display: 'โครงการจะต้องมีการปรับแก้ไขเพิ่มเติมรายละเอียดให้มีความเหมาะสม',
    },
    {
      id: 3,
      value: 'not_ok',
      display: 'ภาพรวมโครงการไม่มีความเหมาะสมต่อการสนับสนุนทุนอุปถัมภ์',
    },
  ];

  protected improvementCheckboxOptions: CheckboxOption[] = [
    {
      id: 1,
      display: 'คุณภาพข้อเสนอโครงการ',
      value: 'project_quality',
    },
    {
      id: 2,
      display: 'มาตรฐานการจัดงานวิ่งเพื่อสุขภาพ',
      value: 'standard',
    },
    {
      id: 3,
      display:
        'แนวทางและภาพลักษณ์ที่สอดคล้องสำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)',
      value: 'vision_and_image',
    },
    {
      id: 4,
      display: 'ประโยชน์ของการนำเสนอองค์กร สสส. ในการสนับสนุนทุนอุปถัมภ์',
      value: 'benefit',
    },
    {
      id: 5,
      display: 'คุณภาพข้อเสนอโครงการ',
      value: 'experience_and_reliability',
    },
    {
      id: 6,
      display: 'คุณภาพข้อเสนอโครงการ',
      value: 'fund_and_output',
    },
  ];

  onSummaryRadioChanged(): void {
    const group = this.form.get('score') as FormGroup;
    if (this.form.value?.score?.summary === 'to_be_revised') {
      console.log('===Add control');
      const improvementFormGroup = new FormGroup({
        project_quality: new FormControl(),
        standard: new FormControl(),
        vision_and_image: new FormControl(),
        benefit: new FormControl(),
        experience_and_reliability: new FormControl(),
        fund_and_output: new FormControl(),
      });
      group.addControl('improvement', improvementFormGroup);
      console.log('===group', group);
    } else {
      console.log('===removeControl');
      group.removeControl('improvement');
      console.log('===group', group);
    }
  }

  // onInterestedPersonChanged(): void {
  //   const groupControl = this.form.get('ip');
  //   if (this.form.value?.ip?.isInterestedPerson) {
  //     (this.form.get('ip') as FormGroup).addControl(
  //       'interestedPersonType',
  //       new FormControl(null, Validators.required)
  //     );
  //     return;
  //   }
  //   (groupControl as FormGroup)?.removeControl('interestedPersonType');
  // }

  buildControlName(c: ReviewCriteria): string {
    return `${c.criteria_version}_${c.order_number}`;
  }

  buildFormAccessName(c: ReviewCriteria) {
    return `score.${c.criteria_version}_${c.order_number}`;
  }

  validToGoNext(): boolean {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    } else {
      return true;
    }
  }

  private markFieldsTouched() {
    const group = this.form.get('score') as FormGroup;
    group.markAllAsTouched();

    // Score to first invalid element
    this.scrollToFirstInvalidItem(group);
  }

  private scrollToFirstInvalidItem(group: FormGroup) {
    const firstControlId = this.getFirstInvalidControl(group);
    if (firstControlId) {
      this.scroller.setOffset([0, 80]);
      this.scroller.scrollToAnchor(firstControlId);
    }
  }

  private getFirstInvalidControl(group: FormGroup): string {
    const keys = Object.keys(group.controls).sort();
    console.log(keys);
    for (const k of keys) {
      if (!group.controls[k].valid) {
        return k;
      }
    }
    return '';
  }

  private isFormValid(): boolean {
    return this.form.get('score')?.valid ?? false;
  }

  protected readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  protected buildQuestionText(criteria: ReviewCriteria): string {
    return `${criteria.group_number}.${criteria.in_group_number} ${criteria.display_text}`;
  }

  constructor() {}
}
