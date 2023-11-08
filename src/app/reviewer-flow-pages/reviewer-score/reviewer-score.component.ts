import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviewer-score',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reviewer-score.component.html',
  styleUrls: ['./reviewer-score.component.scss'],
})
export class ReviewerScoreComponent {
  @Input() form: FormGroup;

  onClick() {
    console.log('+++Onclick');
    console.log(this.form);
  }
}
