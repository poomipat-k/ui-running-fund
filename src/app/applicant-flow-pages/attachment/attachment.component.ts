import { ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';

@Component({
  selector: 'app-applicant-attachment',
  standalone: true,
  imports: [UploadButtonComponent],
  templateUrl: './attachment.component.html',
  styleUrl: './attachment.component.scss',
})
export class AttachmentComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  @Input() proposalSubject: BehaviorSubject<File[]>;
  @Input() marketingSubject: BehaviorSubject<File[]>;
  @Input() routeSubject: BehaviorSubject<File[]>;
  @Input() eventMapSubject: BehaviorSubject<File[]>;
  @Input() eventDetailsSubject: BehaviorSubject<File[]>;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);
}
