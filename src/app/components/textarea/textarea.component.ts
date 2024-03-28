import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-com-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent {
  @Input() form: FormGroup;
  @Input() controlName: string;

  @Input() placeholder = '';
  @Input() width = '100%';
  @Input() height = '15.8rem';
}
