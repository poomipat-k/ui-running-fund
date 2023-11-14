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
  @Input() direction = 'vertical';

  get labelClasses(): string[] {
    if (this.radioStyle === 'review-1a') {
      return ['radio__container', 'radio__container--review-1a'];
    } else if (this.radioStyle === 'review-1b') {
      return ['radio__container', 'radio__container--review-1b'];
    } else if (this.radioStyle === 'review-3a') {
      return ['radio__container', 'radio__container--review-3a'];
    } else if (this.radioStyle === 'review-3b') {
      return ['radio__container', 'radio__container--review-3b'];
    }
    return ['radio__container'];
  }

  ngOnInit(): void {
    if (this.onChanged) {
      this._onChanged = this.onChanged;
    }
  }

  _onChanged() {}
}
