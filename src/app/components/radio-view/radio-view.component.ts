import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RadioOption } from '../../shared/models/radio-option';

@Component({
  selector: 'app-com-radio-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-view.component.html',
  styleUrl: './radio-view.component.scss',
})
export class RadioViewComponent {
  @Input() options: RadioOption[] = [];
  @Input() selectedValue: any;
  @Input() radioStyle = 'review-2a';
  @Input() name = 'radio';
  @Input() disabled = false;

  get labelClasses(): string[] {
    const classes = ['radio__container', 'radio__label'];
    if (this.radioStyle === 'review-2a') {
      classes.push('radio__container--review-2a');
    }
    if (this.disabled) {
      classes.push('radio__container--disabled');
    }
    return classes;
  }
}
