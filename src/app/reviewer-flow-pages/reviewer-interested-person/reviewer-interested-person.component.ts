import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-reviewer-interested-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reviewer-interested-person.component.html',
  styleUrls: ['./reviewer-interested-person.component.scss'],
})
export class ReviewerInterestedPerson implements OnInit {
  @Input() form: FormGroup;

  protected reviewerFullName = 'ชื่อผู้ทรงคุณวุฒิ';
  protected projectName = 'ชื่อโครงการขอทุนสนับสนุน';
  protected showDetailsQuestion = false;

  // Component fields
  private fieldNames: string[] = ['isInterestedPerson'];

  ngOnInit(): void {
    // Enable disable state
  }

  public isFormValid(): boolean {
    const controls = this.fieldNames.map((f) => this.form.get(f));
    return !controls.some((c) => !c?.valid);
  }

  onIsInterestedPersonChanged() {
    console.log('===onIsInterestedPersonChanged', this.form.value);
    if (this.form.value?.isInterestedPerson) {
      this.showDetailsQuestion = true;
    } else {
      this.showDetailsQuestion = false;
    }
  }
}
