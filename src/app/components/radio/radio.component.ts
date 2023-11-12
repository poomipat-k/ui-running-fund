import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-com-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() groupName: string;
  @Input() controlName = '';
  @Input() options: RadioOption[] = [];
  @Input() onChanged: () => void;
  @Input() radioStyle = 'review-1a';

  get labelClasses(): string[] {
    const classes = ['radio__container', 'radio__label'];
    if (this.radioStyle === 'review-1a') {
      classes.push('radio__container--review-1a');
    } else if (this.radioStyle === 'review-1b') {
      classes.push('radio__container--review-1b');
    }
    return classes;
  }

  ngOnInit(): void {
    if (this.onChanged) {
      this._onChanged = this.onChanged;
    }
  }

  _onChanged() {}
}
