import { Component, Input } from '@angular/core';
import { SvgCheckComponent } from '../../components/svg/svg-check/svg-check.component';

@Component({
  selector: 'app-applicant-success',
  standalone: true,
  imports: [SvgCheckComponent],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
})
export class SuccessComponent {
  @Input() text = 'สร้างใบขอทุนสนับสนุนเรียบร้อยแล้ว';
}
