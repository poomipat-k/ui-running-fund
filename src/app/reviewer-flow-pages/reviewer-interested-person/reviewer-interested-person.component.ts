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
  @Input() userFullName = '';
  @Input() projectName = '';

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

  get containerClass(): string[] {
    return this.form.value?.ip?.isInterestedPerson
      ? ['container', 'container--expand']
      : ['container'];
  }

  get showError1(): boolean {
    return (
      !this.form.get('ip.isInterestedPerson')?.valid &&
      (this.form.get('ip.isInterestedPerson')?.touched ?? false)
    );
  }

  get showError2(): boolean {
    return (
      !this.form.get('ip.interestedPersonType')?.valid &&
      (this.form.get('ip.interestedPersonType')?.touched ?? false)
    );
  }

  get ipFormGroup(): FormGroup {
    return this.form.get('ip') as FormGroup;
  }

  constructor() {
    this.onInterestedPersonChanged = this.onInterestedPersonChanged.bind(this);
  }

  ngOnInit(): void {}

  onInterestedPersonChanged(): void {
    const groupControl = this.form.get('ip') as FormGroup;
    if (this.form.value?.ip?.isInterestedPerson) {
      groupControl.addControl(
        'interestedPersonType',
        new FormControl(null, Validators.required)
      );
      return;
    }
    (groupControl as FormGroup)?.removeControl('interestedPersonType');
  }

  private markFieldsTouched() {
    const isInterestedPersonControl = this.form.get('ip.isInterestedPerson');
    const interestedPersonTypeControl = this.form.get(
      'ip.interestedPersonType'
    );
    if (isInterestedPersonControl) {
      isInterestedPersonControl.markAsTouched({ onlySelf: true });
    }
    if (interestedPersonTypeControl) {
      interestedPersonTypeControl.markAsTouched({ onlySelf: true });
    }
  }

  public validToGoNext(): boolean {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    } else {
      return true;
    }
  }

  private isFormValid(): boolean {
    const ipGroup = this.form.get('ip');
    if (ipGroup?.disabled) {
      return true;
    }
    return ipGroup?.valid ?? false;
  }
}
