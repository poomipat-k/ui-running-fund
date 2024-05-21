import { Component, Input } from '@angular/core';
import { AccordionItem } from '../../shared/models/accordion-item';
import { AccordionComponent } from '../accordion/accordion.component';

@Component({
  selector: 'app-com-faq',
  standalone: true,
  imports: [AccordionComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  @Input() items: AccordionItem[] = [];
}
