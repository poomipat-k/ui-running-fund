import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-com-progress-bar-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar-steps.component.html',
  styleUrl: './progress-bar-steps.component.scss',
})
export class ProgressBarStepsComponent {
  @Input() currentStep = 0;
  @Input() startStep = 1;
  @Input() steps: string[][] = [];
}
