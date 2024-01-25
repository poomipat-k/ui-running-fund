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

  @Input() proposalCount = 0;
  @Input() marketingCount = 0;
  @Input() routeCount = 0;
  @Input() eventMapCount = 0;

  @Input() proposalUploadButtonTouched = false;
  @Input() marketingUploadButtonTouched = false;
  @Input() routeUploadButtonTouched = false;
  @Input() eventMapUploadButtonTouched = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  public validToGoNext(): boolean {
    if (this.proposalCount === 0) {
      this.scrollToId('proposal');
      return false;
    }
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
    return true;
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 140]);
    this.scroller.scrollToAnchor(id);
  }
}
