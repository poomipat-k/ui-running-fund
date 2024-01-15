import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SvgCheckComponent } from '../../components/svg/svg-check/svg-check.component';

@Component({
  selector: 'app-review-success',
  standalone: true,
  imports: [CommonModule, SvgCheckComponent],
  templateUrl: './review-success.component.html',
  styleUrl: './review-success.component.scss',
})
export class ReviewSuccessComponent {}
