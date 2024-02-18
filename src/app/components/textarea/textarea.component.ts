import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ScreenshotService } from '../../services/screenshot.service';

@Component({
  selector: 'app-com-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() controlName: string;

  @Input() placeholder = '';
  @Input() width = '100%';
  @Input() height = '15.8rem';

  protected capturing = false;

  private readonly screenshotService: ScreenshotService =
    inject(ScreenshotService);

  get captureDisplay() {
    return this.form?.value?.[this.controlName] || '';
  }

  ngOnInit(): void {
    this.screenshotService.screenshotCapturing$.subscribe((capturing) => {
      this.capturing = capturing;
    });
  }
}
