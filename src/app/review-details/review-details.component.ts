import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.scss'],
})
export class ReviewDetailsComponent {
  // url params
  @Input() projectId: string;
}
