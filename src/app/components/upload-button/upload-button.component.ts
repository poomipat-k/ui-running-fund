import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-com-upload-button',
  standalone: true,
  imports: [],
  templateUrl: './upload-button.component.html',
  styleUrl: './upload-button.component.scss',
})
export class UploadButtonComponent {
  @Input() text = 'เลือกไฟล์';
  @Input() disabled = false;
}
