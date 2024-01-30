import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-com-input-number',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
})
export class InputNumberComponent {
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() placeholder = '';
  @Input() width = '100%';
  @Input() margin = '0';
}
