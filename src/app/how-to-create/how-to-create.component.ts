import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../components/button/button/button.component';
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
    ButtonComponent,
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
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly websiteConfigService: WebsiteConfigService =
    inject(WebsiteConfigService);

  private readonly subs: Subscription[] = [];

  protected faqList: AccordionItem[] = [];

  protected howToCreateList: HowToCreate[] = [];

  protected section1Header = 'วิธีสร้างใบขอทุนสนับสนุน';
  protected section2Header = 'ควรเตรียมเอกสารอะไรก่อนยื่นขอทุน';
  protected section3Header =
    'วิธีการลงทะเบียนและเข้าสู่ระบบเพื่อเข้าใช้งานเว็บไซต์';

  protected youtubeUrl = 'https://www.youtube.com/embed/lJIrF4YjHfQ';
  protected safeVideoUrl: SafeResourceUrl;

  protected navActiveIndex = 1;

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.scroller.setOffset([0, 80]);

    this.safeVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.youtubeUrl
    );

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
    if (intersecting && index) {
      this.navActiveIndex = index;
    }
  }
}
