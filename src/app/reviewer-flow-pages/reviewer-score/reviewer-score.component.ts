import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { RadioComponent } from '../../components/radio/radio.component';
import { CheckboxOption } from '../../shared/models/checkbox-option';
import { RadioOption } from '../../shared/models/radio-option';
import { ReviewCriteria } from '../../shared/models/review-criteria';
import { requiredCheckBoxToBeCheckedValidator } from '../../shared/validators/requiredCheckbox';
import { criteriaGroup } from '../data/criteria-group';

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
  @Input() devModeOn = true;

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
      controlName: 'projectQuality',
    },
    {
      id: 2,
      display: 'มาตรฐานการจัดงานวิ่งเพื่อสุขภาพ',
      controlName: 'projectStandard',
    },
    {
      id: 3,
      display:
        'แนวทางและภาพลักษณ์ที่สอดคล้องสำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)',
      controlName: 'visionAndImage',
    },
    {
      id: 4,
      display: 'ประโยชน์ของการนำเสนอองค์กร สสส. ในการสนับสนุนทุนอุปถัมภ์',
      controlName: 'benefit',
    },
    {
      id: 5,
      display: 'ความน่าเชื่อถือและประสบการณ์การจัดงาน',
      controlName: 'experienceAndReliability',
    },
    {
      id: 6,
      display: 'งบประมาณที่ขอรับการสนับสนุน และผลที่คาดว่าจะได้รับ',
      controlName: 'fundAndOutput',
    },
  ];

  get reviewFormControlGroup(): FormGroup {
    return this.form.get('review') as FormGroup;
  }

  get scoresFormGroup(): FormGroup {
    return this.form.get('review.scores') as FormGroup;
  }

  get improvementFormGroup(): FormGroup {
    return this.form.get('review.improvement') as FormGroup;
  }

  constructor() {
    this.onSummaryRadioChanged = this.onSummaryRadioChanged.bind(this);
  }

  ngOnInit(): void {
    this.groupHeaders = criteriaGroup;
    this.devModeOn = !environment.production;
  }

  onSummaryRadioChanged(): void {
    const group = this.form.get('review') as FormGroup;
    if (this.form.value?.review?.reviewSummary === 'to_be_revised') {
      const improvementFormGroup = new FormGroup(
        {
          projectQuality: new FormControl(false),
          projectStandard: new FormControl(false),
          visionAndImage: new FormControl(false),
          benefit: new FormControl(false),
          experienceAndReliability: new FormControl(false),
          fundAndOutput: new FormControl(false),
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
    const control = this.form.get('review.scores') as FormGroup;
    const option: { [key: string]: number } = {};
    for (let i = 1; i <= 20; i++) {
      option[`q_1_${i}`] = Math.ceil(Math.random() * 5);
    }
    control.patchValue(option);
  }

  buildControlName(c: ReviewCriteria): string {
    return `q_${c.criteriaVersion}_${c.orderNumber}`;
  }

  buildFormAccessName(c: ReviewCriteria) {
    return `review.scores.q_${c.criteriaVersion}_${c.orderNumber}`;
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
    const group = this.form.get('review') as FormGroup;
    group.markAllAsTouched();

    // Score to first invalid element
    this.scrollToFirstInvalidItem();
  }

  private scrollToFirstInvalidItem() {
    const firstControlId = this.getFirstInvalidControl();
    if (firstControlId) {
      this.scroller.setOffset([0, 80]);
      this.scroller.scrollToAnchor(firstControlId);
    }
  }

  private getFirstInvalidControl(): string {
    const scoresGroup = this.form.get('review.scores') as FormGroup;
    const keys = Object.keys(scoresGroup.controls);
    for (const k of keys) {
      if (!scoresGroup.controls[k].valid) {
        return k;
      }
    }
    // Check if review.reviewSummary is valid
    const reviewSummary = this.form.get('review.reviewSummary');
    if (!reviewSummary?.valid) {
      return 'reviewSummary';
    }
    // Check if review.improvement is valid
    const improvement = this.form.get('review.improvement');
    if (!improvement?.valid) {
      return 'improvement';
    }
    return '';
  }

  private isFormValid(): boolean {
    const scoreGroup = this.form.get('review');
    if (scoreGroup?.disabled) {
      return true;
    }
    return scoreGroup?.valid ?? false;
  }

  protected buildQuestionText(criteria: ReviewCriteria): string {
    return `${criteria.groupNumber}.${criteria.inGroupNumber} ${criteria.displayText}`;
  }
}
