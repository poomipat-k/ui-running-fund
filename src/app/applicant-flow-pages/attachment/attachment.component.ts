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

  @Input() marketingSubject: BehaviorSubject<File[]>;
  @Input() routeSubject: BehaviorSubject<File[]>;
  @Input() eventMapSubject: BehaviorSubject<File[]>;
  @Input() eventDetailsSubject: BehaviorSubject<File[]>;

  @Input() marketingCount = 0;
  @Input() routeCount = 0;
  @Input() eventMapCount = 0;
  @Input() eventDetailsCount = 0;

  @Input() marketingUploadButtonTouched = false;
  @Input() routeUploadButtonTouched = false;
  @Input() eventMapUploadButtonTouched = false;
  @Input() eventDetailsUploadButtonTouched = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  public validToGoNext(): boolean {
    if (this.marketingCount === 0) {
      this.scrollToId('marketing');
      return false;
    }
    if (this.routeCount === 0) {
      this.scrollToId('route');
      return false;
    }
    if (this.eventMapCount === 0) {
      this.scrollToId('eventMap');
      return false;
    }
    if (this.eventDetailsCount === 0) {
      this.scrollToId('eventDetails');
      return false;
    }
    return true;
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 140]);
    this.scroller.scrollToAnchor(id);
  }
}
