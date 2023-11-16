import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { CheckboxOption } from '../../shared/models/checkbox-option';
import { RadioOption } from '../../shared/models/radio-option';
import { ReviewCriteria } from '../../shared/models/review-criteria';
import { requiredCheckBoxToBeCheckedValidator } from '../../shared/validators/requiredCheckbox';
import { criteiaGroup } from '../data/criteria-group';

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
export class ReviewerScoreComponent implements OnInit {
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

  protected groupHeaders: { id: number; groupName: string }[] = [];

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
      display: 'ความน่าเชื่อถือและประสบการณ์การจัดงาน',
      value: 'experience_and_reliability',
    },
    {
      id: 6,
      display: 'งบประมาณที่ขอรับการสนับสนุน และผลที่คาดว่าจะได้รับ',
      value: 'fund_and_output',
    },
  ];

  get scoreFormGroupControl(): FormGroup {
    return this.form.get('score') as FormGroup;
  }

  constructor() {}

  ngOnInit(): void {
    this.groupHeaders = criteiaGroup;
  }

  onSummaryRadioChanged(): void {
    const group = this.form.get('score') as FormGroup;
    if (this.form.value?.score?.summary === 'to_be_revised') {
      const improvementFormGroup = new FormGroup(
        {
          project_quality: new FormControl(false),
          standard: new FormControl(false),
          vision_and_image: new FormControl(false),
          benefit: new FormControl(false),
          experience_and_reliability: new FormControl(false),
          fund_and_output: new FormControl(false),
        },
        requiredCheckBoxToBeCheckedValidator()
      );
      group.addControl('improvement', improvementFormGroup);
      return;
    }
    group.removeControl('improvement');
    return;
  }

  fillAll() {
    const control = this.form.get('score') as FormGroup;
    const option: { [key: string]: number } = {};
    for (let i = 1; i <= 20; i++) {
      option[`1_${i}`] = Math.ceil(Math.random() * 5);
    }
    control.patchValue(option);
  }

  buildControlName(c: ReviewCriteria): string {
    return `${c.criteriaVersion}_${c.orderNumber}`;
  }

  buildFormAccessName(c: ReviewCriteria) {
    return `score.${c.criteriaVersion}_${c.orderNumber}`;
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
    return `${criteria.groupNumber}.${criteria.inGroupNumber} ${criteria.displayText}`;
  }
}
