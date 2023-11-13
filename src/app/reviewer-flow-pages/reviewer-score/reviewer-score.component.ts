import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReviewCriteria } from '../../shared/models/review-criteria';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reviewer-score',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reviewer-score.component.html',
  styleUrls: ['./reviewer-score.component.scss'],
})
export class ReviewerScoreComponent {
  @Input() form: FormGroup;
  @Input() criteriaList: ReviewCriteria[] = [];

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

  protected readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  protected buildQuestionText(criteria: ReviewCriteria): string {
    return `${criteria.group_number}.${criteria.in_group_number} ${criteria.display_text}`;
  }

  constructor() {}
}
