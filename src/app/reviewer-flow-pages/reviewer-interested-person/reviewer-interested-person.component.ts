import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RadioComponent } from '../../components/radio/radio.component';
import { RadioOption } from '../../shared/models/radio-option';
import { InterestedPersonTypeData } from './radio-options';

@Component({
  selector: 'app-review-reviewer-interested-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RadioComponent],
  templateUrl: './reviewer-interested-person.component.html',
  styleUrls: ['./reviewer-interested-person.component.scss'],
})
export class ReviewerInterestedPerson implements OnInit {
  @Input() form: FormGroup;

  protected reviewerFullName = 'ชื่อผู้ทรงคุณวุฒิ';
  protected projectName = 'ชื่อโครงการขอทุนสนับสนุน';
  protected showDetailsQuestion = false;

  protected interestedPersonOptions: RadioOption[] = [
    {
      display:
        'ไม่มีส่วนเกี่ยวข้อง หรือมีส่วนได้เสียโดยตรงกับผู้เสนอแผนงาน ชุดโครงการ หรือโครงการ',
      value: false,
    },
    {
      display:
        'มีส่วนเกี่ยวข้อง หรือมีส่วนได้เสียโดยตรงกับผู้เสนอแผนงาน ชุดโครงการ หรือโครงการ ดังนี้',
      value: true,
    },
  ];

  protected interestedPersonTypeOptions: RadioOption[] =
    InterestedPersonTypeData;

  // Component fields
  private fieldNames: string[] = ['isInterestedPerson'];

  get containerClass(): string[] {
    return this.form.value?.isInterestedPerson
      ? ['container', 'container--expand']
      : ['container'];
  }

  constructor() {}

  ngOnInit(): void {}

  public isFormValid(): boolean {
    const controls = this.fieldNames.map((f) => this.form.get(f));
    return !controls.some((c) => !c?.valid);
  }
}
