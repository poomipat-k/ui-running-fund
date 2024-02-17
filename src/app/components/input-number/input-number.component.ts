import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ScreenshotService } from '../../services/screenshot.service';

@Component({
  selector: 'app-com-input-number',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
})
export class InputNumberComponent {
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() placeholder = '';
  @Input() width = '100%';
  @Input() margin = '0';

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
