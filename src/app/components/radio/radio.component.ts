import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
  @Input() options: RadioOption[] = [];
  @Input() controlName = '';
  @Input() onChanged: () => void;
  @Input() radioStyle = 'review-1';

  get labelClasses(): string[] {
    const classes = ['radio__container', 'radio__label'];
    if (this.radioStyle === 'review-1') {
      classes.push('radio__container--review-1');
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
