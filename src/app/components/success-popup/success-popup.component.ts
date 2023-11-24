import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgCheckComponent } from '../svg/svg-check/svg-check.component';

@Component({
  selector: 'app-com-success-popup',
  standalone: true,
  imports: [CommonModule, SvgCheckComponent],
  templateUrl: './success-popup.component.html',
  styleUrl: './success-popup.component.scss',
})
export class SuccessPopupComponent {
  @Input() displayText: string;
}
