import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-com-checkbox-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  @Input() value: any;
  @Input() name: string;
  @Input() display: string;
  @Input() disabled = false;
  @Input() checked = false;
}
