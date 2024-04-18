import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-com-input-text',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent {
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() placeholder = '';
  @Input() width = '100%';
  @Input() height = '4.4rem';
  @Input() margin = '0';
}
