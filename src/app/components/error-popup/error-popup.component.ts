import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-com-error-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-popup.component.html',
  styleUrl: './error-popup.component.scss',
})
export class ErrorPopupComponent {
  @Input() displayText: string;
}
