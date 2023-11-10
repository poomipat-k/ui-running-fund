import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
      id: 1,
      display:
        'ไม่มีส่วนเกี่ยวข้อง หรือมีส่วนได้เสียโดยตรงกับผู้เสนอแผนงาน ชุดโครงการ หรือโครงการ',
      value: false,
    },
    {
      id: 2,
      display:
        'มีส่วนเกี่ยวข้อง หรือมีส่วนได้เสียโดยตรงกับผู้เสนอแผนงาน ชุดโครงการ หรือโครงการ ดังนี้',
      value: true,
    },
  ];

  protected interestedPersonTypeOptions: RadioOption[] =
    InterestedPersonTypeData;

  // Component fields
  private fieldNames: string[] = ['isInterestedPerson', 'interestedPersonType'];

  get containerClass(): string[] {
    return this.form.value?.isInterestedPerson
      ? ['container', 'container--expand']
      : ['container'];
  }

  constructor() {}

  ngOnInit(): void {}

  onInterestedPersonChanged(): void {
    if (!this.form.value?.isInterestedPerson) {
      this.form.removeControl('interestedPersonType');
      return;
    }
    this.form.addControl(
      'interestedPersonType',
      new FormControl(null, Validators.required)
    );
  }

  public isFormValid(): boolean {
    const controls = this.fieldNames
      .map((f) => this.form.get(f))
      .filter((c) => !!c);
    return !controls.some((c) => !c?.valid);
  }
}
