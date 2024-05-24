import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FaqComponent } from '../components/faq/faq.component';
import { ThemeService } from '../services/theme.service';
import { WebsiteConfigService } from '../services/website-config.service';
import { IntersectionElementDirective } from '../shared/directives/intersection-element.directive';
import { BackgroundColor } from '../shared/enums/background-color';
import { AccordionItem } from '../shared/models/accordion-item';
import { HowToCreate } from '../shared/models/how-to-create';
import { SafeHtmlPipe } from '../shared/pipe/safe-html.pipe';

@Component({
  selector: 'app-how-to-create',
  standalone: true,
  imports: [
    RouterModule,
    FaqComponent,
    IntersectionElementDirective,
    CommonModule,
    SafeHtmlPipe,
  ],
  templateUrl: './how-to-create.component.html',
  styleUrl: './how-to-create.component.scss',
})
export class HowToCreateComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly websiteConfigService: WebsiteConfigService =
    inject(WebsiteConfigService);

  private readonly subs: Subscription[] = [];

  protected faqList: AccordionItem[] = [];
  protected headerText = 'วิธีสร้างใบขอทุนสนับสนุน';
  protected howToCreateList: HowToCreate[] = [];

  protected navActiveIndex = 0;
  protected intersectionRootMargin = '-72px 0px -85% 0px';

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.scroller.setOffset([0, 80]);
    this.getFaq();
    this.getHowToCreate();
  }

  private getFaq() {
    this.subs.push(
      this.websiteConfigService.getFAQ().subscribe((faqList) => {
        if (faqList) {
          this.faqList = faqList?.map((faq) => ({
            header: faq.question,
            content: faq.answer,
          }));
        }
      })
    );
  }

  private getHowToCreate() {
    this.subs.push(
      this.websiteConfigService.getHowToCreate().subscribe((result) => {
        if (result) {
          this.howToCreateList = result;
        }
      })
    );
  }

  isIntersecting(intersecting: boolean, index: number) {
    console.log('===intersect', { index, intersecting });
    if (intersecting && index >= 0) {
      this.navActiveIndex = index;
      console.log('==this.navActiveIndex', this.navActiveIndex);
      console.log('=======');
    }
  }
}
