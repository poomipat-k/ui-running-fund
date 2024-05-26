import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionItem } from '../../shared/models/accordion-item';

@Component({
  selector: 'app-com-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  animations: [
    trigger('collapse', [
      transition(':enter', [
        style({ opacity: 0, maxHeight: 0 }),
        animate('300ms linear', style({ opacity: 1, maxHeight: '22rem' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, maxHeight: '22rem' }),
        animate('300ms linear', style({ opacity: 0, maxHeight: 0 })),
      ]),
    ]),
  ],
})
export class AccordionComponent {
  @Input() data: AccordionItem[] = [];

  protected activeIndex = 0;

  isActive(index: number) {
    return this.activeIndex === index;
  }

  onHeaderClick(index: number) {
    if (index === this.activeIndex) {
      this.activeIndex = -1;
      return;
    }
    this.activeIndex = index;
  }
}
