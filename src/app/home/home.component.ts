import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { FaqComponent } from '../components/faq/faq.component';
import { DashboardApplicantComponent } from '../dashboard-applicant/dashboard-applicant.component';
import { DashboardReviewerComponent } from '../dashboard-reviewer/dashboard-reviewer.component';
import { ThemeService } from '../services/theme.service';
import { WebsiteConfigService } from '../services/website-config.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { Banner } from '../shared/models/banner';
import { SafeHtmlPipe } from '../shared/pipe/safe-html.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DashboardApplicantComponent,
    DashboardReviewerComponent,
    FaqComponent,
    CarouselComponent,
    RouterModule,
    SafeHtmlPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly websiteConfigService: WebsiteConfigService =
    inject(WebsiteConfigService);

  private readonly subs: Subscription[] = [];

  protected sliderItems: Banner[] = [];
  protected content = '';
  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);

    this.subs.push(
      this.websiteConfigService.getLandingPage().subscribe((result) => {
        if (result) {
          this.sliderItems = result.banner || [];
          this.content = result.content;
          console.log('==result', result);
        }
      })
    );
  }
}
