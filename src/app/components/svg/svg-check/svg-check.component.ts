import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-com-svg-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-check.component.html',
  styleUrl: './svg-check.component.scss',
})
export class SvgCheckComponent {
  @Input() svgClass = 'size--dashboard';
  @Input() pathClass = 'color--green';
}
