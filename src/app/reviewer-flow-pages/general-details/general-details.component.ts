import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-general-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.scss'],
})
export class GeneralDetailsComponent {
  protected projectName = 'ชื่อโครงการขอทุนสนับสนุน';
}
