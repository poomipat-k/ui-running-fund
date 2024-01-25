import { ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-applicant-attachment',
  standalone: true,
  imports: [],
  templateUrl: './attachment.component.html',
  styleUrl: './attachment.component.scss',
})
export class AttachmentComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);
}
