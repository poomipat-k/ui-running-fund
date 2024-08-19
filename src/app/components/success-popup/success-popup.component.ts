import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgCheckComponent } from '../svg/svg-check/svg-check.component';

@Component({
  selector: 'app-com-success-popup',
  standalone: true,
  imports: [CommonModule, SvgCheckComponent],
  templateUrl: './success-popup.component.html',
  styleUrl: './success-popup.component.scss',
  animations: [
    trigger('popup', [
      transition(':enter', [
        style({
          opacity: 0,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(1)',
          })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 0,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class SuccessPopupComponent {
  @Input() show = false;
  @Input() displayText: string;
}
