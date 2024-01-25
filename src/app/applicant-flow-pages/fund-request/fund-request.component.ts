import { ViewportScroller } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-applicant-fund-request',
  standalone: true,
  imports: [],
  templateUrl: './fund-request.component.html',
  styleUrl: './fund-request.component.scss',
})
export class FundRequestComponent {
  @Input() form: FormGroup;
  @Input() enableScroll = false;

  private readonly scroller: ViewportScroller = inject(ViewportScroller);
}
