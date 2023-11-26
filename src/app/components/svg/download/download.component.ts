import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-com-svg-download',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class SVGDownloadComponent {
  @Input() hoverOverDownloadLink = false;
}
