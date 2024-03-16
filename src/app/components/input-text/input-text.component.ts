import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ScreenshotService } from '../../services/screenshot.service';

@Component({
  selector: 'app-com-input-text',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent implements OnInit {
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
