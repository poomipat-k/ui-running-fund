import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-com-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  // Form version
  @Input() form: FormGroup;
  @Input() groupName: string;
  @Input() controlName: string;
  @Input() display: string;
  @Input() disabled = false;
  // View version
  @Input() value: any;
  @Input() name: string;
  @Input() checked = false;
}
