import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-com-checkbox-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox-view.component.html',
  styleUrl: './checkbox-view.component.scss',
})
export class CheckboxViewComponent {
  @Input() value: any;
  @Input() name: string;
  @Input() display: string;
  @Input() disabled = false;
  @Input() checked = false;
}
