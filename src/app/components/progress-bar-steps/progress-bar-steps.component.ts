import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgCheckComponent } from '../svg/svg-check/svg-check.component';

@Component({
  selector: 'app-com-progress-bar-steps',
  standalone: true,
  imports: [CommonModule, SvgCheckComponent],
  templateUrl: './progress-bar-steps.component.html',
  styleUrl: './progress-bar-steps.component.scss',
})
export class ProgressBarStepsComponent {
  @Input() currentStep = 0;
  @Input() startStep = 1;
  @Input() steps: string[][] = [];
  @Input() maxStep = 7;
}
